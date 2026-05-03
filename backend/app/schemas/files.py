from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.schemas.message import ApiResponse


class FileBase(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    mime: str
    original_name: str
    duration: int | None


class FileOutMetadata(FileBase):
    id: UUID | None = None


class FileInDB(FileBase):
    pass


class FilesResponse(ApiResponse):
    message: str = "File API Response"
    data: FileOutMetadata | list[FileOutMetadata]
    detail: dict[str, Any] | None = {"key": "val"}
