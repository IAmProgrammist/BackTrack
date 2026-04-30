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
from app.database.repositories.files import FilesRepository
from app.database.repositories.playlists import PlaylistsRepository
from app.database.repositories.songs import SongsRepository
from app.models.user import User
from app.schemas.playlist import (
    PlaylistFilter,
    PlaylistPagination,
    PlaylistSort,
    PlaylistResponse,
    PlaylistDetailedResponse,
    PlaylistEmptyResponse,
    PlaylistListResponse,
    PlaylistInCreate
)
from app.schemas.playlist import PlaylistResponse
from app.services.files import FileService
from app.services.songs import SongsService
from app.services.playlists import PlaylistsService
from app.utils import ERROR_RESPONSES, handle_result

router = APIRouter()


@router.get(
    "/{playlist_id}",
    status_code=HTTP_200_OK,
    responses=ERROR_RESPONSES,
    name="get_playlist",
    response_model=PlaylistDetailedResponse
)
async def get_playlist(*,
                    playlist_service: PlaylistsService = Depends(get_service(PlaylistsService)),
                    playlist_repository: PlaylistsRepository = Depends(get_repository(PlaylistsRepository)),
                    song_service: SongsService = Depends(get_service(SongsService)),
                    playlist_id: UUID
                    ) -> PlaylistDetailedResponse:
    response = await playlist_service.get_playlist_by_id(playlist_id=playlist_id, playlist_repo=playlist_repository, song_service=song_service)

    return await handle_result(response)


@router.get(
    "",
    status_code=HTTP_200_OK,
    responses=ERROR_RESPONSES,
    name="get_playlists",
    response_model=PlaylistListResponse
)
async def get_playlists(*,
                     playlist_service: PlaylistsService = Depends(get_service(PlaylistsService)),
                     playlists_filters: PlaylistFilter = FilterDepends(PlaylistFilter),
                     playlists_pagination: PlaylistPagination = PaginationDepends(PlaylistPagination),
                     playlists_sort: PlaylistSort = SortDepends(PlaylistSort),
                     playlist_repo: PlaylistsRepository = Depends(get_repository(PlaylistsRepository)),
                     ) -> PlaylistListResponse:
    response = await playlist_service.get_playlists(
        playlists_filters=playlists_filters,
        playlists_pagination=playlists_pagination,
        playlists_sort=playlists_sort,
        playlist_repo=playlist_repo
    )

    return await handle_result(response)

@router.post(
    "",
    status_code=HTTP_200_OK,
    responses=ERROR_RESPONSES,
    name="create_playlist",
    response_model=PlaylistResponse
)
async def create_playlist(*,
                       playlist_service: PlaylistsService = Depends(get_service(PlaylistsService)),
                       playlist_in: Annotated[PlaylistInCreate, Form(media_type="multipart/form-data")],
                       playlist_repo: PlaylistsRepository = Depends(get_repository(PlaylistsRepository)),
                       songs_repo: SongsRepository = Depends(get_repository(SongsRepository)),
                       files_service: FileService = Depends(get_service(FileService)),
                       file_repository: FilesRepository = Depends(get_repository(FilesRepository)),
                       settings: AppSettings = Depends(get_app_settings),
                       token_user: User = Depends(get_current_user_auth()),
                       ) -> PlaylistResponse:
    response = await playlist_service.create_playlist(
        playlist_in=playlist_in,
        playlist_repo=playlist_repo,
        songs_repo=songs_repo,
        files_service=files_service,
        file_repository=file_repository,
        settings=settings,
        token_user=token_user
    )

    return await handle_result(response)


@router.put(
    "/{playlist_id}",
    status_code=HTTP_200_OK,
    responses=ERROR_RESPONSES,
    name="update_playlist",
    response_model=PlaylistResponse
)
async def update_playlist(*,
                       playlist_service: PlaylistsService = Depends(get_service(PlaylistsService)),
                       playlist_in: Annotated[PlaylistInCreate, Form(media_type="multipart/form-data")],
                       playlist_repo: PlaylistsRepository = Depends(get_repository(PlaylistsRepository)),
                       files_service: FileService = Depends(get_service(FileService)),
                       file_repository: FilesRepository = Depends(get_repository(FilesRepository)),
                       settings: AppSettings = Depends(get_app_settings),
                       token_user: User = Depends(get_current_user_auth()),
                       songs_repo: SongsRepository = Depends(get_repository(SongsRepository)),
                       playlist_id: UUID
                       ) -> PlaylistResponse:
    response = await playlist_service.update_playlist(
        playlist_in=playlist_in,
        playlist_repo=playlist_repo,
        files_service=files_service,
        file_repository=file_repository,
        settings=settings,
        token_user=token_user,
        playlist_id=playlist_id,
        songs_repo=songs_repo
    )

    return await handle_result(response)


@router.delete(
    "/{playlist_id}",
    status_code=HTTP_200_OK,
    responses=ERROR_RESPONSES,
    name="delete_playlist",
    response_model=PlaylistEmptyResponse
)
async def delete_playlist(*,
                       playlist_service: PlaylistsService = Depends(get_service(PlaylistsService)),
                       playlist_repo: PlaylistsRepository = Depends(get_repository(PlaylistsRepository)),
                       token_user: User = Depends(get_current_user_auth()),
                       playlist_id: UUID
                       ) -> PlaylistEmptyResponse:
    response = await playlist_service.delete_playlist(
        playlist_repo=playlist_repo,
        token_user=token_user,
        playlist_id=playlist_id
    )

    return await handle_result(response)
