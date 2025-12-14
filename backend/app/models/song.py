import uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.schema import ForeignKey
from typing import TYPE_CHECKING
from uuid import UUID

from app.models.comment_song import comment_song
from app.models.rwmodel import RWModel

if TYPE_CHECKING:
    from app.models.song_release import SongRelease
    from app.models.comment import Comment


class Song(RWModel):
    __tablename__ = "song"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    song_releases: Mapped[list["SongRelease"]] = relationship(back_populates="song")
    comments: Mapped[list["Comment"]] = relationship(
        secondary=comment_song, lazy="selectin"
    )
