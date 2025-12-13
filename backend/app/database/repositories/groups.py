from pydantic_filters.drivers.sqlalchemy import append_to_statement
from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncConnection
from uuid import UUID

from app.database.repositories.base import BaseRepository, db_error_handler
from app.models.group import Group
from app.models.author import Author
from app.schemas.group import GroupFilter, GroupPagination, GroupSort, GroupInDB


class GroupsRepository(BaseRepository):
    def __init__(self, conn: AsyncConnection) -> None:
        super().__init__(conn)

    @db_error_handler
    async def get_group_by_id(self, *, group_id: UUID) -> Group:
        group = (await self.connection.execute(select(Group).join(Group.authors, isouter=True).filter(Group.id == group_id).limit(1))).scalar()

        return group

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
    async def get_groups_with_ids(
        self,
        *,
        ids: list[UUID]
    ) -> list[Group]:
        groups = (await self.connection.execute(select(Group).filter(Group.id.in_(ids)))).scalars().all()

        return groups

    @db_error_handler
    async def delete_group(self, *, group: Group):
        await self.connection.delete(group)
        await self.connection.commit()
