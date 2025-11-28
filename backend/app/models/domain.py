from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List, Generic, TypeVar
from datetime import datetime
from enum import Enum


DataT = TypeVar('DataT')


class PaginatedResponse(BaseModel, Generic[DataT]):
    """Generic paginated response model."""
    items: List[DataT]
    total: int
    page: int
    size: int
    pages: int


class OrderDirection(str, Enum):
    ASC = "asc"
    DESC = "desc"


class FilterOperator(str, Enum):
    EQ = "eq"
    NE = "ne"
    GT = "gt"
    GTE = "gte"
    LT = "lt"
    LTE = "lte"
    LIKE = "like"
    IN = "in"


class FilterField(BaseModel):
    """Individual filter field specification."""
    field: str
    operator: FilterOperator
    value: str


class PaginationParams(BaseModel):
    """Pagination parameters."""
    page: int = 1
    size: int = 50
    
    @validator('page')
    def validate_page(cls, v):
        if v < 1:
            raise ValueError('Page must be positive')
        return v
    
    @validator('size')
    def validate_size(cls, v):
        if v < 1 or v > 100:
            raise ValueError('Size must be between 1 and 100')
        return v


class SortParams(BaseModel):
    """Sorting parameters."""
    field: str
    direction: OrderDirection = OrderDirection.ASC


class QueryParams(BaseModel):
    """Complete query parameters for filtering, pagination, and sorting."""
    pagination: PaginationParams = PaginationParams()
    sort: Optional[SortParams] = None
    filters: List[FilterField] = []
