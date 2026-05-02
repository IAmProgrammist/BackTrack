import logging
from fastapi import FastAPI
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.core.settings.app import AppSettings
from app.audio_manager.audio_manager import AudioManager

logger = logging.getLogger(__name__)


async def connect_to_cnn(app: FastAPI, settings: AppSettings) -> None:
    logger.info("Booting up a CNN...")

    audio_manager = AudioManager(settings.cnn_path)
    app.state.audio_manager = async_session_factory

    logger.info("CNN booted up.")
