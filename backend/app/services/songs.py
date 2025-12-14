import logging
from fastapi import Depends, Form
from fastapi.encoders import jsonable_encoder
from pydantic_filters.plugins.fastapi import FilterDepends, PaginationDepends, SortDepends
from starlette.status import (
    HTTP_200_OK,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
)
from typing import Annotated
from uuid import UUID

from app.api.dependencies.database import get_repository
from app.api.dependencies.service import get_service
from app.core import constant
from app.core.config import get_app_settings
from app.core.settings.app import AppSettings
from app.database.repositories.authors import AuthorsRepository
from app.database.repositories.comment import CommentRepository
from app.database.repositories.files import FilesRepository
from app.database.repositories.groups import GroupsRepository
from app.database.repositories.groups import GroupsRepository
from app.database.repositories.songs import SongsRepository
from app.models.song_release import SongRelease
from app.models.song_release_file import SongReleaseFile
from app.models.user import User
from app.schemas.song import (
    SongDetailedResponse,
    SongOutData,
    FileOutNested,
    AuthorOutNested,
    GroupOutNested,
    SongFilter,
    SongSort,
    SongPagination,
    SongListResponse,
    SongShortOutData,
    AuthorShortOutNested,
    GroupShortOutNested,
    SongReleaseFilter,
    SongReleasePagination,
    SongReleaseSort,
    SongReleaseResponse,
    SongReleaseOutData,
    SongShortResponse,
    SongInCreate,
    SongReleaseInDB,
    SongEmptyResponse,
    SongCommentFilter,
    SongCommentPagination,
    SongCommentInDB,
    SongCommentInData,
    SongCommentSort,
    SongCommentOutData,
    SongCommentListResponse,
    SongCommentResponse,
)
from app.services.base import BaseService
from app.services.files import FileService
from app.utils import response_4xx, return_service

logger = logging.getLogger(__name__)


