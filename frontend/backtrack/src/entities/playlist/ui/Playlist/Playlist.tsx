import { useNavigate } from "react-router"
import { Card, CardContent, CardTitle } from "shared/ui/Card"
import "./playlist.css"
import type { PlaylistProps } from "./types";

export const Playlist = ({id, name, songsAmount, redirect = false}: PlaylistProps) => {
    const navigate = useNavigate();
    
    return <Card clickable={redirect} onClick={() => {
        if (!redirect) return;

        navigate(`/playlists/${id}/view`);
    }} className="playlist playlist--small">
        <CardTitle className="playlist-title">
            {name}
        </CardTitle>
        <CardContent className="playlist-content">
            Количество песен: {songsAmount}
        </CardContent>
    </Card>
}