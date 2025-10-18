import { Card, CardContent, CardHeader, CardTitle } from "shared/ui/Card"
import { msToMMSS } from "../../model/helpers"
import "./author.css"
import type { SongProps } from "./types"
import { useNavigate } from "react-router"

export const Song = ({id, name, authors, duration, redirect = false}: SongProps) => {
    const navigate = useNavigate();
    return <Card clickable={redirect} onClick={() => {
        if (!redirect) return;

        navigate(`/authors/${id}/view`)
    }} className="song">
        <CardHeader className="song-header">
            {name}
        </CardHeader>
        <CardTitle className="song-title">
            {authors.map((author) => author.name).join(", ")}
        </CardTitle>
        <CardContent className="song-duration">
            Длительность: {msToMMSS(duration)}
        </CardContent>
    </Card>
}