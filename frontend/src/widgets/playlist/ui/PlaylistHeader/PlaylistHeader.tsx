import { useMutation } from "@tanstack/react-query";
import { PLAYLIST_QUERY_KEY } from "entities/playlist/model/query-key";
import { usePlaylistsService } from "features/playlists/lib/usePlaylistsService";
import { useNavigate } from "react-router"
import { Card } from "shared/ui/Card";
import "./playlist-header.css"
import { Button } from "shared/ui/Button";
import type { PlaylistHeaderProps } from "./types";

export const PlaylistHeader = ({id, name, description, imageURL}: PlaylistHeaderProps) => {
    const {service} = usePlaylistsService();
    const {mutate: deletePlaylist} = useMutation({
        mutationKey: [PLAYLIST_QUERY_KEY, id],
        mutationFn: () => service.deletePlaylist(id)(),
        onSuccess: () => {
            navigate("/playlists");
        }
    })
    const navigate = useNavigate();
    
    return <Card className="playlistheader">
        <img src={imageURL} className="playlistheader-image"/>
        <div className="playlistheader-info">
            <h3 className="playlistheader-title">
                {name}
            </h3>
            <p className="playlistheader-description">
                {description}
            </p>
            <div className="playlistheader-actions">
                <Button onClick={() => navigate(`/playlists/update/${id}`)}>Редактировать</Button>
                <Button onClick={() => deletePlaylist()}>Удалить</Button>
            </div>
        </div>
    </Card>
}