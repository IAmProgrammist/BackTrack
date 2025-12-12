from enum import Enum
from fastapi import UploadFile
from pydantic import BaseModel, ConfigDict, Field, field_validator
from pydantic_filters import BaseFilter, SearchField, PagePagination, BaseSort
from typing import Any, Optional, Literal
from uuid import UUID

from app.models.author import Author
from app.schemas.message import ApiResponse


class GroupBase(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        str_strip_whitespace=True
    )

    name: str = Field(min_length=1, max_length=1024)
    description: str = Field(min_length=0, max_length=1024)


# Модели для создания
class GroupInCreate(GroupBase):
    authors: list[UUID]
    file: UploadFile


class GroupInUpdate(GroupInCreate):
    pass


class GroupInDB(GroupBase):
    file_id: UUID


# Модели для выбора листа
class AuthorNestedFilter(BaseFilter):
    id: list[UUID]


class GroupFilter(BaseFilter):
    id__in: list[UUID]
    authors: AuthorNestedFilter
    q: str = SearchField(target=["name"])


class GroupPagination(PagePagination):
    pass


GroupOrderByLiteral = Literal["id", "name"]


class GroupSort(BaseSort):
    sort_by: Optional[GroupOrderByLiteral] = None


# Модели для ответа
class GroupParticipant(BaseModel):
    id: UUID
    name: str
    file_id: UUID


class GroupOutData(GroupBase):
    id: UUID | None = None
    authors: list[str]
    file_id: UUID


class GroupOutDataDetailed(GroupBase):
    id: UUID | None = None
    authors: list[GroupParticipant]
    file_id: UUID


# Модель-оркестратор
class GroupListResponse(ApiResponse):
    message: str = "Group API Response"
    data: list[GroupOutData]
    detail: dict[str, Any] | None = {"key": "val"}


class GroupResponse(ApiResponse):
    message: str = "Group API Response"
    data: GroupOutData
    detail: dict[str, Any] | None = {"key": "val"}


class GroupDetailedResponse(ApiResponse):
    message: str = "Group API Response"
    data: GroupOutDataDetailed
    detail: dict[str, Any] | None = {"key": "val"}


class GroupEmptyResponse(ApiResponse):
    message: str = "Group API Response"
    detail: dict[str, Any] | None = {"key": "val"}
