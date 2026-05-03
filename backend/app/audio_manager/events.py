import logging

from fastapi import FastAPI

from app.audio_manager.audio_manager import AudioManager
from app.core.settings.app import AppSettings

logger = logging.getLogger(__name__)


async def connect_to_ae(app: FastAPI, settings: AppSettings) -> None:
    logger.info("Booting up a CNN...")

    audio_manager = AudioManager(settings.audio_ae_path)
    app.state.audio_manager = audio_manager

    logger.info("CNN booted up.")
