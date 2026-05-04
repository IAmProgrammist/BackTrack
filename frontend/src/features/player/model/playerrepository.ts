import type { PlaylistOrderState } from 'entities/player/model/validators';
import { BehaviorSubject } from 'rxjs';
import type { IPlayerRepository, PlayingType, SongReleaseData } from './iplayerrepository';

export class PlayerRepository implements IPlayerRepository {
    // Состояние проигрывания
    readonly playing$ = new BehaviorSubject<PlayingType>({type: "empty", id: null, state: "default"});
    // Кешированная последовательность треков
    readonly playQueue$ = new BehaviorSubject<{index: number, items: SongReleaseData[], originalItems: SongReleaseData[], orderType: PlaylistOrderState}>({index: 0, items: [], originalItems: [], orderType: "default"});
    // Элемент HTML для проигрывания
    readonly player: HTMLAudioElement | null = new Audio();
}