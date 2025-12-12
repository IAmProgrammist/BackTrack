from fastapi import APIRouter, Depends, Form
from pydantic_filters.plugins.fastapi import FilterDepends, PaginationDepends, SortDepends
from starlette.status import HTTP_200_OK
from typing import Annotated
from uuid import UUID

from app.api.dependencies.auth import get_current_user_auth
from app.api.dependencies.database import get_repository
from app.api.dependencies.service import get_service
from app.core.config import get_app_settings
from app.core.settings.app import AppSettings
from app.database.repositories.authors import AuthorsRepository
from app.database.repositories.files import FilesRepository
from app.database.repositories.groups import GroupsRepository
from app.models.user import User
from app.schemas.group import (
    GroupFilter,
    GroupPagination,
    GroupSort,
    GroupResponse,
    GroupInCreate
)
from app.schemas.group import GroupResponse
from app.services.files import FileService
from app.services.groups import GroupsService
from app.utils import ERROR_RESPONSES, handle_result

router = APIRouter()


@router.get(
    "/{group_id}",
    status_code=HTTP_200_OK,
    responses=ERROR_RESPONSES,
    name="get_group",
    response_model=GroupResponse
)
async def get_group(*,
                    group_service: GroupsService = Depends(get_service(GroupsService)),
                    group_repository: GroupsRepository = Depends(get_repository(GroupsRepository)),
                    group_id: UUID
                    ) -> GroupResponse:
    response = await group_service.get_group_by_id(group_id=group_id, group_repo=group_repository)

    return await handle_result(response)


@router.get(
    "",
    status_code=HTTP_200_OK,
    responses=ERROR_RESPONSES,
    name="get_groups",
    response_model=GroupResponse
)
async def get_groups(*,
                     group_service: GroupsService = Depends(get_service(GroupsService)),
                     groups_filters: GroupFilter = FilterDepends(GroupFilter),
                     groups_pagination: GroupPagination = PaginationDepends(GroupPagination),
                     groups_sort: GroupSort = SortDepends(GroupSort),
                     group_repo: GroupsRepository = Depends(get_repository(GroupsRepository)),
                     ) -> GroupResponse:
    response = await group_service.get_groups(
        groups_filters=groups_filters,
        groups_pagination=groups_pagination,
        groups_sort=groups_sort,
        group_repo=group_repo
    )

    return await handle_result(response)


@router.post(
    "",
    status_code=HTTP_200_OK,
    responses=ERROR_RESPONSES,
    name="create_group",
    response_model=GroupResponse
)
async def create_group(*,
                       group_service: GroupsService = Depends(get_service(GroupsService)),
                       group_in: Annotated[GroupInCreate, Form(media_type="multipart/form-data")],
                       group_repo: GroupsRepository = Depends(get_repository(GroupsRepository)),
                       author_repo: AuthorsRepository = Depends(get_repository(AuthorsRepository)),
                       files_service: FileService = Depends(get_service(FileService)),
                       file_repository: FilesRepository = Depends(get_repository(FilesRepository)),
                       settings: AppSettings = Depends(get_app_settings),
                       token_user: User = Depends(get_current_user_auth()),
                       ) -> GroupResponse:
    response = await group_service.create_group(
        group_in=group_in,
        group_repo=group_repo,
        files_service=files_service,
        file_repository=file_repository,
        settings=settings,
        token_user=token_user,
        author_repo=author_repo
    )

    return await handle_result(response)


@router.put(
    "/{group_id}",
    status_code=HTTP_200_OK,
    responses=ERROR_RESPONSES,
    name="update_group",
    response_model=GroupResponse
)
async def update_group(*,
                       group_service: GroupsService = Depends(get_service(GroupsService)),
                       group_in: Annotated[GroupInCreate, Form(media_type="multipart/form-data")],
                       group_repo: GroupsRepository = Depends(get_repository(GroupsRepository)),
                       files_service: FileService = Depends(get_service(FileService)),
                       file_repository: FilesRepository = Depends(get_repository(FilesRepository)),
                       settings: AppSettings = Depends(get_app_settings),
                       token_user: User = Depends(get_current_user_auth()),
                       author_repo: AuthorsRepository = Depends(get_repository(AuthorsRepository)),
                       group_id: UUID
                       ) -> GroupResponse:
    response = await group_service.update_group(
        group_in=group_in,
        group_repo=group_repo,
        files_service=files_service,
        file_repository=file_repository,
        settings=settings,
        token_user=token_user,
        group_id=group_id,
        author_repo=author_repo
    )

    return await handle_result(response)


@router.delete(
    "/{group_id}",
    status_code=HTTP_200_OK,
    responses=ERROR_RESPONSES,
    name="delete_group",
    response_model=GroupResponse
)
async def delete_group(*,
                       group_service: GroupsService = Depends(get_service(GroupsService)),
                       group_repo: GroupsRepository = Depends(get_repository(GroupsRepository)),
                       token_user: User = Depends(get_current_user_auth()),
                       group_id: UUID
                       ) -> GroupResponse:
    response = await group_service.delete_group(
        group_repo=group_repo,
        token_user=token_user,
        group_id=group_id
    )

    return await handle_result(response)
