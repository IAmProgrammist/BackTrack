from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    # Required fields
    database_url: str = Field(env="DATABASE_URL")

    # Optional fields
    debug: bool = Field(default=False)

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
