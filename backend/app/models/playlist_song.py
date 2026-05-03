from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.schema import ForeignKey

from app.models.rwmodel import RWModel

if TYPE_CHECKING:
    from app.models.playlist import Playlist
    from app.models.song import Song


class PlaylistSong(RWModel):
    __tablename__ = "playlist_song"

    playlist_id: Mapped[UUID] = mapped_column(ForeignKey("playlist.id", ondelete="CASCADE"), index=True, primary_key=True)
    song_id: Mapped[UUID] = mapped_column(ForeignKey("song.id", ondelete="CASCADE"), index=True, primary_key=True)
    filter: Mapped[str]

    playlist: Mapped["Playlist"] = relationship(back_populates="songs", lazy="selectin")
    song: Mapped["Song"] = relationship(back_populates="playlists", lazy="selectin")
