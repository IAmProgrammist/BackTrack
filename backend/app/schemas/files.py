from datetime import datetime
from pydantic import BaseModel, ConfigDict
from typing import Any
from typing import Optional
from uuid import UUID

from app.core import security
from app.schemas.message import ApiResponse


class FileBase(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    mime: str
    original_name: str
    duration: Optional[int]


class FileOutMetadata(FileBase):
    id: UUID | None = None


class FileInDB(FileBase):
    pass


class FilesResponse(ApiResponse):
    message: str = "File API Response"
    data: FileOutMetadata | list[FileOutMetadata]
    detail: dict[str, Any] | None = {"key": "val"}
