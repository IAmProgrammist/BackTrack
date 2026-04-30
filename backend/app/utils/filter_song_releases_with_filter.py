from app.models.song_release import SongRelease

def filter_song_releases_according_to_filter(songs: list[SongRelease], filter: str) -> list[SongRelease]:
    if filter == "":
        return songs

    return [song for song in songs if str(song.id) == filter or song.tag == filter]
