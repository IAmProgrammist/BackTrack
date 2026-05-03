import uuid
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.schema import ForeignKey

from app.models.rwmodel import RWModel

if TYPE_CHECKING:
    from app.models.file import File
    from app.models.playlist_song import PlaylistSong


class Playlist(RWModel):
    __tablename__ = "playlist"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str]
    description: Mapped[str]
    songs: Mapped[list["PlaylistSong"]] = relationship(back_populates="playlist", lazy="selectin")
    file_id: Mapped[UUID] = mapped_column(ForeignKey("file.id", ondelete="RESTRICT"))
    file: Mapped["File"] = relationship(back_populates="playlists")
