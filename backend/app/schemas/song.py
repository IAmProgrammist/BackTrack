from datetime import datetime
from enum import Enum
from fastapi import UploadFile
from pydantic import BaseModel, ConfigDict, Field, model_validator
from pydantic_filters import BaseFilter, SearchField, PagePagination, BaseSort
from typing import Any, Optional, Literal
from uuid import UUID

from app.schemas.message import ApiResponse


class SongBase(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        str_strip_whitespace=True
    )


SongName = Field(min_length=1, max_length=1024)
SongTag = Field(min_length=0, max_length=256)
SongDescription = Field(min_length=0, max_length=8192)
SongKey = Field(min_length=1, max_length=32)
SongLyrics = Field(min_length=0, max_length=8192)
SongBPM = Field(gt=0)


# Модели для создания
class SongInCreate(SongBase):
    name: str = SongName
    tag: Optional[str] = SongTag
    description: str = SongDescription
    bpm: Optional[int] = SongBPM
    key: Optional[str] = SongKey
    lyrics: Optional[str] = SongLyrics
    files_file: list[UploadFile]
    files_leading: list[bool]
    authors: list[UUID]
    groups: list[UUID]

    @model_validator(mode='after')
    def check_files_size(self) -> 'SongInCreate':
        if len(self.files_file) != len(self.files_leading):
            raise ValueError('Files array and files leadings should be of a same size')
        return self


class SongReleaseInDB(SongBase):
    name: str = SongName
    tag: Optional[str] = SongTag
    description: str = SongDescription
    bpm: Optional[int] = SongBPM
    key: Optional[str] = SongKey
    lyrics: Optional[str] = SongLyrics


class SongInRelease(SongInCreate):
    pass


# Модели для выбора листа
## Выбор песен
class SongFilter(BaseFilter):
    id__in: Optional[list[UUID]]
    tag__in: Optional[list[str]]
    bpm__in: Optional[list[int]]
    key__in: Optional[list[str]]
    authors_id__in: Optional[list[UUID]]
    groups_id__in: Optional[list[UUID]]
    q: Optional[str] = SearchField(target=["name", "tag", "key"])


class SongPagination(PagePagination):
    pass


SongOrderByLiteral = Literal["id", "name", "tag", "key", "bpm"]


class SongSort(BaseSort):
    sort_by: Optional[SongOrderByLiteral] = None


## Выбор версий
class SongReleaseFilter(BaseFilter):
    tag__in: list[str]


class SongReleasePagination(PagePagination):
    pass


SongOrderByLiteral = Literal["id", "created_at"]


class SongReleaseSort(BaseSort):
    sort_by: Optional[SongOrderByLiteral] = None


# Модели для ответа
class AuthorShortOutNested(BaseModel):
    id: UUID
    name: str


class GroupShortOutNested(BaseModel):
    id: UUID
    name: str


class SongShortOutData(BaseModel):
    song_id: UUID
    id: UUID
    tag: str
    name: str
    authors: list[AuthorShortOutNested]
    groups: list[GroupShortOutNested]
    duration: Optional[int]


class AuthorOutNested(BaseModel):
    id: UUID
    name: str
    file_id: UUID


class GroupOutNested(BaseModel):
    id: UUID
    name: str
    file_id: UUID


class FileOutNested(BaseModel):
    id: UUID
    mime: str
    leading: bool
    name: str


class SongOutData(BaseModel):
    song_id: UUID
    id: UUID
    name: str
    description: str
    tag: str
    bpm: Optional[int]
    key: Optional[str]
    duration: Optional[int]
    lyrics: str
    files: list[FileOutNested]
    authors: list[AuthorOutNested]
    groups: list[GroupOutNested]


class SongReleaseOutData(BaseModel):
    id: UUID
    created_at: datetime
    description: str
    tag: str


# Модель-оркестратор
class SongListResponse(ApiResponse):
    message: str = "Song API Response"
    data: list[SongShortOutData]
    detail: dict[str, Any] | None = {"key": "val"}


class SongShortResponse(ApiResponse):
    message: str = "Song API Response"
    data: SongShortOutData
    detail: dict[str, Any] | None = {"key": "val"}


class SongDetailedResponse(ApiResponse):
    message: str = "Song API Response"
    data: SongOutData
    detail: dict[str, Any] | None = {"key": "val"}


class SongReleaseResponse(ApiResponse):
    message: str = "Song API Response"
    data: list[SongReleaseOutData]
    detail: dict[str, Any] | None = {"key": "val"}


class SongEmptyResponse(ApiResponse):
    message: str = "Song API Response"
    detail: dict[str, Any] | None = {"key": "val"}
