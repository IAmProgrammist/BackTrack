from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse, StreamingResponse
from starlette.status import HTTP_200_OK

from app.api.dependencies.audio_manager import get_audio_manager
from app.api.dependencies.database import get_repository
from app.api.dependencies.service import get_service
from app.audio_manager.audio_manager import AudioManager
from app.core.config import get_app_settings
from app.core.settings.app import AppSettings
from app.database.repositories.files import FilesRepository
from app.schemas.files import FilesResponse
from app.schemas.range import RangeHeader, parse_range_header
from app.services.files import FileService
from app.utils import ERROR_RESPONSES

router = APIRouter()


@router.get("/{file_id}/download", status_code=HTTP_200_OK, responses=ERROR_RESPONSES, name="download_file", response_class=FileResponse)
async def download_file(
    *,
    files_service: FileService = Depends(get_service(FileService)),
    files_repository: FilesRepository = Depends(get_repository(FilesRepository)),
    settings: AppSettings = Depends(get_app_settings),
    file_id: UUID,
) -> FileResponse:
    response = await files_service.download_file_by_id(file_repository=files_repository, file_id=file_id, settings=settings)

    return response


@router.get("/{file_id}", status_code=HTTP_200_OK, responses=ERROR_RESPONSES, name="get_file", response_model=FilesResponse)
async def get_file(
    *,
    files_service: FileService = Depends(get_service(FileService)),
    files_repository: FilesRepository = Depends(get_repository(FilesRepository)),
    settings: AppSettings = Depends(get_app_settings),
    file_id: UUID,
) -> FilesResponse:
    response = await files_service.get_file_metadata_by_id(file_repository=files_repository, file_id=file_id, settings=settings)

    return response


@router.get(
    "/{file_id}/stream-audio",
    status_code=HTTP_200_OK,
    responses=ERROR_RESPONSES,
    name="stream_audio_file",
    response_model=None,
)
async def get_stream_audio_file(
    *,
    files_service: FileService = Depends(get_service(FileService)),
    files_repository: FilesRepository = Depends(get_repository(FilesRepository)),
    settings: AppSettings = Depends(get_app_settings),
    audio_manager: AudioManager = Depends(get_audio_manager),
    range_header: RangeHeader | None = Depends(parse_range_header),
    file_id: UUID,
) -> StreamingResponse | FileResponse:
    print(f"You betrayed goo {range_header}")
    response = await files_service.stream_audio_file(file_repository=files_repository, file_id=file_id, settings=settings, audio_manager=audio_manager, range_header=range_header)

    return response
