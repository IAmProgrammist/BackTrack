from fastapi import APIRouter

from app.api.v1 import auth, users, files, author, group, song

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(files.router, prefix="/files", tags=["files"])
api_router.include_router(author.router, prefix="/authors", tags=["authors"])
api_router.include_router(group.router, prefix="/groups", tags=["groups"])
api_router.include_router(song.router, prefix="/songs", tags=["songs"])
