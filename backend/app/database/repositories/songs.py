from pydantic_filters.drivers.sqlalchemy import append_to_statement
from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncConnection
from uuid import UUID

from app.database.repositories.base import BaseRepository, db_error_handler
from app.models.author import Author
from app.models.file import File
from app.models.group import Group
from app.models.song import Song
from app.models.song_release import SongRelease
from app.models.song_release_file import SongReleaseFile
from app.schemas.song import (
    SongFilter,
    SongPagination,
    SongSort,
    SongReleaseSort,
    SongReleasePagination,
    SongReleaseFilter,
    SongReleaseInDB
)


class SongsRepository(BaseRepository):
    def __init__(self, conn: AsyncConnection) -> None:
        super().__init__(conn)

    @db_error_handler
    async def get_song_releases_by_song_id_and_tag_filter(self, *, song_id: UUID,
                                                          release_id: UUID | None) -> SongRelease:
        # Holy cow, that's a lot! Definetely need to cache this... This.
        # Do not forget to add Cache-Control for everything that uses this
        # method!
        if release_id:
            song_release = (await self.connection.execute(
                select(SongRelease)
                .join(SongRelease.song)
                .join(SongRelease.authors)
                .join(SongRelease.groups)
                .join(SongRelease.files)
                .filter(Song.id == song_id)
                .filter(SongRelease.id == release_id)
                .limit(1)
            )
                            ).scalar()
        else:
            song_release = (await self.connection.execute(
                select(SongRelease)
                .join(SongRelease.song)
                .join(SongRelease.authors)
                .join(SongRelease.groups)
                .join(SongRelease.files)
                .filter(Song.id == song_id)
                .order_by(SongRelease.created_at.desc())
                .limit(1)
            )
                            ).scalar()

        return song_release

    @db_error_handler
    async def get_song_releases(
            self,
            *,
            filter_: SongFilter,
            pagination: SongPagination,
            sort: SongSort
    ) -> list[Song]:
        authors_filter_data = filter_.authors_id__in
        groups_filter_data = filter_.groups_id__in
        id_filter_data = filter_.id__in

        filter_.authors_id__in = None
        filter_.groups_id__in = None
        filter_.id__in = None

        query = (
            select(SongRelease)
            .distinct(SongRelease.song_id)
            .join(SongRelease.song)
            .join(SongRelease.authors)
            .join(SongRelease.groups)
            .join(SongRelease.files)
            .join(SongReleaseFile.file)
            .order_by(SongRelease.song_id, SongRelease.created_at.desc())
        )

        if authors_filter_data:
            query = query.filter(Author.id.in_(authors_filter_data))

        if groups_filter_data:
            query = query.filter(Group.id.in_(groups_filter_data))

        if id_filter_data:
            query = query.filter(Song.id.in_(id_filter_data))

        query = append_to_statement(
            statement=query,
            model=SongRelease,
            filter_=SongFilter(**filter_.model_dump(exclude_unset=True, exclude_none=True)),
            pagination=pagination,
            sort=sort
        )

        songs = (await self.connection.execute(query)).scalars()

        return songs

    @db_error_handler
    async def get_song(
            self,
            *,
            song_id: UUID
    ) -> Song:
        song = (await self.connection.execute(
            select(Song)
            .filter(Song.id == song_id)
            .limit(1)
        )).scalar()

        return song

    @db_error_handler
    async def get_song_releases_short(
            self,
            *,
            filter_: SongFilter,
            pagination: SongPagination,
            sort: SongSort,
            song_id: UUID
    ) -> list[Song]:
        query = (
            select(SongRelease).filter(SongRelease.song_id == song_id)
        )

        query = append_to_statement(
            statement=query,
            model=SongRelease,
            filter_=filter_,
            pagination=pagination,
            sort=sort
        )

        songs = (await self.connection.execute(query)).scalars()

        return songs

    @db_error_handler
    async def create_song(
            self
    ):
        created_song = Song()
        self.connection.add(created_song)
        await self.connection.commit()
        await self.connection.refresh(created_song)
        return created_song

    @db_error_handler
    async def create_song_release(
            self,
            *,
            song_in: SongReleaseInDB,
            song: Song,
            authors: list[Author],
            groups: list[Group]
    ) -> SongRelease:
        created_release = SongRelease(**song_in.model_dump(exclude_none=True), authors=authors, groups=groups,
                                      song=song)
        self.connection.add(created_release)
        await self.connection.commit()
        await self.connection.refresh(created_release)
        return created_release

    @db_error_handler
    async def attach_files_to_song_release(
            self,
            *,
            song_release: SongRelease,
            files: list[File],
            leading: list[bool]
    ) -> list[SongReleaseFile]:
        files = [SongReleaseFile(song_release=song_release, primary=leading, file=file) for (file, leading) in
                 zip(files, leading)]
        self.connection.add_all(files)
        await self.connection.commit()
        for song_release_file in files:
            await self.connection.refresh(song_release_file)
        return files

    @db_error_handler
    async def get_songs_with_ids(
        self,
        *,
        ids: list[UUID]
    ) -> list[Song]:
        groups = (await self.connection.execute(select(Song).filter(Song.id.in_(ids)))).scalars().all()

        return groups

    @db_error_handler
    async def delete_song(self, *, song: Song):
        await self.connection.delete(song)
        await self.connection.commit()
