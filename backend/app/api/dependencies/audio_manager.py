from fastapi.requests import Request

from app.audio_manager.audio_manager import AudioManager


def get_audio_manager(requset: Request) -> AudioManager:
    return requset.app.state.audio_manager
