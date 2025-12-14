from sqlalchemy import Table, Column
from sqlalchemy.sql.schema import ForeignKey

from app.models.rwmodel import RWModel

comment_song = Table(
    "comment_song",
    RWModel.metadata,
    Column("comment_id", ForeignKey("comment.id", ondelete='CASCADE'), primary_key=True, unique=True),
    Column("song_id", ForeignKey("song.id", ondelete='CASCADE'), primary_key=True),
)
