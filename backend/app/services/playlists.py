import logging
from fastapi import Depends, Form
from fastapi.encoders import jsonable_encoder
from pydantic_filters.plugins.fastapi import FilterDepends, PaginationDepends, SortDepends
from starlette.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_500_INTERNAL_SERVER_ERROR
)
from typing import Annotated
from uuid import UUID, uuid4

from app.api.dependencies.database import get_repository
from app.api.dependencies.service import get_service
from app.core import constant
from app.core.config import get_app_settings
from app.core.settings.app import AppSettings
from app.database.repositories.files import FilesRepository
from app.database.repositories.playlists import PlaylistsRepository
from app.database.repositories.songs import SongsRepository
from app.models.user import User
from app.models.playlist_song import PlaylistSong
from app.services.songs import SongsService
from app.schemas.playlist import (
    PlaylistInCreate,
    PlaylistInUpdate,
    PlaylistInDB,
    PlaylistFilter,
    PlaylistPagination,
    PlaylistSort,
    PlaylistDetailedResponse,
    PlaylistEmptyResponse,
    PlaylistListResponse,
    PlaylistResponse,
    PlaylistShortOutData,
    PlaylistExtendedOutAuthors,
    PlaylistExtendedOutData,
    PlaylistExtendedOutGroups,
    PlaylistExtendedOutTracks
)
from app.services.base import BaseService
from app.services.files import FileService
from app.utils import ServiceResult, response_4xx, return_service
from app.utils.filter_song_releases_with_filter import filter_song_releases_according_to_filter

logger = logging.getLogger(__name__)


