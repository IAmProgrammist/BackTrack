import { Card, CardContent, CardHeader, CardTitle } from "shared/ui/Card"
import { msToMMSS } from "../../model/helpers"
import "./song.css"
import type { SongProps } from "./types"
import { useNavigate } from "react-router"

export const Song = ({id, name, authors, groups, duration, redirect = false}: SongProps) => {
    const navigate = useNavigate();
    return <Card clickable={redirect} onClick={() => {
        if (!redirect) return;

        navigate(`/songs/view/${id}`)
    }} className="song">
        <CardHeader className="song-header">
            {name}
        </CardHeader>
        <CardTitle className="song-title">
            {groups.map((group) => group.name).join(", ")}; {authors.map((author) => author.name).join(", ")}
        </CardTitle>
        <CardContent className="song-duration">
            Длительность: {msToMMSS(duration)}
        </CardContent>
    </Card>
}