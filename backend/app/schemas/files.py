from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict

from app.core import security
from app.schemas.message import ApiResponse
from uuid import UUID

class FileBase(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: UUID | None = None
    mime: str
    original_name: str

class FileOutMetadata(FileBase):
    pass

class FileInDB(FileBase):
    pass

class FilesResponse(ApiResponse):
    message: str = "File API Response"
    data: FileOutMetadata | list[FileOutMetadata]
    detail: dict[str, Any] | None = {"key": "val"}
