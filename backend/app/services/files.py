import logging

from fastapi import Depends
from fastapi.encoders import jsonable_encoder
from starlette.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_200_OK
)
from fastapi.responses import FileResponse

from app.api.dependencies.database import get_repository
from app.core import constant
from app.core.config import get_app_settings
from app.core.settings.app import AppSettings
from app.database.repositories.files import FilesRepository
from app.schemas.files import FilesResponse, FileOutMetadata
from app.services.base import BaseService
from app.utils import response_4xx, return_service
from uuid import UUID
from pathlib import Path

logger = logging.getLogger(__name__)


class FileService(BaseService):
    async def download_file_by_id(self,
                            file_id: UUID,
                            file_repository: FilesRepository = Depends(get_repository(FilesRepository)),
                            settings: AppSettings = Depends(get_app_settings)
    ) -> FileResponse:
        logger.info(f"Downloading file {file_id}")
        file_data = await file_repository.get_file_by_id(file_id=file_id)
        path = f"{settings.static_dir}/{file_id}"

        if not Path(path).exists():
            logger.error(f"File {file_id} doesn't exists in filesystem")
            raise response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": constant.FAIL_FILE_NOT_FOUND},
            )

        if not file_data:
            logger.error(f"File {file_id} is not found in database")
            raise response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": constant.FAIL_FILE_NOT_FOUND},
            )

        logger.error(f"File {file_id} found successfully")
        response = FileResponse(
            path=path,
            media_type=file_data.mime,
            filename=file_data.original_name
        )
        response["Cache-Control"] = "public, max-age=360000"
        return response

    @return_service
    async def get_file_metadata_by_id(self,
                            file_id: UUID,
                            file_repository: FilesRepository = Depends(get_repository(FilesRepository)),
                            settings: AppSettings = Depends(get_app_settings)
    ) -> FilesResponse:
        logger.info(f"Getting file metadata {file_id}")
        file_data = await file_repository.get_file_by_id(file_id=file_id)
        if not file_data:
            logger.error(f"File {file_id} is not found in database")
            raise response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": constant.FAIL_FILE_NOT_FOUND},
            )
        
        """
        return dict(
            status_code=HTTP_200_OK,
            content={
                "message": constant.SUCCESS_MATCHED_USER_TOKEN,
                "data": jsonable_encoder(FileOutMetadata.model_validate(file_data)),
            },
        )
        """

    async def create_file(self,
        file_repository: FilesRepository = Depends(get_repository(FilesRepository)),
        settings: AppSettings = Depends(get_app_settings)
    ):
        # Step 1: create file in repository database
        # TODO: redo
        file_id = "7c6ff75c-867b-4427-8042-81f609ba904d"

        # Step 2: store file in a filesystem
        # TODO: redo
        path = f"{settings.static_dir}/{file_id}"
        Path(settings.static_dir).mkdir(parents=True, exist_ok=True)
        with open(path, "x") as f:
            pass
