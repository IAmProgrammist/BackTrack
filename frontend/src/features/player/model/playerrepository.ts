import type { PlaylistOrderState, TrackOrderState } from 'entities/player/model/validators';
import { BehaviorSubject } from 'rxjs';
import type { IPlayerRepository } from './iplayerrepository';

export type PlayingType = 
    | {type: "track", id: string, state: TrackOrderState}
    | {type: "playlist", id: string, state: TrackOrderState}

export class PlayerRepository implements IPlayerRepository {
    // Состояние проигрывания
    readonly playing$ = new BehaviorSubject<PlayingType | null>(null);
    // Кешированная последовательность треков
    readonly playQueue$ = new BehaviorSubject<{index: number, items: string[], originalItems: string[], orderType: PlaylistOrderState}>({index: 0, items: [], originalItems: [], orderType: "default"});
    // Элемент HTML для проигрывания
    readonly player: HTMLAudioElement | null = new Audio();
}