import logging
from fastapi import Depends, Form
from fastapi.encoders import jsonable_encoder
from pydantic_filters.plugins.fastapi import FilterDepends, PaginationDepends, SortDepends
from starlette.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_500_INTERNAL_SERVER_ERROR
)
from typing import Annotated
from uuid import UUID

from app.api.dependencies.database import get_repository
from app.api.dependencies.service import get_service
from app.core import constant
from app.core.config import get_app_settings
from app.core.settings.app import AppSettings
from app.database.repositories.authors import AuthorsRepository
from app.database.repositories.files import FilesRepository
from app.models.user import User
from app.schemas.author import (
    AuthorInCreate,
    AuthorInUpdate,
    AuthorInDB,
    AuthorFilter,
    AuthorPagination,
    AuthorSort,
    AuthorResponse,
    AuthorOutData
)
from app.services.base import BaseService
from app.services.files import FileService
from app.utils import ServiceResult, response_4xx, return_service

logger = logging.getLogger(__name__)


class AuthorsService(BaseService):
    @return_service
    async def get_author_by_id(
            self,
            author_id: UUID,
            author_repo: AuthorsRepository = Depends(get_repository(AuthorsRepository)),
    ) -> AuthorResponse:
        author = await author_repo.get_author_by_id(author_id=author_id)
        if not author:
            return response_4xx(
                status_code=HTTP_404_NOT_FOUND,
                context={"reason": constant.FAIL_AUTHOR_NOT_FOUND},
            )

        return dict(
            status_code=HTTP_200_OK,
            content={
                "message": constant.SUCCESS_AUTHOR_FOUND,
                "data": jsonable_encoder(AuthorOutData.model_validate(author)),
            },
        )

    @return_service
    async def get_authors(
            self,
            authors_filters: AuthorFilter = FilterDepends(AuthorFilter),
            authors_pagination: AuthorPagination = PaginationDepends(AuthorPagination),
            authors_sort: AuthorSort = SortDepends(AuthorSort),
            author_repo: AuthorsRepository = Depends(get_repository(AuthorsRepository)),
    ) -> AuthorResponse:
        authors = await author_repo.get_authors(filter_=authors_filters, pagination=authors_pagination,
                                                sort=authors_sort)

        if not authors:
            return response_4xx(
                status_code=HTTP_404_NOT_FOUND,
                context={"reason": constant.FAIL_VALIDATION_MATCHED_FILTERED_USERS},
            )

        return dict(
            status_code=HTTP_200_OK,
            content={
                "message": constant.SUCCESS_GET_USERS,
                "data": jsonable_encoder([AuthorOutData.model_validate(author) for author in authors]),
            },
        )

    @return_service
    async def create_author(
            self,
            author_in: Annotated[AuthorInCreate, Form(media_type="multipart/form-data")],
            author_repo: AuthorsRepository = Depends(get_repository(AuthorsRepository)),
            files_service: FileService = Depends(get_service(FileService)),
            file_repository: FilesRepository = Depends(get_repository(FilesRepository)),
            settings: AppSettings = Depends(get_app_settings),
            token_user: User = None,
    ) -> AuthorResponse:
        logger.info("Creating author")

        if not token_user:
            logger.error("Failed to create author: you need to be authorized for this action")
            return response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": constant.FAIL_AUTH_CHECK},
            )

        if not author_in.file.content_type.startswith("image/"):
            logger.error("Failed to create author: invalid image")
            return response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": constant.FAIL_AUTHOR_FILE_NOT_IMAGE},
            )

        stored_file = await files_service.create_file(file_repository=file_repository, settings=settings,
                                                      file=author_in.file)
        if not stored_file:
            logger.error("Failed to create author: failed to save file")
            return response_4xx(
                status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                context={"reason": constant.FAIL_AUTHOR_COULDNT_SAVE_FILE},
            )

        author = await author_repo.create_author(
            author_in=AuthorInDB(name=author_in.name, desctiption=author_in.description, file_id=stored_file.id))
        if not author:
            logger.error("Failed to create author")
            return response_4xx(
                status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                context={"reason": constant.FAIL_AUTHOR_COULDNT_SAVE},
            )

        return dict(
            status_code=HTTP_200_OK,
            content={
                "message": constant.SUCCESS_AUTHOR_FOUND,
                "data": jsonable_encoder(AuthorOutData.model_validate(author)),
            },
        )

    @return_service
    async def update_author(
            self,
            author_in: Annotated[AuthorInUpdate, Form(media_type="multipart/form-data")],
            author_repo: AuthorsRepository = Depends(get_repository(AuthorsRepository)),
            files_service: FileService = Depends(get_service(FileService)),
            file_repository: FilesRepository = Depends(get_repository(FilesRepository)),
            settings: AppSettings = Depends(get_app_settings),
            token_user: User = None,
            author_id: UUID = None
    ) -> AuthorResponse:
        logger.info("Update author")

        if not token_user:
            logger.error("Failed to update author: you need to be authorized for this action")
            return response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": constant.FAIL_AUTH_CHECK},
            )

        author = await author_repo.get_author_by_id(author_id=author_id)

        if author is None:
            logger.error("Failed to update author: failed to find author")
            return response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": constant.FAIL_AUTHOR_NOT_FOUND},
            )

        if not author_in.file.content_type.startswith("image/"):
            logger.error("Failed to update author: invalid image")
            return response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": constant.FAIL_AUTHOR_FILE_NOT_IMAGE},
            )

        stored_file = await files_service.create_file(file_repository=file_repository, settings=settings,
                                                      file=author_in.file)
        if not stored_file:
            logger.error("Failed to update author: failed to save file")
            return response_4xx(
                status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                context={"reason": constant.FAIL_AUTHOR_COULDNT_SAVE_FILE},
            )

        author = await author_repo.update_author(
            author=author,
            author_in=AuthorInDB(name=author_in.name, desctiption=author_in.description, file_id=stored_file.id)
        )
        if not author:
            logger.error("Failed to create author")
            return response_4xx(
                status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                context={"reason": constant.FAIL_AUTHOR_COULDNT_SAVE},
            )

        return dict(
            status_code=HTTP_200_OK,
            content={
                "message": constant.SUCCESS_AUTHOR_FOUND,
                "data": jsonable_encoder(AuthorOutData.model_validate(author)),
            },
        )

    @return_service
    async def delete_author(
            self,
            author_repo: AuthorsRepository = Depends(get_repository(AuthorsRepository)),
            token_user: User = None,
            author_id: UUID = None
    ) -> ServiceResult:
        logger.info("Delete author")

        if not token_user:
            logger.error("Failed to delete author: you need to be authorized for this action")
            return response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": constant.FAIL_AUTH_CHECK},
            )

        author = await author_repo.get_author_by_id(author_id=author_id)

        if author is None:
            logger.error("Failed to delete author: failed to find author")
            return response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": constant.FAIL_AUTHOR_NOT_FOUND},
            )

        await author_repo.delete_author(author=author)

        return dict(
            status_code=HTTP_200_OK,
            content={
                "message": constant.SUCCESS_DELETE_AUTHOR,
            },
        )
