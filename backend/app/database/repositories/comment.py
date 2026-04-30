from pydantic_filters.drivers.sqlalchemy import append_to_statement
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncConnection

from app.database.repositories.base import BaseRepository, db_error_handler
from app.models.comment import Comment
from app.models.song import Song
from app.models.user import User
from app.schemas.song import (
    SongCommentFilter,
    SongCommentPagination,
    SongCommentSort,
    SongCommentInDB
)


class CommentRepository(BaseRepository):
    def __init__(self, conn: AsyncConnection) -> None:
        super().__init__(conn)

    @db_error_handler
    async def get_comments_for_song(self, *, song: Song, filter_: SongCommentFilter, pagination: SongCommentPagination,
                                    sort: SongCommentSort) -> list[Comment]:
        query = select(Comment).join(Comment.songs).join(Comment.created_by).filter(Song.id == song.id)

        query = append_to_statement(
            statement=query,
            model=Comment,
            filter_=filter_,
            pagination=pagination,
            sort=sort
        )

        comments = (await self.connection.execute(query)).scalars()

        return comments

    @db_error_handler
    async def create_comment_for_song(self, *, song: Song, creator: User, comment_in: SongCommentInDB):
        song_comment = Comment(**comment_in.model_dump(exclude_none=True), songs=[song], created_by=creator)
        self.connection.add(song_comment)
        await self.connection.commit()
        await self.connection.refresh(song_comment)
        return song_comment
