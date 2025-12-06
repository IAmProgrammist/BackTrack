from uuid import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid

from app.models.rwmodel import RWModel


class File(RWModel):
    __tablename__ = "file"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    mime: Mapped[str]
    original_name: Mapped[str]
