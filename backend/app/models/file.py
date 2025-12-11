import uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from uuid import UUID

from app.models.rwmodel import RWModel


class File(RWModel):
    __tablename__ = "file"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    mime: Mapped[str]
    original_name: Mapped[str]
