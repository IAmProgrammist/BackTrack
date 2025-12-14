from pydantic import BaseModel, ConfigDict
from typing import Any


class ErrorResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    app_exception: str = "FailToSendAlert"
    context: dict[str, Any] | None = {"reason": "Not Connected with notification channel"}


class ApiResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    message: str = "default response message"
    data: BaseModel
    detail: dict[str, Any] | None = {"key": "val"}
