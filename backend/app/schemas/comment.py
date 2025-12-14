from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from pydantic_filters import BaseFilter, SearchField, PagePagination, BaseSort
from typing import Optional, Literal
from uuid import UUID


class CommentBase(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        str_strip_whitespace=True
    )

    content: str = Field(min_length=1, max_length=8192)


class CommentIn(CommentBase):
    pass


class CommentOut(CommentBase):
    id: UUID
    created_at: datetime
    created_by: str


class CommentFilter(BaseFilter):
    created_by__in: list[UUID]
    q: str = SearchField(target=["content"])


class CommentPagination(PagePagination):
    pass


CommentOrderByLiteral = Literal["created_at"]


class CommentSorts(BaseSort):
    sort_by: Optional[CommentOrderByLiteral] = None
