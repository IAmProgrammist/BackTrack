import type { BehaviorSubject } from "rxjs";
import type { PlaylistOrderState, TrackOrderState } from "entities/player/model/validators";

export type PlayingType = 
    | {type: "track", id: string, state: TrackOrderState}
    | {type: "playlist", id: string, state: TrackOrderState}
    | {type: "empty", id: null, state: TrackOrderState}

export interface SongReleaseData {
    id: string;
    version?: string;
    fileId: string;
}

export interface IPlayerRepository {
    // Состояние проигрывания
    playing$: BehaviorSubject<PlayingType>;
    // Кешированная последовательность треков
    playQueue$: BehaviorSubject<{index: number, items: SongReleaseData[], originalItems: SongReleaseData[], orderType: PlaylistOrderState}>;
    // Элемент HTML для проигрывания
    player: HTMLAudioElement | null;
}