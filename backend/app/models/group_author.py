from app.models.rwmodel import RWModel
from sqlalchemy import Table, Column
from sqlalchemy.sql.schema import ForeignKey

group_author = Table(
    "author_group",
    RWModel.metadata,
    Column("author_id", ForeignKey("author.id", ondelete='CASCADE'), primary_key=True),
    Column("group_id", ForeignKey("group.id", ondelete='CASCADE'), primary_key=True),
)