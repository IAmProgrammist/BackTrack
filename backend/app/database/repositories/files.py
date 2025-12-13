from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncConnection
from uuid import UUID

from app.database.repositories.base import BaseRepository, db_error_handler
from app.models.file import File
from app.schemas.files import FileInDB


class FilesRepository(BaseRepository):
    def __init__(self, conn: AsyncConnection) -> None:
        super().__init__(conn)

    @db_error_handler
    async def get_file_by_id(self, *, file_id: UUID) -> File:
        query = select(File).where(File.id == file_id).limit(1)

        raw_result = await self.connection.execute(query)
        result = raw_result.fetchone()

        return result.File if result is not None else result

    @db_error_handler
    async def update_file_duration(self, *, file: File, new_duration: int | None) -> File:
        file.duration = new_duration

        self.connection.add(file)
        await self.connection.commit()
        await self.connection.refresh(file)
        return file

    @db_error_handler
    async def create_file(self, *, file_in: FileInDB) -> File:
        created_file = File(**file_in.model_dump(exclude_none=True))
        self.connection.add(created_file)
        await self.connection.commit()
        await self.connection.refresh(created_file)
        return created_file
