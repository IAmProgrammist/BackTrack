import type { IAuthService } from "features/auth/model/iauthservice";
import type { IPlayerService } from "./iplayerservice";
import type { PlayerRepository } from "./playerrepository";
import { fromEvent, map, merge, Observable, startWith } from "rxjs";
import { getAxiosConf, playlistApi, songsApi } from "shared/api/api";
import type { PlaylistOrderState, TrackOrderState } from "entities/player/model/validators";
import {match, P} from "ts-pattern";
import { FilesApiAxiosParamCreator, type PlaylistExtendedOutTracks } from "shared/api/autogen";
import type { PlayingType, SongReleaseData } from "./iplayerrepository";

export class PlayerService implements IPlayerService {
    private _repository: PlayerRepository
    private _authService: IAuthService

    readonly paused$: Observable<boolean>
    readonly volume$: Observable<number>
    readonly currentTime$: Observable<number>
    readonly duration$: Observable<number>
    readonly playing$: Observable<PlayingType>
    readonly queue$: Observable<{index: number, items: SongReleaseData[], orderType: PlaylistOrderState}>

    constructor(repository: PlayerRepository, authService: IAuthService) {
        this._repository = repository
        this._authService = authService

        const player = this._repository.player as HTMLAudioElement;
        this.paused$ = merge(
            fromEvent(player, "play").pipe(map(() => false)),
            fromEvent(player, "pause").pipe(map(() => true))
        ).pipe(startWith(player?.paused))
        this.volume$ = fromEvent(player, "volumechange").pipe(map(() => player?.volume), startWith(player?.volume))
        this.currentTime$ = fromEvent(player, "timeupdate").pipe(map(() => player?.currentTime), startWith(player?.currentTime))
        this.duration$ = fromEvent(player, "durationchange").pipe(map(() => player?.duration), startWith(player?.duration))
        this.playing$ = this._repository.playing$.asObservable();
        this.queue$ = this._repository.playQueue$.asObservable();
        
        // Играть следующий трек, когда текущий закончится
        fromEvent(player, "ended").subscribe(() => this.next())
    }

    private _shuffle<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Обновляет очередь с нуля. Если порядок "shuffle", то перемешивает треки, иначе сохраняет исходный порядок
    private _setQueue({fileIds}: {fileIds: SongReleaseData[]}) {
        const currentQueue = this._repository.playQueue$.value;

        this._repository.playQueue$.next({index: 0, originalItems: fileIds, items: currentQueue.orderType === "shuffle" ? this._shuffle(fileIds) : fileIds, orderType: currentQueue.orderType})
    }

    private _setPlaying(type: "track" | "playlist", id: string) {
        const currentState = this._repository.playing$.value;
        const state = currentState?.state || "default"
        this._repository.playing$.next({type, id, state})
    }

    scheduleTrack(id: string, version?: string) {
        return async () => songsApi.getSongApiV1SongsSongIdGet(id, version, getAxiosConf()).then(({data: {data}}) => {
            const file = data.files.find((file) => file.leading && file.mime.startsWith("audio/"));
            
            if (!file) {
                throw new Error("Scheduled song has no leading audio file")
            }

            this._setQueue({fileIds: [{id, version, fileId: file.id}]})
            this._setPlaying("track", id)
            this.togglePlay(true);
        })
    }
    
    schedulePlaylist(playlistId: string) {
        return async () => playlistApi.getPlaylistApiV1PlaylistsPlaylistIdGet(playlistId, getAxiosConf(this._authService.getToken())).then(({data: {data}}) => {
            this._setQueue({fileIds: data.tracks.filter((track): track is PlaylistExtendedOutTracks & {id: string, version: string, fileId: string} => !!track.sound_file_id && !!track.version).map((track) => ({id: track.id, version: track.version || "", fileId: track.sound_file_id || ""}))})
            this._setPlaying("playlist", playlistId)
            this.togglePlay(true);
        })
    }

    updateTrackOrderState(state: TrackOrderState) {
        const currentPlaying = this._repository.playing$.value;
        this._repository.playing$.next({...currentPlaying, state})
    }

