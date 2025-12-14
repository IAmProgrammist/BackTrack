from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.schema import ForeignKey
from typing import TYPE_CHECKING
from uuid import UUID

from app.models.rwmodel import RWModel

if TYPE_CHECKING:
    from app.models.file import File
    from app.models.song_release import SongRelease


class SongReleaseFile(RWModel):
    __tablename__ = "song_release_file"

    song_release_id: Mapped[UUID] = mapped_column(ForeignKey("song_release.id", ondelete='CASCADE'), index=True, primary_key=True)
    file_id: Mapped[UUID] = mapped_column(ForeignKey("file.id", ondelete='RESTRICT'), index=True, primary_key=True)
    primary: Mapped[bool]

    song_release: Mapped["SongRelease"] = relationship(back_populates="files", lazy="selectin")
    file: Mapped["File"] = relationship(back_populates="song_releases", lazy="selectin")
