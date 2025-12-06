from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncConnection

from app.database.repositories.base import BaseRepository, db_error_handler
from app.models.file import File
from uuid import UUID


class FilesRepository(BaseRepository):
    def __init__(self, conn: AsyncConnection) -> None:
        super().__init__(conn)

    @db_error_handler
    async def get_file_by_id(self, *, file_id: UUID) -> File:
        query = select(File).where(File.id == file_id).limit(1)

        raw_result = await self.connection.execute(query)
        result = raw_result.fetchone()

        return result.File if result is not None else result
