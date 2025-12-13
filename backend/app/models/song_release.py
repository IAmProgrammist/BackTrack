import uuid
from app.models.group_author import group_author
from sqlalchemy import Column, DateTime, text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.schema import ForeignKey
from typing import TYPE_CHECKING
from uuid import UUID

from app.models.rwmodel import RWModel
from app.models.song_release_author import song_release_author
from app.models.song_release_group import song_release_group

if TYPE_CHECKING:
    from app.models.song_release_file import SongReleaseFile
    from app.models.author import Author
    from app.models.song import Song
    from app.models.group import Group
    from app.models.song import Song


class SongRelease(RWModel):
    __tablename__ = "song_release"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    song_id: Mapped[UUID] = mapped_column(ForeignKey("song.id"), index=True)
    song: Mapped["Song"] = relationship(back_populates="song_releases")
    created_at = Column(DateTime, server_default=text("now()"), index=True)
    name: Mapped[str]
    tag: Mapped[str]
    description: Mapped[str]
    bpm: Mapped[int]
    key: Mapped[str]
    lyrics: Mapped[str]
    song: Mapped["Song"] = relationship(back_populates="song_releases")
    authors: Mapped[list["Author"]] = relationship(
        secondary=song_release_author, lazy="selectin"
    )
    groups: Mapped[list["Group"]] = relationship(
        secondary=song_release_group, lazy="selectin"
    )
    files: Mapped[list["SongReleaseFile"]] = relationship(back_populates="song_release")
