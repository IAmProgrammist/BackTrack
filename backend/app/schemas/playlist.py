from fastapi import UploadFile
from pydantic import BaseModel, ConfigDict, model_validator, field_validator
from pydantic_filters import BaseFilter, SearchField, PagePagination, BaseSort
from typing import Any, Optional, Literal
from uuid import UUID

from app.schemas.message import ApiResponse


class PlaylistBase(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        str_strip_whitespace=True
    )


# Модели для создания
class PlaylistInCreate(PlaylistBase):
    name: str
    description: str
    songs_ids: list[UUID]
    songs_filters: list[str]
    file: UploadFile

    @field_validator('songs_ids', mode="before")
    def separate_song_ids_by_comma(cls, value):
        if isinstance(value, list) and isinstance(value[0], str):
            return [UUID(song_id) for song_id in value[0].split(",")]

        return value

    @field_validator('songs_filters', mode="before")
    def separate_filters_by_comma(cls, value):
        if isinstance(value, list) and isinstance(value[0], str):
            return [str(filter) for filter in value[0].split(",")]

        return value

    @model_validator(mode='after')
    def check_files_size(self) -> 'PlaylistInCreate':
        if len(self.songs_ids) != len(self.songs_filters):
            raise ValueError('Songs array and filters array should be of a same size')
        return self


class PlaylistInUpdate(PlaylistInCreate):
    pass


class PlaylistInDB(PlaylistBase):
    name: str
    description: str


# Модели для выбора листа
class PlaylistFilter(BaseFilter):
    id__in: list[UUID]
    q: str = SearchField(target=["name"])


class PlaylistPagination(PagePagination):
    pass


PlaylistOrderByLiteral = Literal["id", "name"]


class PlaylistSort(BaseSort):
    sort_by: Optional[PlaylistOrderByLiteral] = None


# Модели для ответа
class PlaylistShortOutData(BaseModel):
    id: UUID
    name: str
    tracks_amount: int
    file_id: UUID


class PlaylistExtendedOutGroups(BaseModel):
    id: UUID
    name: str


class PlaylistExtendedOutAuthors(BaseModel):
    id: UUID
    name: str


class PlaylistExtendedOutTracks(BaseModel):
    id: UUID
    name: str
    filter: str
    groups: list[PlaylistExtendedOutGroups]
    authors: list[PlaylistExtendedOutAuthors]
    duration: Optional[int]


class PlaylistExtendedOutData(BaseModel):
    id: UUID
    name: str
    description: str
    file_id: UUID
    tracks: list[PlaylistExtendedOutTracks]

# Модель-оркестратор
class PlaylistListResponse(ApiResponse):
    message: str = "Playlist API Response"
    data: list[PlaylistShortOutData]
    detail: dict[str, Any] | None = {"key": "val"}


class PlaylistResponse(ApiResponse):
    message: str = "Playlist API Response"
    data: PlaylistShortOutData
    detail: dict[str, Any] | None = {"key": "val"}


class PlaylistDetailedResponse(ApiResponse):
    message: str = "Playlist API Response"
    data: PlaylistExtendedOutData
    detail: dict[str, Any] | None = {"key": "val"}


class PlaylistEmptyResponse(ApiResponse):
    message: str = "Playlist API Response"
    detail: dict[str, Any] | None = {"key": "val"}
