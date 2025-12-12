import uuid
from sqlalchemy import Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.schema import ForeignKey
from typing import TYPE_CHECKING
from uuid import UUID

from app.models.rwmodel import RWModel

if TYPE_CHECKING:
    from app.models.file import File
    from app.models.author import Author

group_author = Table(
    "author_group",
    RWModel.metadata,
    Column("author_id", ForeignKey("author.id"), primary_key=True),
    Column("group_id", ForeignKey("group.id"), primary_key=True),
)


class Group(RWModel):
    __tablename__ = "group"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str]
    description: Mapped[str]
    authors: Mapped[list["Author"]] = relationship(
        secondary=group_author, lazy="select"
    )
    file_id: Mapped[UUID] = mapped_column(ForeignKey("file.id"))
