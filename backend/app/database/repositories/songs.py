from pydantic_filters.drivers.sqlalchemy import append_to_statement
from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncConnection
from uuid import UUID

from app.database.repositories.base import BaseRepository, db_error_handler
from app.models.author import Author
from app.models.group import Group
from app.models.song import Song
from app.models.song_release import SongRelease
from app.models.song_release_file import SongReleaseFile
from app.schemas.group import GroupFilter, GroupPagination, GroupSort, GroupInDB


class SongsRepository(BaseRepository):
    def __init__(self, conn: AsyncConnection) -> None:
        super().__init__(conn)

    @db_error_handler
    async def get_song_by_song_id_and_tag_filter(self, *, song_id: UUID, release_id: UUID | None) -> SongRelease:
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
                .join(SongReleaseFile.file)
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
                .join(SongReleaseFile.file)
                .filter(Song.id == song_id)
                .order_by(SongRelease.created_at.desc())
                .limit(1)
            )
                    ).scalar()

        return song_release

    '''
    @db_error_handler
    async def get_groups_with_participants(
            self,
            *,
            filter_: GroupFilter,
            pagination: GroupPagination,
            sort: GroupSort
    ) -> list[Group]:
        # We should filter this manually. Ugh.
        authors_filter_data = filter_.authors
        filter_.authors = None
        query = select(Group).join(Group.authors, isouter=True)
        if authors_filter_data:
            query = query.filter(Author.id.in_(authors_filter_data.id))

        query = append_to_statement(
            statement=query,
            model=Group,
            filter_=filter_,
            pagination=pagination,
            sort=sort
        )

        groups = (await self.connection.execute(query)).scalars()

        return groups

    @db_error_handler
    async def create_group(
            self,
            *,
            group_in: GroupInDB,
            authors: Author
    ) -> Group:
        created_group = Group(**group_in.model_dump(exclude_none=True), authors=authors)
        self.connection.add(created_group)
        await self.connection.commit()
        await self.connection.refresh(created_group)
        return created_group

    @db_error_handler
    async def update_group(
            self,
            *,
            group: Group,
            group_in: GroupInDB
    ) -> Group:
        group_in_obj = group_in.model_dump(exclude_unset=True)

        for key, val in group_in_obj.items():
            setattr(group, key, val)

        self.connection.add(group)
        await self.connection.commit()
        await self.connection.refresh(group)
        return group

    @db_error_handler
    async def delete_group(self, *, group: Group):
        await self.connection.delete(group)
        await self.connection.commit()
    '''
