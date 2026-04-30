import type { LyricsProps } from "./types";
import "./styles.css"

export const Lyrics = ({lyrics}: LyricsProps) => {
    return <div className="lyrics">
        {lyrics}
    </div>
}