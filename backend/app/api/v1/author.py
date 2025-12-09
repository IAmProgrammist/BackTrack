from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from starlette.status import HTTP_200_OK, HTTP_201_CREATED

from app.api.dependencies.auth import get_current_user_auth
from app.api.dependencies.database import get_repository
from app.api.dependencies.service import get_service
from app.core.config import get_app_settings
from app.core.settings.app import AppSettings
from app.database.repositories.authors import AuthorsRepository
from app.models.file import File
from app.schemas.author import AuthorResponse
from app.services.authors import AuthorsService
from app.utils import ERROR_RESPONSES, ServiceResult, handle_result
from uuid import UUID
from app.schemas.author import (
    AuthorFilter,
    AuthorPagination,
    AuthorSort,
    AuthorResponse,
)
from pydantic_filters.plugins.fastapi import FilterDepends, PaginationDepends, SortDepends

router = APIRouter()

@router.get(
    "/{author_id}",
    status_code=HTTP_200_OK,
    responses=ERROR_RESPONSES,
    name="get_author",
    response_model=AuthorResponse
)
async def get_author(*,
             author_service: AuthorsService = Depends(get_service(AuthorsService)),
             author_repository: AuthorsRepository = Depends(get_repository(AuthorsRepository)),
             author_id: UUID
    ) -> AuthorResponse:
    response = await author_service.get_author_by_id(author_id=author_id, author_repo=author_repository)

    return await handle_result(response)


@router.get(
    "",
    status_code=HTTP_200_OK,
    responses=ERROR_RESPONSES,
    name="get_authors",
    response_model=AuthorResponse
)
async def get_author(*,
             author_service: AuthorsService = Depends(get_service(AuthorsService)),
             authors_filters: AuthorFilter = FilterDepends(AuthorFilter),
             authors_pagination: AuthorPagination = PaginationDepends(AuthorPagination),
             authors_sort: AuthorSort = SortDepends(AuthorSort),
             author_repo: AuthorsRepository = Depends(get_repository(AuthorsRepository)),
    ) -> AuthorResponse:
    response = await author_service.get_authors(
        authors_filters=authors_filters,
        authors_pagination=authors_pagination,
        authors_sort=authors_sort,
        author_repo=author_repo
    )

    return await handle_result(response)