    updatePlaylistOrderState(state: PlaylistOrderState) {
        const currentQueue = this._repository.playQueue$.value;

        match({state, orderType: currentQueue.orderType})
            .with({state: "shuffle", orderType: P.not("shuffle")}, () => {
                // Выполнить шаффлизацию. В этом случае текущий трек должен остаться первым в очереди, а остальные треки должны быть перемешаны
                const currentTrack = currentQueue.items[currentQueue.index];
                const otherTracks = currentQueue.items.filter((_, index) => index !== currentQueue.index);
                const shuffledOtherTracks = this._shuffle(otherTracks);
                this._repository.playQueue$.next({...currentQueue, index: 0, items: [currentTrack, ...shuffledOtherTracks], orderType: state})
            })
            .with({state: P.not("shuffle"), orderType: "shuffle"}, () => {
                // Вернуть исходный порядок треков. В этом случае текущий трек не будет первым в очереди и займёт своё место.
                const currentTrack = currentQueue.items[currentQueue.index];
                const originalItems = currentQueue.originalItems;
                const newIndex = originalItems.findIndex((id) => id === currentTrack);
                this._repository.playQueue$.next({...currentQueue, index: newIndex, items: originalItems, orderType: state})
            }).otherwise(() => {
                // Просто обновить порядок проигрывания в очереди, не меняя порядок треков
                this._repository.playQueue$.next({...currentQueue, orderType: state})
            })
    }

    async _updatePlayerSourceFromFileId(fileId: string) {
        const player = this._repository.player as HTMLAudioElement;

        FilesApiAxiosParamCreator().streamAudioFileApiV1FilesFileIdStreamAudioGet(fileId, undefined, getAxiosConf(this._authService.getToken())).then(({url}) => {
            player.src = url
            return player.play()
        });
    }

    // Переключить статус проигрывания
    togglePlay(play?: boolean) {
        const player = this._repository.player;
        if (!player) return;

        match(player.src)
            .with("", () => {
                const currentQueue = this._repository.playQueue$.value;
                if (currentQueue.items.length === 0 || currentQueue.index >= currentQueue.items.length) {
                    return;
                }

                this._updatePlayerSourceFromFileId(currentQueue.items[currentQueue.index].fileId)
            })
            .otherwise(() => {
                match({paused: player.paused, play})
                    .with({paused: true, play: P.union(undefined, true)}, () => player.play())
                    .with({paused: false, play: P.union(undefined, false)}, () => player.pause())
                    .otherwise(() => {})
            })
    }

    next() {
        const player = this._repository.player;
        if (!player) return;

        if (this._repository.playing$.value?.state === "repeat") {
            player.currentTime = 0;
            player.play();
            return;
        }
        
        // Выбрать следующий трек в очереди
        const currentQueue = this._repository.playQueue$.value;
        if (currentQueue.index < currentQueue.items.length - 1) {
            // Если это не последний трек, то выбрать следующий трек
            this._updatePlayerSourceFromFileId(currentQueue.items[currentQueue.index + 1].fileId)
            player.currentTime = 0;
            this._repository.playQueue$.next({...currentQueue, index: currentQueue.index + 1})
        } else if (currentQueue.index === currentQueue.items.length - 1 && currentQueue.orderType === "repeat") {
            // Если же трек последний, но порядок "repeat", то начать с начала очереди
            const newIndex = 0;
            this._updatePlayerSourceFromFileId(currentQueue.items[newIndex].fileId)
            player.currentTime = 0;
            this._repository.playQueue$.next({...currentQueue, index: newIndex})
        } else if (currentQueue.index === currentQueue.items.length - 1 && currentQueue.orderType === "default") {
            player.src = "";
            player.currentTime = 0;
            player.pause();
            return;
        }
    }
    
    // Выбрать предыдущий трек в очереди
    previous() {
        const player = this._repository.player;
        if (!player) return;

        if (this._repository.playing$.value?.state === "repeat") {
            player.currentTime = 0;
            player.play();
            return;
        }
        
        // Перемотать в начало, если прошло больше 5 секунд
        if (player.currentTime > 5) {
            player.currentTime = 0;
        } else {
            const currentQueue = this._repository.playQueue$.value;
            if (currentQueue.index > 0) {
                this._updatePlayerSourceFromFileId(currentQueue.items[currentQueue.index - 1].fileId)
                player.currentTime = 0;
                this._repository.playQueue$.next({...currentQueue, index: currentQueue.index - 1})
            } else if (currentQueue.index === 0 && currentQueue.orderType === "repeat") {
                const newIndex = currentQueue.items.length - 1;
                this._updatePlayerSourceFromFileId(currentQueue.items[newIndex].fileId)
                player.currentTime = 0;
                this._repository.playQueue$.next({...currentQueue, index: newIndex})
            } else if (currentQueue.index === 0 && currentQueue.orderType === "default") {
                player.src = "";
                player.currentTime = 0;
                player.pause();
                return;
            }
        }
        
        if (player.paused) {
            player.play();
        }
    }
    
    // Установить текущее время проигрывания
    setCurrentTime(time: number) {
        const player = this._repository.player;
        if (!player) return;
        player.currentTime = time;
    }

    // Установить громкость проигрывания
    setVolume(volume: number) {
        const player = this._repository.player;
        if (!player) return;
        player.volume = volume;
    }
}