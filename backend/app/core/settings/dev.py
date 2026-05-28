import logging

from pydantic import PostgresDsn, SecretStr

from app.core.settings.app import AppSettings


class DevAppSettings(AppSettings):
    # fastapi_kwargs
    debug: bool = True
    title: str = "BackTrack"

    # back-end app settings
    secret_key: SecretStr = SecretStr("secret-dev")
    db_url: PostgresDsn = "postgresql+asyncpg://postgres:postgres@postgresql:5432/postgres"
    audio_ae_path: str = "/app/ae/model.pt"
    logging_level: int = logging.DEBUG
