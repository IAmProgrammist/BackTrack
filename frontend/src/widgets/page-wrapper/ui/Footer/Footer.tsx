import { usePlayerContext } from "features/player/ui/usePlayerContext"
import "./footer.css"
import { useObservableState } from "observable-hooks";
import clsx from "clsx";
import { useMemo } from "react";

const RANDOM_PHRASES = [
    "Oh, ho, ho, it's magic, you know!",
    "What a splendid pie, pizza-pizza pie",
    "Старая мельница крутится-вертится",
    "Куда же я иду...",
    "No alarms and no surprises, please",
    "So can we wander for a spell?",
    "Год за годом растут большие города",
    "And everybody wants to get evil tonight",
    "Словно из водопровода льёт на нас с небес вода",
    "Sometimes I wonder again and again",
    "Это за окном рассвет!"
]

export const Footer = () => {
    const playerService = usePlayerContext();
    const trackPlaying = useObservableState(playerService.playing$);
    const randomPhrase = useMemo(() => RANDOM_PHRASES[Math.floor(Math.random() * RANDOM_PHRASES.length)], []);

    return <footer className={clsx( trackPlaying && trackPlaying?.type !== "empty" && "footer--playing", "footer")}>
        IAmProgrammist, {new Date().getFullYear()}. {randomPhrase}
    </footer>
}