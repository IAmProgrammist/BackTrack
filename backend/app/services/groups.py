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
from app.database.repositories.groups import GroupsRepository
from app.models.user import User
from app.schemas.author import (
    AuthorFilter,
    AuthorPagination,
    AuthorSort
)
from app.schemas.group import (
    GroupInCreate,
    GroupInUpdate,
    GroupInDB,
    GroupFilter,
    GroupPagination,
    GroupSort,
    GroupDetailedResponse,
    GroupEmptyResponse,
    GroupListResponse,
    GroupResponse,
    GroupOutData,
    GroupOutDataDetailed,
    GroupParticipant
)
from app.services.base import BaseService
from app.services.files import FileService
from app.utils import ServiceResult, response_4xx, return_service

logger = logging.getLogger(__name__)


class GroupsService(BaseService):
    @return_service
    async def get_group_by_id(
            self,
            group_id: UUID,
            group_repo: GroupsRepository = Depends(get_repository(GroupsRepository)),
    ) -> GroupDetailedResponse:
        group = await group_repo.get_group_by_id(group_id=group_id)
        if not group:
            return response_4xx(
                status_code=HTTP_404_NOT_FOUND,
                context={"reason": constant.FAIL_GROUP_NOT_FOUND},
            )

        return dict(
            status_code=HTTP_200_OK,
            content={
                "message": constant.SUCCESS_GROUP_FOUND,
                "data": jsonable_encoder(GroupOutDataDetailed(
                    id=group.id,
                    name=group.name,
                    description=group.description,
                    file_id=group.file_id,
                    authors=[
                        GroupParticipant(
                            id=author.id,
                            name=author.name,
                            file_id=author.file_id,
                        ) for author in group.authors
                    ]
                )),
            },
        )

    @return_service
    async def get_groups(
            self,
            groups_filters: GroupFilter = FilterDepends(GroupFilter),
            groups_pagination: GroupPagination = PaginationDepends(GroupPagination),
            groups_sort: GroupSort = SortDepends(GroupSort),
            group_repo: GroupsRepository = Depends(get_repository(GroupsRepository)),
    ) -> GroupListResponse:
        groups = await group_repo.get_groups_with_participants(filter_=groups_filters, pagination=groups_pagination,
                                                               sort=groups_sort)

        if not groups:
            return response_4xx(
                status_code=HTTP_404_NOT_FOUND,
                context={"reason": constant.FAIL_VALIDATION_MATCHED_FILTERED_USERS},
            )

        return dict(
            status_code=HTTP_200_OK,
            content={
                "message": constant.SUCCESS_GET_USERS,
                "data": jsonable_encoder([GroupOutData(
                    id=group.id,
                    name=group.name,
                    description=group.description,
                    file_id=group.file_id,
                    authors=[author.name for author in group.authors]
                ) for group in groups]),
            },
        )

    @return_service
    async def create_group(
            self,
            group_in: Annotated[GroupInCreate, Form(media_type="multipart/form-data")],
            group_repo: GroupsRepository = Depends(get_repository(GroupsRepository)),
            files_service: FileService = Depends(get_service(FileService)),
            file_repository: FilesRepository = Depends(get_repository(FilesRepository)),
            settings: AppSettings = Depends(get_app_settings),
            author_repo: AuthorsRepository = Depends(get_repository(AuthorsRepository)),
            token_user: User = None,
    ) -> GroupResponse:
        logger.info("Creating group")

        if not token_user:
            logger.error("Failed to create group: you need to be authorized for this action")
            return response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": constant.FAIL_AUTH_CHECK},
            )

        if not group_in.file.content_type.startswith("image/"):
            logger.error("Failed to create group: invalid image")
            return response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": constant.FAIL_GROUP_FILE_NOT_IMAGE},
            )

        authors = await author_repo.get_authors_with_ids(ids=group_in.authors)

        stored_file = await files_service.create_file(file_repository=file_repository, settings=settings,
                                                      file=group_in.file)
        if not stored_file:
            logger.error("Failed to create group: failed to save file")
            return response_4xx(
                status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                context={"reason": constant.FAIL_GROUP_COULDNT_SAVE_FILE},
            )

        group = await group_repo.create_group(
            group_in=GroupInDB(name=group_in.name, description=group_in.description, file_id=stored_file.id),
            authors=authors
        )
        if not group:
            logger.error("Failed to create group")
            return response_4xx(
                status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                context={"reason": constant.FAIL_GROUP_COULDNT_SAVE},
            )

        return dict(
            status_code=HTTP_200_OK,
            content={
                "message": constant.SUCCESS_GROUP_FOUND,
                "data": jsonable_encoder(GroupOutData(
                    id=group.id,
                    name=group.name,
                    description=group.description,
                    file_id=group.file_id,
                    authors=[author.name for author in authors]
                )),
            },
        )

    @return_service
    async def update_group(
            self,
            group_in: Annotated[GroupInUpdate, Form(media_type="multipart/form-data")],
            group_repo: GroupsRepository = Depends(get_repository(GroupsRepository)),
            files_service: FileService = Depends(get_service(FileService)),
            file_repository: FilesRepository = Depends(get_repository(FilesRepository)),
            settings: AppSettings = Depends(get_app_settings),
            author_repo: AuthorsRepository = Depends(get_repository(AuthorsRepository)),
            token_user: User = None,
            group_id: UUID = None
    ) -> GroupResponse:
        logger.info("Update group")

        if not token_user:
            logger.error("Failed to update group: you need to be groupized for this action")
            return response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": constant.FAIL_AUTH_CHECK},
            )

        group = await group_repo.get_group_by_id(group_id=group_id)

        if group is None:
            logger.error("Failed to update group: failed to find group")
            return response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": constant.FAIL_GROUP_NOT_FOUND},
            )

        if not group_in.file.content_type.startswith("image/"):
            logger.error("Failed to update group: invalid image")
            return response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": constant.FAIL_GROUP_FILE_NOT_IMAGE},
            )

        authors = await author_repo.get_authors_with_ids(ids=group_in.authors)

        stored_file = await files_service.create_file(file_repository=file_repository, settings=settings,
                                                      file=group_in.file)
        if not stored_file:
            logger.error("Failed to update group: failed to save file")
            return response_4xx(
                status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                context={"reason": constant.FAIL_GROUP_COULDNT_SAVE_FILE},
            )

        group = await group_repo.update_group(
            group=group,
            group_in=GroupInDB(name=group_in.name, description=group_in.description, file_id=stored_file.id,
                               authors=authors)
        )
        if not group:
            logger.error("Failed to create group")
            return response_4xx(
                status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                context={"reason": constant.FAIL_GROUP_COULDNT_SAVE},
            )

        return dict(
            status_code=HTTP_200_OK,
            content={
                "message": constant.SUCCESS_GROUP_FOUND,
                "data": jsonable_encoder(GroupOutData(
                    id=group.id,
                    name=group.name,
                    description=group.description,
                    file_id=group.file_id,
                    authors=[author.name for author in authors]
                )),
            },
        )

    @return_service
    async def delete_group(
            self,
            group_repo: GroupsRepository = Depends(get_repository(GroupsRepository)),
            token_user: User = None,
            group_id: UUID = None
    ) -> GroupEmptyResponse:
        logger.info("Delete group")

        if not token_user:
            logger.error("Failed to delete group: you need to be groupized for this action")
            return response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": constant.FAIL_AUTH_CHECK},
            )

        group = await group_repo.get_group_by_id(group_id=group_id)

        if group is None:
            logger.error("Failed to delete group: failed to find group")
            return response_4xx(
                status_code=HTTP_400_BAD_REQUEST,
                context={"reason": constant.FAIL_GROUP_NOT_FOUND},
            )

        await group_repo.delete_group(group=group)

        return dict(
            status_code=HTTP_200_OK,
            content={
                "message": constant.SUCCESS_DELETE_GROUP,
            },
        )
