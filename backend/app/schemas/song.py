from datetime import datetime
from typing import Any, Literal
from uuid import UUID

from fastapi import UploadFile
from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator
from pydantic_filters import BaseFilter, BaseSort, PagePagination, SearchField

from app.schemas.comment import CommentBase, CommentFilter, CommentIn, CommentOrderByLiteral, CommentOut, CommentPagination
from app.schemas.message import ApiResponse


class SongBase(BaseModel):
    model_config = ConfigDict(from_attributes=True, str_strip_whitespace=True)


SongName = Field(min_length=1, max_length=1024)
SongTag = Field(min_length=0, max_length=256)
SongDescription = Field(min_length=0, max_length=8192)
SongKey = Field(min_length=1, max_length=32)
SongLyrics = Field(min_length=0, max_length=8192)
SongBPM = Field(gt=0)


# Модели для создания
class SongInCreate(SongBase):
    name: str = SongName
    tag: str | None = SongTag
    description: str = SongDescription
    bpm: int | None = SongBPM
    key: str | None = SongKey
    lyrics: str | None = SongLyrics
    files_file: list[UploadFile]
    files_leading: list[bool]
    # Использовать кастомный кодек для хранения аудио
    files_audio_custom_codec: list[bool]
    authors: list[UUID]
    groups: list[UUID]

    @field_validator("files_leading", mode="before")
    def separate_by_comma_files_leading(cls, value):
        if isinstance(value, list) and isinstance(value[0], str):
            return [leading == 'true' for leading in value[0].split(",")]

        return value

    @field_validator("files_audio_custom_codec", mode="before")
    def separate_by_comma_files_audio_custom_codec(cls, value):
        if isinstance(value, list) and isinstance(value[0], str):
            return [leading == 'true' for leading in value[0].split(",")]

        return value

    @model_validator(mode="after")
    def check_files_size(self) -> "SongInCreate":
        if len(self.files_file) != len(self.files_leading) or len(self.files_file) != len(self.files_audio_custom_codec):
            raise ValueError("Files array and files leadings should be of a same size")
        return self


class SongCommentInData(CommentIn):
    pass


class SongReleaseInDB(SongBase):
    name: str = SongName
    tag: str | None = SongTag
    description: str = SongDescription
    bpm: int | None = SongBPM
    key: str | None = SongKey
    lyrics: str | None = SongLyrics


class SongCommentInDB(CommentBase):
    pass


class SongInRelease(SongInCreate):
    pass


# Модели для выбора листа
## Выбор песен
class SongFilter(BaseFilter):
    id__in: list[UUID] | None
    tag__in: list[str] | None
    bpm__in: list[int] | None
    key__in: list[str] | None
    authors_id__in: list[UUID] | None
    groups_id__in: list[UUID] | None
    q: str | None = SearchField(target=["name", "tag", "key"])


class SongPagination(PagePagination):
    pass


SongOrderByLiteral = Literal["id", "name", "tag", "key", "bpm"]


class SongSort(BaseSort):
    sort_by: SongOrderByLiteral | None = None


## Выбор версий
class SongReleaseFilter(BaseFilter):
    tag__in: list[str]


class SongReleasePagination(PagePagination):
    pass


SongOrderByLiteral = Literal["id", "created_at"]


class SongReleaseSort(BaseSort):
    sort_by: SongOrderByLiteral | None = None


## Выбор комментов
class SongCommentFilter(CommentFilter):
    pass


class SongCommentPagination(CommentPagination):
    pass


SongCommentSortLiteral = Literal[CommentOrderByLiteral]


class SongCommentSort(BaseSort):
    sort_by: SongCommentSortLiteral | None = None


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
    duration: int | None


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


class PlaylistOutNested(BaseModel):
    id: UUID
    name: str
    file_id: UUID


class SongOutData(BaseModel):
    song_id: UUID
    id: UUID
    name: str
    description: str
    tag: str
    bpm: int | None
    key: str | None
    duration: int | None
    lyrics: str
    files: list[FileOutNested]
    authors: list[AuthorOutNested]
    groups: list[GroupOutNested]
    playlists: list[PlaylistOutNested]


class SongReleaseOutData(BaseModel):
    id: UUID
    created_at: datetime
    description: str
    tag: str


class SongCommentOutData(CommentOut):
    pass


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


class SongCommentListResponse(ApiResponse):
    message: str = "Song Comment API Response"
    data: list[SongCommentOutData]
    detail: dict[str, Any] | None = {"key": "val"}


class SongCommentResponse(ApiResponse):
    message: str = "Song Comment API Response"
    data: SongCommentOutData
    detail: dict[str, Any] | None = {"key": "val"}


class SongEmptyResponse(ApiResponse):
    message: str = "Song API Response"
    detail: dict[str, Any] | None = {"key": "val"}
