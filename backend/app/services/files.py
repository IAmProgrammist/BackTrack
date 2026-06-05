import logging
from pathlib import Path
from tempfile import NamedTemporaryFile
from uuid import UUID

import aiofiles
import librosa
from fastapi import Depends, UploadFile
from fastapi.encoders import jsonable_encoder
from fastapi.responses import FileResponse, StreamingResponse
from starlette.status import HTTP_200_OK, HTTP_206_PARTIAL_CONTENT, HTTP_400_BAD_REQUEST

from app.api.dependencies.audio_manager import get_audio_manager
from app.api.dependencies.database import get_repository
from app.audio_manager.audio_manager import AudioManager, decode_stream_to_wave, get_wave_meta
from app.core import constant
from app.core.config import get_app_settings
from app.core.settings.app import AppSettings
from app.database.repositories.files import FilesRepository
from app.models.file import File
from app.schemas.files import FileInDB, FileOutMetadata, FilesResponse
from app.schemas.range import RangeHeader
from app.services.base import BaseService
from app.utils import response_4xx, return_service

logger = logging.getLogger(__name__)


class FileService(BaseService):
    def get_file_path(self, file_id: str, settings: AppSettings):
        return f"{settings.static_dir}/{file_id}"

    async def download_file_by_id(self, file_id: UUID, file_repository: FilesRepository = Depends(get_repository(FilesRepository)), settings: AppSettings = Depends(get_app_settings)) -> FileResponse:
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
        return FileResponse(headers={"Cache-Control": "public, max-age=360000"}, path=path, media_type=file_data.mime, filename=file_data.original_name)

    @return_service
    async def get_file_metadata_by_id(
        self, file_id: UUID, file_repository: FilesRepository = Depends(get_repository(FilesRepository)), settings: AppSettings = Depends(get_app_settings)
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

    async def create_file(
        self,
        audio_manager: AudioManager = Depends(get_audio_manager),
        file_repository: FilesRepository = Depends(get_repository(FilesRepository)),
        settings: AppSettings = Depends(get_app_settings),
        file: UploadFile = None,
        custom_audio_codec: bool = False,
    ) -> File | None:
        if not file:
            return None

        content = await file.read()

        # Step 1: create file in repository database
        file_metadata = await file_repository.create_file(file_in=FileInDB(mime=file.content_type, original_name=file.filename, duration=None))
        if not file_metadata:
            return None

        # Step 2: store file in a filesystem
        path = self.get_file_path(file_metadata.id, settings)
        Path(settings.static_dir).mkdir(parents=True, exist_ok=True)

        # Step 2.1: store using custom codec
        if custom_audio_codec and file.content_type in ["audio/wav", "audio/aiff"]:
            with NamedTemporaryFile(delete=True) as temp_file:
                temp_file.write(content)
                temp_file.flush()  # Ensure content is written

                audio_manager.encode(temp_file.name, path)
                file_metadata = await file_repository.update_file_mime(file=file_metadata, new_mime="audio/ae-flac")
        else:
            async with aiofiles.open(path, "wb") as out_file:
                await out_file.write(content)

        # Step 3: attempt to get duration of a file, if it is an audio file.
        if not file_metadata.mime.startswith("audio/"):
            return file_metadata

        with NamedTemporaryFile(delete=True) as temp_file:
            temp_file.write(content)
            temp_file.flush()  # Ensure content is written

            audio_duration = librosa.get_duration(path=temp_file.name) * 1000
            file_metadata = await file_repository.update_file_duration(file=file_metadata, new_duration=audio_duration)

        return file_metadata

    async def stream_audio_file(
        self,
        file_id: UUID,
        file_repository: FilesRepository = Depends(get_repository(FilesRepository)),
        settings: AppSettings = Depends(get_app_settings),
        audio_manager: AudioManager = Depends(get_audio_manager),
        range_header: RangeHeader | None = None,
    ):
        file = await file_repository.get_file_by_id(file_id=file_id)
        if file.mime != "audio/ae-flac":
            return await self.download_file_by_id(file_id=file_id, file_repository=file_repository, settings=settings)

        logger.info(f"Streaming file {file_id}")
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

        wave_length = (await get_wave_meta(audio_manager, path)) or 0
        skip, until = (0, wave_length - 1)

        if range_header:
            skip, until = range_header.to_tuple(wave_length)

        return StreamingResponse(
            decode_stream_to_wave(audio_manager, path, skip, until),
            media_type="audio/wav",
            status_code=(HTTP_206_PARTIAL_CONTENT),
            headers={
                "Accepts-Ranges": "bytes",
                "Cache-Control": "public, max-age=360000",
                "Content-Range": f"bytes {skip}-{until}/{wave_length}",
                "Content-Length": f"{until - skip}",
                "Content-Disposition": f'attachment; filename="{file.original_name}"',
            },
        )
