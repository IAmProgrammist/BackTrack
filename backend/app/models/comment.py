import uuid
from sqlalchemy import Column, DateTime, text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.schema import ForeignKey
from typing import TYPE_CHECKING
from uuid import UUID

from app.models.comment_song import comment_song
from app.models.rwmodel import RWModel

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.song import Song


class Comment(RWModel):
    __tablename__ = "comment"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    content: Mapped[str]
    created_by_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_by: Mapped["User"] = relationship(back_populates="comments", lazy="selectin")
    created_at = Column(DateTime, server_default=text("now()"), index=True)
    songs: Mapped[list["Song"]] = relationship(
        secondary=comment_song, lazy="selectin"
    )
