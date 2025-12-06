import logging

from fastapi import Depends
from fastapi.encoders import jsonable_encoder
from starlette.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
)
from fastapi.responses import FileResponse

from app.api.dependencies.database import get_repository
from app.core import constant
from app.core.config import get_app_settings
from app.core.settings.app import AppSettings
from app.database.repositories.files import FilesRepository
from app.models.user import User
from app.schemas.user import (
    UserAuthOutData,
    UserInCreate,
    UserInSignIn,
    UserInUpdate,
    UserOutData,
    UserResponse,
    UsersFilters,
)
from app.services.base import BaseService
from app.utils import ServiceResult, response_4xx, return_service
from uuid import UUID
from app.models.file import File

logger = logging.getLogger(__name__)


class FileService(BaseService):
    async def download_file_by_id(self,
                            file_id: UUID,
                            file_repository: FilesRepository = Depends(get_repository(FilesRepository)),
                            settings: AppSettings = Depends(get_app_settings)
    ) -> FileResponse:
        file_data = await file_repository.get_file_by_id(file_id=file_id)
        if not file_data:
            return response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": constant.FAIL_FILE_NOT_FOUND},
            )

        return FileResponse(
            path=f"{settings.static_dir}/{file_id}",
            media_type=file_data.mime,
            filename=file_data.original_name
        )