from uuid import UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql.schema import ForeignKey

import uuid
from typing import TYPE_CHECKING

from app.models.rwmodel import RWModel
if TYPE_CHECKING:
    from app.models.file import File


class Author(RWModel):
    __tablename__ = "author"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str]
    description: Mapped[str]
    file_id: Mapped[UUID] = mapped_column(ForeignKey("file.id"))
