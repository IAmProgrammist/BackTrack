from fastapi import APIRouter, Depends, Form
from pydantic_filters.plugins.fastapi import FilterDepends, PaginationDepends, SortDepends
from starlette.status import HTTP_200_OK
from typing import Annotated
from uuid import UUID

from app.api.dependencies.auth import get_current_user_auth
from app.api.dependencies.database import get_repository
from app.api.dependencies.service import get_service
from app.core.config import get_app_settings
from app.core.settings.app import AppSettings
from app.database.repositories.authors import AuthorsRepository
from app.database.repositories.files import FilesRepository
from app.database.repositories.groups import GroupsRepository
from app.models.user import User
from app.schemas.group import (
    GroupFilter,
    GroupPagination,
    GroupSort,
    GroupResponse,
    GroupDetailedResponse,
    GroupEmptyResponse,
    GroupListResponse,
    GroupInCreate
)
from app.schemas.song import (
    SongDetailedResponse
)
from app.services.songs import SongsService
from app.database.repositories.songs import SongsRepository
from app.schemas.group import GroupResponse
from app.services.files import FileService
from app.services.groups import GroupsService
from app.utils import ERROR_RESPONSES, handle_result

router = APIRouter()

@router.get(
    "/{song_id}",
    status_code=HTTP_200_OK,
    responses=ERROR_RESPONSES,
    name="get_song",
    response_model=SongDetailedResponse
)
async def create_group(*,
                       song_service: SongsService = Depends(get_service(SongsService)),
                       song_repo: SongsRepository = Depends(get_repository(SongsRepository)),
                       song_id: UUID,
                       release_id: UUID | None = None
                       ) -> SongDetailedResponse:
    song = song_service.get_song_by_id_and_release_id(song_repo=song_repo, song_id=song_id, release_id=release_id)

    return await handle_result(song)
