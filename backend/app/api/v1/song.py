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
from app.database.repositories.comment import CommentRepository
from app.database.repositories.files import FilesRepository
from app.database.repositories.groups import GroupsRepository
from app.database.repositories.songs import SongsRepository
from app.database.repositories.playlists import PlaylistsRepository
from app.models.user import User
from app.schemas.song import (
    SongDetailedResponse,
    SongFilter,
    SongSort,
    SongPagination,
    SongListResponse,
    SongReleaseFilter,
    SongReleasePagination,
    SongReleaseSort,
    SongReleaseResponse,
    SongInCreate,
    SongEmptyResponse,
    SongShortResponse,
    SongCommentListResponse,
    SongCommentResponse,
    SongCommentFilter,
    SongCommentPagination,
    SongCommentSort,
    SongCommentInData,
)
from app.services.files import FileService
from app.services.songs import SongsService
from app.utils import ERROR_RESPONSES, handle_result

router = APIRouter()


@router.get(
    "/{song_id}",
    status_code=HTTP_200_OK,
    responses=ERROR_RESPONSES,
    name="get_song",
    response_model=SongDetailedResponse
)
async def get_song(*,
                   song_service: SongsService = Depends(get_service(SongsService)),
                   song_repo: SongsRepository = Depends(get_repository(SongsRepository)),
                   playlist_repo: PlaylistsRepository = Depends(get_repository(PlaylistsRepository)),
                   song_id: UUID,
                   release_id: UUID | None = None
                   ) -> SongDetailedResponse:
    song = await song_service.get_song_releases_by_id_and_release_id(song_repo=song_repo, song_id=song_id,
                                                                     release_id=release_id, playlist_repo=playlist_repo)

    return await handle_result(song)


@router.get(
    "",
    status_code=HTTP_200_OK,
    responses=ERROR_RESPONSES,
    name="get_songs",
    response_model=SongListResponse
)
async def get_songs(*,
                    song_repo: SongsRepository = Depends(get_repository(SongsRepository)),
                    filter_: SongFilter = FilterDepends(SongFilter),
                    pagination: SongPagination = PaginationDepends(SongPagination),
                    sort: SongSort = SortDepends(SongSort),
                    song_service: SongsService = Depends(get_service(SongsService)),
                    ) -> SongListResponse:
    songs = await song_service.get_song_releases(song_repo=song_repo, filter_=filter_, pagination=pagination, sort=sort)

    return await handle_result(songs)


@router.get(
    "/{song_id}/releases",
    status_code=HTTP_200_OK,
    responses=ERROR_RESPONSES,
    name="get_song_releases",
    response_model=SongReleaseResponse
)
async def get_songs_releases(*,
                             song_service: SongsService = Depends(get_service(SongsService)),
                             song_repo: SongsRepository = Depends(get_repository(SongsRepository)),
                             filter_: SongReleaseFilter = FilterDepends(SongReleaseFilter),
                             pagination: SongReleasePagination = PaginationDepends(SongReleasePagination),
                             sort: SongReleaseSort = SortDepends(SongReleaseSort),
                             song_id: UUID = None) -> SongReleaseResponse:
    songs = await song_service.get_song_releases_minified(song_repo=song_repo, filter_=filter_, pagination=pagination,
                                                          sort=sort, song_id=song_id)

    return await handle_result(songs)


@router.post(
    "",
    status_code=HTTP_200_OK,
    responses=ERROR_RESPONSES,
    name="create_song",
    response_model=SongShortResponse
)
async def create_song(*,
                      song_service: SongsService = Depends(get_service(SongsService)),
                      song_in: Annotated[SongInCreate, Form(media_type="multipart/form-data")],
                      song_repo: SongsRepository = Depends(get_repository(SongsRepository)),
                      author_repo: AuthorsRepository = Depends(get_repository(AuthorsRepository)),
                      group_repo: GroupsRepository = Depends(get_repository(GroupsRepository)),
                      song_id: UUID | None = None,
                      files_service: FileService = Depends(get_service(FileService)),
                      file_repository: FilesRepository = Depends(get_repository(FilesRepository)),
                      settings: AppSettings = Depends(get_app_settings),
                      token_user: User = Depends(get_current_user_auth())) -> SongShortResponse:
    release_song = await song_service.create_song(
        song_in=song_in,
        song_repo=song_repo,
        author_repo=author_repo,
        group_repo=group_repo,
        song_id=song_id,
        files_service=files_service,
        file_repository=file_repository,
        settings=settings,
        token_user=token_user
    )

    return await handle_result(release_song)


@router.delete(
    "/{song_id}",
    status_code=HTTP_200_OK,
    responses=ERROR_RESPONSES,
    name="delete_song",
    response_model=SongEmptyResponse
)
async def delete_song(*,
                      song_service: SongsService = Depends(get_service(SongsService)),
                      song_repo: SongsRepository = Depends(get_repository(SongsRepository)),
                      song_id: UUID,
                      token_user: User = Depends(get_current_user_auth())) -> SongEmptyResponse:
    response = await song_service.delete_song(
        song_repo=song_repo,
        song_id=song_id,
        token_user=token_user
    )

    return await handle_result(response)


@router.get(
    "/{song_id}/comments",
    status_code=HTTP_200_OK,
    responses=ERROR_RESPONSES,
    name="get_song_comments",
    response_model=SongCommentListResponse
)
async def get_song_comments(*,
                            song_service: SongsService = Depends(get_service(SongsService)),
                            comment_repo: CommentRepository = Depends(get_repository(CommentRepository)),
                            song_repo: SongsRepository = Depends(get_repository(SongsRepository)),
                            filter_: SongCommentFilter = FilterDepends(SongCommentFilter),
                            sort: SongCommentSort = SortDepends(SongCommentSort),
                            pagination: SongCommentPagination = PaginationDepends(SongCommentPagination),
                            song_id: UUID | None = None
                            ) -> SongCommentListResponse:
    comments = await song_service.get_comments(
        comment_repo=comment_repo,
        song_repo=song_repo,
        filter_=filter_,
        sort=sort,
        pagination=pagination,
        song_id=song_id
    )

    return await handle_result(comments)


@router.post(
    "/{song_id}/comments",
    status_code=HTTP_200_OK,
    responses=ERROR_RESPONSES,
    name="create_song_comment",
    response_model=SongCommentResponse
)
async def create_song_comment(*,
                              song_service: SongsService = Depends(get_service(SongsService)),
                              comment_in: SongCommentInData,
                              comment_repo: CommentRepository = Depends(get_repository(CommentRepository)),
                              song_repo: SongsRepository = Depends(get_repository(SongsRepository)),
                              token_user: User = Depends(get_current_user_auth()),
                              song_id: UUID | None = None,
                              ) -> SongCommentListResponse:
    comment = await song_service.create_comment(
        comment_in=comment_in,
        comment_repo=comment_repo,
        song_repo=song_repo,
        token_user=token_user,
        song_id=song_id
    )

    return await handle_result(comment)
