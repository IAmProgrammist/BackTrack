import aiofiles
import logging
from fastapi import Depends, UploadFile
from fastapi.encoders import jsonable_encoder
from fastapi.responses import FileResponse
from pathlib import Path
from starlette.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_200_OK
)
from uuid import UUID

from app.api.dependencies.database import get_repository
from app.core import constant
from app.core.config import get_app_settings
from app.core.settings.app import AppSettings
from app.database.repositories.files import FilesRepository
from app.models.file import File
from app.schemas.files import FileInDB, FileOutMetadata, FilesResponse
from app.services.base import BaseService
from app.utils import response_4xx, return_service
import librosa

logger = logging.getLogger(__name__)


class FileService(BaseService):
    def get_file_path(self, file_id: str, settings: AppSettings):
        return f"{settings.static_dir}/{file_id}"
    
    async def download_file_by_id(self,
                                  file_id: UUID,
                                  file_repository: FilesRepository = Depends(get_repository(FilesRepository)),
                                  settings: AppSettings = Depends(get_app_settings)
                                  ) -> FileResponse:
        logger.info(f"Downloading file {file_id}")
        file_data = await file_repository.get_file_by_id(file_id=file_id)
        path = self.get_file_path(file_id, settings)

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
        return FileResponse(
            headers={
                "Cache-Control": "public, max-age=360000"
            },
            path=path,
            media_type=file_data.mime,
            filename=file_data.original_name
        )

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

        return dict(
            status_code=HTTP_200_OK,
            content={
                "message": constant.SUCCESS_MATCHED_USER_TOKEN,
                "data": jsonable_encoder(FileOutMetadata.model_validate(file_data)),
            },
        )

    async def create_file(self,
                          file_repository: FilesRepository = Depends(get_repository(FilesRepository)),
                          settings: AppSettings = Depends(get_app_settings),
                          file: UploadFile = None
                          ) -> File | None:
        if not file:
            return None

        # Step 1: create file in repository database
        file_metadata = await file_repository.create_file(file_in=FileInDB(mime=file.content_type, original_name=file.filename))
        if not file_metadata:
            return None

        # Step 2: store file in a filesystem
        path = self.get_file_path(file_metadata.id, settings)
        Path(settings.static_dir).mkdir(parents=True, exist_ok=True)
        async with aiofiles.open(path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)

        # Step 3: attempt to get duration of a file, if it is an audio file.
        if not file_metadata.mime.startswith("audio/"):
            return file_metadata

        audio_duration = librosa.get_duration(path=path) * 60 * 1000
        file_metadata = await file_repository.update_file_duration(file=file_metadata, new_duration=audio_duration)

        return file_metadata
