import uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from uuid import UUID
from typing import Optional
from typing import TYPE_CHECKING

from app.models.rwmodel import RWModel

if TYPE_CHECKING:
    from app.models.song_release_file import SongReleaseFile


class File(RWModel):
    __tablename__ = "file"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    mime: Mapped[str]
    original_name: Mapped[str]
    duration: Mapped[Optional[int]] = mapped_column(nullable=True)
    song_releases: Mapped[list["SongReleaseFile"]] = relationship(back_populates="file")
