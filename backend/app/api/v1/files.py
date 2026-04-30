from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from starlette.status import HTTP_200_OK, HTTP_201_CREATED
from uuid import UUID

from app.api.dependencies.auth import get_current_user_auth
from app.api.dependencies.database import get_repository
from app.api.dependencies.service import get_service
from app.core.config import get_app_settings
from app.core.settings.app import AppSettings
from app.database.repositories.files import FilesRepository
from app.models.file import File
from app.schemas.files import FilesResponse
from app.services.files import FileService
from app.utils import ERROR_RESPONSES, ServiceResult, handle_result

router = APIRouter()


@router.get(
    "/{file_id}/download",
    status_code=HTTP_200_OK,
    responses=ERROR_RESPONSES,
    name="download_file",
    response_class=FileResponse
)
async def download_file(*,
                        files_service: FileService = Depends(get_service(FileService)),
                        files_repository: FilesRepository = Depends(get_repository(FilesRepository)),
                        settings: AppSettings = Depends(get_app_settings),
                        file_id: UUID
                        ) -> FileResponse:
    response = await files_service.download_file_by_id(file_repository=files_repository, file_id=file_id,
                                                       settings=settings)

    return response


@router.get(
    "/{file_id}",
    status_code=HTTP_200_OK,
    responses=ERROR_RESPONSES,
    name="get_file",
    response_model=FilesResponse
)
async def get_file(*,
                   files_service: FileService = Depends(get_service(FileService)),
                   files_repository: FilesRepository = Depends(get_repository(FilesRepository)),
                   settings: AppSettings = Depends(get_app_settings),
                   file_id: UUID
                   ) -> FilesResponse:
    response = await files_service.get_file_metadata_by_id(file_repository=files_repository, file_id=file_id,
                                                           settings=settings)

    return response