class PlaylistsService(BaseService):
    @return_service
    async def get_playlist_by_id(
            self,
            playlist_id: UUID,
            playlist_repo: PlaylistsRepository = Depends(get_repository(PlaylistsRepository)),
            song_service: SongsService = Depends(get_service(SongsService))
    ) -> PlaylistDetailedResponse:
        playlist = await playlist_repo.get_playlist_by_id(playlist_id=playlist_id)
        if not playlist:
            return response_4xx(
                status_code=HTTP_404_NOT_FOUND,
                context={"reason": constant.FAIL_PLAYLIST_NOT_FOUND},
            )

        def track_mapper_function(track: PlaylistSong):
            fitting_release = filter_song_releases_according_to_filter(track.song.song_releases, track.filter)
            if len(fitting_release) == 0:
                return PlaylistExtendedOutTracks(
                    id=track.song.id,
                    name="Песня не найдена. Уточните фильтр",
                    filter=track.filter,
                    groups=[],
                    authors=[],
                    duration=None
                )

            fitting_track = fitting_release[-1]

            leading_audio = song_service.get_leading_audio_file(fitting_track.files)

            return PlaylistExtendedOutTracks(
                id=track.song.id,
                name=fitting_track.name,
                filter=track.filter,
                groups=[PlaylistExtendedOutGroups(id=group.id, name=group.name) for group in fitting_track.groups],
                authors=[PlaylistExtendedOutAuthors(id=author.id, name=author.name) for author in fitting_track.authors],
                duration=leading_audio.file.duration if leading_audio else None
            )

        return dict(
            status_code=HTTP_200_OK,
            content={
                "message": constant.SUCCESS_PLAYLIST_FOUND,
                "data": jsonable_encoder(PlaylistExtendedOutData(
                    id=playlist.id,
                    name=playlist.name,
                    description=playlist.description,
                    file_id=playlist.file_id,
                    tracks=[track_mapper_function(track) for track in playlist.songs]
                )),
            },
        )

    @return_service
    async def get_playlists(
            self,
            playlists_filters: PlaylistFilter = FilterDepends(PlaylistFilter),
            playlists_pagination: PlaylistPagination = PaginationDepends(PlaylistPagination),
            playlists_sort: PlaylistSort = SortDepends(PlaylistSort),
            playlist_repo: PlaylistsRepository = Depends(get_repository(PlaylistsRepository)),
    ) -> PlaylistListResponse:
        playlists = await playlist_repo.get_playlists(filter_=playlists_filters, pagination=playlists_pagination,
                                                               sort=playlists_sort)

        if not playlists:
            return response_4xx(
                status_code=HTTP_404_NOT_FOUND,
                context={"reason": constant.FAIL_VALIDATION_MATCHED_FILTERED_USERS},
            )

        return dict(
            status_code=HTTP_200_OK,
            content={
                "message": constant.SUCCESS_GET_USERS,
                "data": jsonable_encoder([PlaylistShortOutData(
                    id=playlist.id,
                    name=playlist.name,
                    tracks_amount=len(playlist.songs),
                    file_id=playlist.file_id
                ) for playlist in playlists]),
            },
        )


    @return_service
    async def create_playlist(
            self,
            playlist_in: Annotated[PlaylistInCreate, Form(media_type="multipart/form-data")],
            playlist_repo: PlaylistsRepository = Depends(get_repository(PlaylistsRepository)),
            songs_repo: SongsRepository = Depends(get_repository(SongsRepository)),
            files_service: FileService = Depends(get_service(FileService)),
            file_repository: FilesRepository = Depends(get_repository(FilesRepository)),
            settings: AppSettings = Depends(get_app_settings),
            token_user: User = None,
    ) -> PlaylistResponse:
        logger.info("Creating playlist")

        if not token_user:
            logger.error("Failed to create playlist: you need to be authorized for this action")
            return response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": constant.FAIL_AUTH_CHECK},
            )

        if not playlist_in.file.content_type.startswith("image/"):
            logger.error("Failed to create playlist: invalid image")
            return response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": constant.FAIL_PLAYLIST_FILE_NOT_IMAGE},
            )

        stored_file = await files_service.create_file(file_repository=file_repository, settings=settings,
                                                      file=playlist_in.file)
        if not stored_file:
            logger.error("Failed to create playlist: failed to save file")
            return response_4xx(
                status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                context={"reason": constant.FAIL_PLAYLIST_COULDNT_SAVE_FILE},
            )

        playlist = await playlist_repo.create_playlist(
            playlist_in=PlaylistInDB(name=playlist_in.name, description=playlist_in.description),
            file=stored_file
        )
        if not playlist:
            logger.error("Failed to create playlist")
            return response_4xx(
                status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                context={"reason": constant.FAIL_PLAYLIST_COULDNT_SAVE},
            )

        songs = await songs_repo.get_songs_with_ids(ids=playlist_in.songs_ids)

        attached_songs = await playlist_repo.attach_songs_to_playlist(playlist=playlist, songs=songs, filters=playlist_in.songs_filters)

        return dict(
            status_code=HTTP_200_OK,
            content={
                "message": constant.SUCCESS_PLAYLIST_FOUND,
                "data": jsonable_encoder(PlaylistShortOutData(
                    id=playlist.id,
                    name=playlist.name,
                    tracks_amount=len(attached_songs),
                    file_id=playlist.file_id
                )),
            },
        )

    @return_service
    async def update_playlist(
            self,
            playlist_in: Annotated[PlaylistInCreate, Form(media_type="multipart/form-data")],
            playlist_repo: PlaylistsRepository = Depends(get_repository(PlaylistsRepository)),
            songs_repo: SongsRepository = Depends(get_repository(SongsRepository)),
            files_service: FileService = Depends(get_service(FileService)),
            file_repository: FilesRepository = Depends(get_repository(FilesRepository)),
            settings: AppSettings = Depends(get_app_settings),
            token_user: User = None,
            playlist_id: UUID = None,
    ) -> PlaylistResponse:
        logger.info("Update playlist")

        if not token_user:
            logger.error("Failed to update playlist: you need to be playlistized for this action")
            return response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": constant.FAIL_AUTH_CHECK},
            )

        playlist = await playlist_repo.get_playlist_by_id_minified(playlist_id=playlist_id)

        if playlist is None:
            logger.error("Failed to update playlist: failed to find playlist")
            return response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": constant.FAIL_PLAYLIST_NOT_FOUND},
            )

        if not playlist_in.file.content_type.startswith("image/"):
            logger.error("Failed to update playlist: invalid image")
            return response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": constant.FAIL_PLAYLIST_FILE_NOT_IMAGE},
            )

        stored_file = await files_service.create_file(file_repository=file_repository, settings=settings,
                                                      file=playlist_in.file)
        if not stored_file:
            logger.error("Failed to create playlist: failed to save file")
            return response_4xx(
                status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                context={"reason": constant.FAIL_PLAYLIST_COULDNT_SAVE_FILE},
            )

        playlist = await playlist_repo.update_playlist(
            playlist=playlist,
            playlist_in=PlaylistInDB(name=playlist_in.name, description=playlist_in.description, file_id=stored_file.id),
            file=stored_file
        )
        if not playlist:
            logger.error("Failed to create playlist")
            return response_4xx(
                status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                context={"reason": constant.FAIL_PLAYLIST_COULDNT_SAVE},
            )

        songs = await songs_repo.get_songs_with_ids(ids=playlist_in.songs_ids)

        attached_songs = await playlist_repo.attach_songs_to_playlist(playlist=playlist, songs=songs, filters=playlist_in.songs_filters)

        return dict(
            status_code=HTTP_200_OK,
            content={
                "message": constant.SUCCESS_PLAYLIST_FOUND,
                "data": jsonable_encoder(PlaylistShortOutData(
                    id=playlist.id,
                    name=playlist.name,
                    tracks_amount=len(attached_songs),
                    file_id=playlist.file_id
                )),
            },
        )

    @return_service
    async def delete_playlist(
            self,
            playlist_repo: PlaylistsRepository = Depends(get_repository(PlaylistsRepository)),
            token_user: User = None,
            playlist_id: UUID = None
    ) -> PlaylistEmptyResponse:
        logger.info("Delete playlist")

        if not token_user:
            logger.error("Failed to delete playlist: you need to be playlistized for this action")
            return response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": constant.FAIL_AUTH_CHECK},
            )

        playlist = await playlist_repo.get_playlist_by_id(playlist_id=playlist_id)

        if playlist is None:
            logger.error("Failed to delete playlist: failed to find playlist")
            return response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": constant.FAIL_PLAYLIST_NOT_FOUND},
            )

        await playlist_repo.delete_playlist(playlist=playlist)

        return dict(
            status_code=HTTP_200_OK,
            content={
                "message": constant.SUCCESS_DELETE_PLAYLIST,
            },
        )
