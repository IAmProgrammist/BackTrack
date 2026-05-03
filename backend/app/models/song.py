import uuid
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.comment_song import comment_song
from app.models.rwmodel import RWModel

if TYPE_CHECKING:
    from app.models.comment import Comment
    from app.models.playlist_song import PlaylistSong
    from app.models.song_release import SongRelease


class Song(RWModel):
    __tablename__ = "song"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    song_releases: Mapped[list["SongRelease"]] = relationship(back_populates="song", lazy="selectin")
    comments: Mapped[list["Comment"]] = relationship(secondary=comment_song, lazy="selectin")
    playlists: Mapped[list["PlaylistSong"]] = relationship(back_populates="song", lazy="selectin")
