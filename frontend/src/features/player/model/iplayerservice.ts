import type { Observable } from "rxjs"
import type { PlaylistOrderState, TrackOrderState } from "entities/player/model/validators"
import type { PlayingType, SongReleaseData } from "./iplayerrepository"


export interface IPlayerService {
    readonly paused$: Observable<boolean>
    readonly volume$: Observable<number>
    readonly currentTime$: Observable<number>
    readonly duration$: Observable<number>
    readonly playing$: Observable<PlayingType>
    readonly queue$: Observable<{index: number, items: SongReleaseData[], orderType: PlaylistOrderState}>

    // Запланировать трек для проигрывания
    scheduleTrack: (id: string, version?: string) => () => Promise<void>
    // Запланировать плейлист для проигрывания
    schedulePlaylist: (playlistId: string, preferredIndex?: number) => () => Promise<void>
    // Переключить статус проигрывания
    togglePlay: (play?: boolean) => void
    // Выбрать следующий трек в очереди
    next: () => void
    // Выбрать предыдущий трек в очереди
    previous: () => void
    // Установить текущее время проигрывания
    setCurrentTime: (time: number) => void
    // Установить громкость проигрывания
    setVolume: (volume: number) => void
    // Обновить порядок проигрывания трека
    updateTrackOrderState: (state: TrackOrderState) => void
    // Обновить порядок проигрывания плейлиста
    updatePlaylistOrderState: (state: PlaylistOrderState) => void
    // Убрать всё из очереди проигрывания
    cleanPlaylist: () => void
}