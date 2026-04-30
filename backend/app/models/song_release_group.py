from sqlalchemy import Table, Column
from sqlalchemy.sql.schema import ForeignKey

from app.models.rwmodel import RWModel

song_release_group = Table(
    "song_release_group",
    RWModel.metadata,
    Column("song_release_id", ForeignKey("song_release.id", ondelete='CASCADE'), primary_key=True),
    Column("group_id", ForeignKey("group.id", ondelete='CASCADE'), primary_key=True),
)