class SongsService(BaseService):
    def get_leading_audio_file(self, files: list[SongReleaseFile]) -> SongReleaseFile | None:
        return next((x for x in files if x.primary and x.file.mime.startswith("audio/")), None)

    @return_service
    async def get_song_releases_by_id_and_release_id(
            self,
            song_id: UUID,
            release_id: UUID | None,
            song_repo: SongsRepository = Depends(get_repository(SongsRepository)),
    ) -> SongDetailedResponse:
        song = await song_repo.get_song_releases_by_song_id_and_tag_filter(song_id=song_id, release_id=release_id)
        if not song:
            return response_4xx(
                status_code=HTTP_404_NOT_FOUND,
                context={"reason": "Не удалось найти песню"},
            )
        leading_audio_file = self.get_leading_audio_file(song.files)

        return dict(
            status_code=HTTP_200_OK,
            content={
                "message": constant.SUCCESS_GROUP_FOUND,
                "data": jsonable_encoder(SongOutData(
                    song_id=song_id,
                    id=song.id,
                    name=song.name,
                    description=song.description,
                    tag=song.tag,
                    bpm=song.bpm,
                    key=song.key,
                    duration=leading_audio_file.file.duration if leading_audio_file else None,
                    lyrics=song.lyrics,
                    files=[FileOutNested(id=file.file.id, name=file.file.original_name, mime=file.file.mime,
                                         leading=file.primary) for file in song.files],
                    authors=[AuthorOutNested(id=author.id, name=author.name, file_id=author.file_id) for author in
                             song.authors],
                    groups=[GroupOutNested(id=group.id, name=group.name, file_id=group.file_id) for group in
                            song.groups],
                )),
            },
        )

    @return_service
    async def get_song_releases(
            self,
            song_repo: SongsRepository = Depends(get_repository(SongsRepository)),
            filter_: SongFilter = FilterDepends(SongFilter),
            pagination: SongPagination = PaginationDepends(SongPagination),
            sort: SongSort = SortDepends(SongSort)
    ) -> SongListResponse:
        songs = await song_repo.get_song_releases(
            filter_=filter_,
            pagination=pagination,
            sort=sort
        )

        def mapper_function(song: SongRelease) -> SongShortOutData:
            primary_song_file = self.get_leading_audio_file(song.files)

            return SongShortOutData(
                song_id=song.song.id,
                id=song.id,
                tag=song.tag,
                name=song.name,
                authors=[AuthorShortOutNested(id=author.id, name=author.name) for author in song.authors],
                groups=[GroupShortOutNested(id=group.id, name=group.name) for group in song.groups],
                duration=primary_song_file.file.duration if primary_song_file else None
            )

        return dict(
            status_code=HTTP_200_OK,
            content={
                "message": constant.SUCCESS_GROUP_FOUND,
                "data": jsonable_encoder([mapper_function(song) for song in songs]),
            },
        )

    @return_service
    async def get_song_releases_minified(
            self,
            song_repo: SongsRepository = Depends(get_repository(SongsRepository)),
            filter_: SongReleaseFilter = FilterDepends(SongReleaseFilter),
            pagination: SongReleasePagination = PaginationDepends(SongReleasePagination),
            sort: SongReleaseSort = SortDepends(SongReleaseSort),
            song_id: UUID = None
    ) -> SongReleaseResponse:
        if not song_id:
            return response_4xx(
                status_code=HTTP_404_NOT_FOUND,
                context={"reason": "Айди песни не указан."},
            )

        songs = await song_repo.get_song_releases_short(
            filter_=filter_,
            pagination=pagination,
            sort=sort,
            song_id=song_id
        )

        return dict(
            status_code=HTTP_200_OK,
            content={
                "message": constant.SUCCESS_GROUP_FOUND,
                "data": jsonable_encoder([SongReleaseOutData(
                    id=song.id,
                    created_at=song.created_at,
                    description=song.description,
                    tag=song.tag
                ) for song in songs]),
            },
        )

    @return_service
    async def create_song(
            self,
            song_in: Annotated[SongInCreate, Form(media_type="multipart/form-data")],
            song_repo: SongsRepository = Depends(get_repository(SongsRepository)),
            author_repo: AuthorsRepository = Depends(get_repository(AuthorsRepository)),
            group_repo: GroupsRepository = Depends(get_repository(GroupsRepository)),
            song_id: UUID | None = None,
            files_service: FileService = Depends(get_service(FileService)),
            file_repository: FilesRepository = Depends(get_repository(FilesRepository)),
            settings: AppSettings = Depends(get_app_settings),
            token_user: User = None,
    ) -> SongShortResponse:
        song = None

        if not song_id:
            song = await song_repo.create_song()
        else:
            song = await song_repo.get_song(song_id=song_id)

        if not song:
            return response_4xx(
                status_code=HTTP_404_NOT_FOUND,
                context={"reason": "Не удалось найти или создать песню."},
            )

        authors = await author_repo.get_authors_with_ids(ids=song_in.authors)
        groups = await group_repo.get_groups_with_ids(ids=song_in.groups)

        song_release = await song_repo.create_song_release(song_in=SongReleaseInDB(
            name=song_in.name,
            tag=song_in.tag,
            description=song_in.description,
            bpm=song_in.bpm,
            key=song_in.key,
            lyrics=song_in.lyrics,
        ), song=song, authors=authors, groups=groups)

        if not song_release:
            return response_4xx(
                status_code=HTTP_404_NOT_FOUND,
                context={"reason": "Не удалось создать релиз песни."},
            )

        files = []
        for request_file in song_in.files_file:
            file = await files_service.create_file(file_repository=file_repository, settings=settings,
                                                   file=request_file)
            files.append(file)

        attached_files = await song_repo.attach_files_to_song_release(
            song_release=song_release,
            files=files,
            leading=song_in.files_leading
        )

        leading_audio_file = self.get_leading_audio_file(attached_files)

        return dict(
            status_code=HTTP_200_OK,
            content={
                "message": constant.SUCCESS_GROUP_FOUND,
                "data": jsonable_encoder(SongShortOutData(
                    song_id=song_release.song.id,
                    id=song_release.id,
                    tag=song_release.tag,
                    name=song_release.name,
                    authors=[AuthorShortOutNested(id=author.id, name=author.name) for author in authors],
                    groups=[GroupShortOutNested(id=author.id, name=author.name) for author in groups],
                    duration=leading_audio_file.file.duration if leading_audio_file else None
                )),
            },
        )

    @return_service
    async def delete_song(
            self,
            song_repo: SongsRepository = Depends(get_repository(SongsRepository)),
            token_user: User = None,
            song_id: UUID = None
    ) -> SongEmptyResponse:
        logger.info("Delete song")

        if not token_user:
            logger.error("Failed to delete song: you need to be authorized for this action")
            return response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": constant.FAIL_AUTH_CHECK},
            )

        song = await song_repo.get_song(song_id=song_id)

        if song is None:
            logger.error("Failed to delete song: failed to find song")
            return response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": constant.FAIL_GROUP_NOT_FOUND},
            )

        await song_repo.delete_song(song=song)

        return dict(
            status_code=HTTP_200_OK,
            content={
                "message": constant.SUCCESS_DELETE_GROUP,
            },
        )

    @return_service
    async def get_comments(
            self,
            comment_repo: CommentRepository = Depends(get_repository(CommentRepository)),
            song_repo: SongsRepository = Depends(get_repository(SongsRepository)),
            filter_: SongCommentFilter = FilterDepends(SongCommentFilter),
            sort: SongCommentSort = SortDepends(SongCommentSort),
            pagination: SongCommentPagination = PaginationDepends(SongCommentPagination),
            song_id: UUID | None = None
    ) -> SongCommentListResponse:
        song = await song_repo.get_song(song_id=song_id)

        if song is None:
            logger.error("Failed to delete song: failed to find song")
            return response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": "Песня не найдена."},
            )

        comments = await comment_repo.get_comments_for_song(song=song, filter_=filter_, pagination=pagination,
                                                            sort=sort)

        return dict(
            status_code=HTTP_200_OK,
            content={
                "message": constant.SUCCESS_GROUP_FOUND,
                "data": jsonable_encoder([SongCommentOutData(
                    id=comment.id,
                    created_at=comment.created_at,
                    created_by=comment.created_by.username,
                    content=comment.content
                ) for comment in comments]),
            },
        )

    @return_service
    async def create_comment(
            self,
            comment_in: SongCommentInData,
            comment_repo: CommentRepository = Depends(get_repository(CommentRepository)),
            song_repo: SongsRepository = Depends(get_repository(SongsRepository)),
            token_user: User = None,
            song_id: UUID | None = None,
    ) -> SongCommentResponse:
        song = await song_repo.get_song(song_id=song_id)

        if song is None:
            logger.error("Failed to delete song: failed to find song")
            return response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": "Песня не найдена."},
            )

        new_comment = await comment_repo.create_comment_for_song(song=song, comment_in=SongCommentInDB(
            created_by=token_user.username,
            content=comment_in.content
        ))

        return dict(
            status_code=HTTP_200_OK,
            content={
                "message": constant.SUCCESS_GROUP_FOUND,
                "data": jsonable_encoder(SongCommentOutData(
                    id=new_comment.id,
                    created_at=new_comment.created_at,
                    created_by=token_user.username,
                    content=new_comment.content
                )),
            },
        )
