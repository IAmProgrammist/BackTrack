import uuid
from app.models.group_author import group_author
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.schema import ForeignKey
from typing import TYPE_CHECKING
from uuid import UUID

from app.models.rwmodel import RWModel

if TYPE_CHECKING:
    from app.models.file import File


class Author(RWModel):
    __tablename__ = "author"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str]
    description: Mapped[str]
    groups: Mapped[list["Author"]] = relationship(
        secondary=group_author, lazy="selectin"
    )
    file_id: Mapped[UUID] = mapped_column(ForeignKey("file.id", ondelete='RESTRICT'))
