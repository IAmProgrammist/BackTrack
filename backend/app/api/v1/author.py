from fastapi import APIRouter, Depends, Form
from fastapi.responses import FileResponse
from pydantic_filters.plugins.fastapi import FilterDepends, PaginationDepends, SortDepends
from starlette.status import HTTP_200_OK, HTTP_201_CREATED
from typing import Annotated
from uuid import UUID

from app.api.dependencies.auth import get_current_user_auth
from app.api.dependencies.database import get_repository
from app.api.dependencies.service import get_service
from app.core.config import get_app_settings
from app.core.settings.app import AppSettings
from app.database.repositories.authors import AuthorsRepository
from app.database.repositories.files import FilesRepository
from app.models.file import File
from app.models.user import User
from app.schemas.author import (
    AuthorFilter,
    AuthorPagination,
    AuthorSort,
    AuthorResponse,
    AuthorInCreate
)
from app.schemas.author import AuthorResponse
from app.services.authors import AuthorsService
from app.services.files import FileService
from app.utils import ERROR_RESPONSES, ServiceResult, handle_result

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
async def get_authors(*,
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


@router.post(
    "",
    status_code=HTTP_200_OK,
    responses=ERROR_RESPONSES,
    name="create_author",
    response_model=AuthorResponse
)
async def create_author(*,
                        author_service: AuthorsService = Depends(get_service(AuthorsService)),
                        author_in: Annotated[AuthorInCreate, Form(media_type="multipart/form-data")],
                        author_repo: AuthorsRepository = Depends(get_repository(AuthorsRepository)),
                        files_service: FileService = Depends(get_service(FileService)),
                        file_repository: FilesRepository = Depends(get_repository(FilesRepository)),
                        settings: AppSettings = Depends(get_app_settings),
                        token_user: User = Depends(get_current_user_auth()),
                        ) -> AuthorResponse:
    response = await author_service.create_author(
        author_in=author_in,
        author_repo=author_repo,
        files_service=files_service,
        file_repository=file_repository,
        settings=settings,
        token_user=token_user
    )

    return await handle_result(response)


@router.put(
    "/{user_id}",
    status_code=HTTP_200_OK,
    responses=ERROR_RESPONSES,
    name="update_author",
    response_model=AuthorResponse
)
async def update_author(*,
                        author_service: AuthorsService = Depends(get_service(AuthorsService)),
                        author_in: Annotated[AuthorInCreate, Form(media_type="multipart/form-data")],
                        author_repo: AuthorsRepository = Depends(get_repository(AuthorsRepository)),
                        files_service: FileService = Depends(get_service(FileService)),
                        file_repository: FilesRepository = Depends(get_repository(FilesRepository)),
                        settings: AppSettings = Depends(get_app_settings),
                        token_user: User = Depends(get_current_user_auth()),
                        user_id: UUID
                        ) -> AuthorResponse:
    response = await author_service.update_author(
        author_in=author_in,
        author_repo=author_repo,
        files_service=files_service,
        file_repository=file_repository,
        settings=settings,
        token_user=token_user,
        user_id=user_id
    )

    return await handle_result(response)
