from pydantic_filters.drivers.sqlalchemy import append_to_statement
from sqlalchemy import and_, func, or_, select, func, delete
from sqlalchemy.ext.asyncio import AsyncConnection
from uuid import UUID

from app.database.repositories.base import BaseRepository, db_error_handler
from app.models.file import File
from app.models.playlist import Playlist
from app.models.playlist_song import PlaylistSong
from app.models.song_release import SongRelease
from app.models.song import Song
from app.models.song_release_file import SongReleaseFile
from app.schemas.playlist import PlaylistFilter, PlaylistPagination, PlaylistSort, PlaylistInDB


class PlaylistsRepository(BaseRepository):
    def __init__(self, conn: AsyncConnection) -> None:
        super().__init__(conn)

    @db_error_handler
    async def get_playlist_by_id(self, *, playlist_id: UUID) -> Playlist:
        # Dayum, dat chonk
        playlist = (await self.connection.execute(select(Playlist)
                                                  .join(Playlist.songs, isouter=True)
                                                  .join(PlaylistSong.song)
                                                  .join(Song.song_releases, isouter=True)
                                                  .join(SongRelease.authors, isouter=True)
                                                  .join(SongRelease.groups, isouter=True)
                                                  .join(SongRelease.files)
                                                  .join(SongReleaseFile.file)
                                                  .order_by(SongRelease.created_at.desc())
                                                  .filter(Playlist.id == playlist_id).limit(1))).scalar()

        return playlist

    @db_error_handler
    async def get_playlist_by_id_minified(self, *, playlist_id: UUID) -> Playlist:
        playlist = (await self.connection.execute(select(Playlist)
                                                  .join(Playlist.songs, isouter=True)
                                                  .filter(Playlist.id == playlist_id).limit(1))).scalar()

        return playlist

    @db_error_handler
    async def get_playlists(
            self,
            *,
            filter_: PlaylistFilter,
            pagination: PlaylistPagination,
            sort: PlaylistSort
    ) -> list[Playlist]:
        query = select(Playlist).distinct(Playlist.id).join(Playlist.songs, isouter=True).order_by(Playlist.id)

        query = append_to_statement(
            statement=query,
            model=Playlist,
            filter_=filter_,
            pagination=pagination,
            sort=sort
        )

        playlists = (await self.connection.execute(query)).scalars()

        return playlists

    @db_error_handler
    async def create_playlist(
            self,
            *,
            playlist_in: PlaylistInDB,
            file: File
    ) -> Playlist:
        created_playlist = Playlist(**playlist_in.model_dump(exclude_none=True), file=file)
        self.connection.add(created_playlist)
        await self.connection.commit()
        await self.connection.refresh(created_playlist)
        return created_playlist

    @db_error_handler
    async def attach_songs_to_playlist(
        self,
        *,
        playlist: Playlist,
        songs: list[Song],
        filters: list[str]
    ) -> list[PlaylistSong]:
        # First, we need to detach all playlist songs
        await self.connection.execute(delete(PlaylistSong).where(PlaylistSong.playlist_id == playlist.id))
        await self.connection.commit()
        await self.connection.refresh(playlist)

        # And only then, we can add new playlist-song records
        filter_songs = [PlaylistSong(playlist=playlist, song=song, filter=filter) for (song, filter) in
                 zip(songs, filters)]
        self.connection.add_all(filter_songs)
        await self.connection.commit()
        for song_release_file in filter_songs:
            await self.connection.refresh(song_release_file)
        return filter_songs

    @db_error_handler
    async def update_playlist(
            self,
            *,
            playlist: Playlist,
            playlist_in: PlaylistInDB,
            file: File
    ) -> Playlist:
        playlist_in_obj = playlist_in.model_dump(exclude_unset=True)
        playlist.file = file

        for key, val in playlist_in_obj.items():
            setattr(playlist, key, val)

        self.connection.add(playlist)
        await self.connection.commit()
        await self.connection.refresh(playlist)
        return playlist

    @db_error_handler
    async def get_playlists_for_song_release(
        self,
        *,
        song_release: SongRelease
    ) -> list[Playlist]:
        playlists = (await self.connection.execute(select(Playlist)
                    .join(Playlist.songs, isouter=True)
                    .join(PlaylistSong.song)
                    .join(Song.song_releases, isouter=True)
                    .filter(SongRelease.id == song_release.id))).scalars().all()

        return playlists

    @db_error_handler
    async def delete_playlist(self, *, playlist: Playlist):
        await self.connection.execute(delete(Playlist).where(Playlist.id == playlist.id))
        await self.connection.commit()
