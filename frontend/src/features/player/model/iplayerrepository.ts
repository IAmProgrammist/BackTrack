import type { BehaviorSubject } from "rxjs";
import type { PlayingType } from "./playerrepository";
import type { PlaylistOrderState } from "entities/player/model/validators";

export interface IPlayerRepository {
    // Состояние проигрывания
    playing$: BehaviorSubject<PlayingType | null>;
    // Кешированная последовательность треков
    playQueue$: BehaviorSubject<{index: number, items: string[], originalItems: string[], orderType: PlaylistOrderState}>;
    // Элемент HTML для проигрывания
    player: HTMLAudioElement | null;
}