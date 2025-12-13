from app.models.rwmodel import RWModel
from sqlalchemy import Table, Column
from sqlalchemy.sql.schema import ForeignKey

song_release_author = Table(
    "song_release_author",
    RWModel.metadata,
    Column("song_release_id", ForeignKey("song_release.id"), primary_key=True),
    Column("author_id", ForeignKey("author.id"), primary_key=True),
)