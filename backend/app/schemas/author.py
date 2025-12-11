from enum import Enum
from fastapi import UploadFile
from pydantic import BaseModel, ConfigDict, Field
from pydantic_filters import BaseFilter, SearchField, PagePagination, BaseSort
from typing import Any, Optional
from uuid import UUID

from app.schemas.message import ApiResponse


class AuthorBase(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        str_strip_whitespace=True
    )

    id: UUID | None = None
    name: str = Field(min_length=1, max_length=1024)
    description: str = Field(min_length=0, max_length=1024)


# Модели для создания
class AuthorInCreate(AuthorBase):
    file: UploadFile


class AuthorInUpdate(AuthorInCreate):
    pass


class AuthorInDB(AuthorBase):
    file_id: UUID


# Модели для выбора листа
class AuthorFilter(BaseFilter):
    id__in: list[UUID]
    q: str = SearchField(target=["name"])


class AuthorPagination(PagePagination):
    pass


class AuthorOrderByEnum(str, Enum):
    id = "id"
    name = "name"


class AuthorSort(BaseSort):
    sort_by: Optional[AuthorOrderByEnum] = None


# Модели для ответа
class AuthorOutData(AuthorBase):
    file_id: UUID


# Модель-оркестратор
class AuthorResponse(ApiResponse):
    message: str = "User API Response"
    data: AuthorOutData | list[AuthorOutData]
    detail: dict[str, Any] | None = {"key": "val"}
