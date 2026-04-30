from pydantic_filters.drivers.sqlalchemy import append_to_statement
from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncConnection
from uuid import UUID

from app.database.repositories.base import BaseRepository, db_error_handler
from app.models.author import Author
from app.schemas.author import AuthorFilter, AuthorPagination, AuthorSort, AuthorInDB


class AuthorsRepository(BaseRepository):
    def __init__(self, conn: AsyncConnection) -> None:
        super().__init__(conn)

    @db_error_handler
    async def get_author_by_id(self, *, author_id: UUID) -> Author:
        author = await self.connection.get(Author, author_id)

        return author

    @db_error_handler
    async def get_authors(
            self,
            *,
            filter_: AuthorFilter,
            pagination: AuthorPagination,
            sort: AuthorSort
    ) -> list[Author]:
        query = append_to_statement(
            statement=select(Author),
            model=Author,
            filter_=filter_,
            pagination=pagination,
            sort=sort
        )

        authors = (await self.connection.execute(query)).scalars()

        return authors

    @db_error_handler
    async def get_authors_with_ids(
            self,
            *,
            ids: list[UUID]
    ) -> list[Author]:
        authors = (await self.connection.execute(select(Author).filter(Author.id.in_(ids)))).scalars().all()

        return authors

    @db_error_handler
    async def create_author(
            self,
            *,
            author_in: AuthorInDB
    ) -> Author:
        created_author = Author(**author_in.model_dump(exclude_none=True))
        self.connection.add(created_author)
        await self.connection.commit()
        await self.connection.refresh(created_author)
        return created_author

    @db_error_handler
    async def update_author(
            self,
            *,
            author: Author,
            author_in: AuthorInDB
    ) -> Author:
        author_in_obj = author_in.model_dump(exclude_unset=True)

        for key, val in author_in_obj.items():
            setattr(author, key, val)

        self.connection.add(author)
        await self.connection.commit()
        await self.connection.refresh(author)
        return author

    @db_error_handler
    async def delete_author(self, *, author: Author):
        await self.connection.delete(author)
        await self.connection.commit()
