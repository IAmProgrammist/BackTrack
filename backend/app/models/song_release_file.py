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
    from app.models.file import File
    from app.models.author import Author
    from app.models.song import Song
    from app.models.group import Group
    from app.models.song import Song
    from app.models.song_release import SongRelease


class SongReleaseFile(RWModel):
    __tablename__ = "song_release_file"

    song_release_id: Mapped[UUID] = mapped_column(ForeignKey("song_release.id"), index=True, primary_key=True)
    file_id: Mapped[UUID] = mapped_column(ForeignKey("file.id"), index=True, primary_key=True)
    primary: Mapped[bool]

    song_release: Mapped["SongRelease"] = relationship(back_populates="files")
    file: Mapped["File"] = relationship(back_populates="song_releases")
