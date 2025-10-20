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
    
    return <Card className="playlist-header">
        <img src={imageURL} className="playlist-header-image"/>
        <div className="playlist-header-info">
            <h3 className="playlist-header-title">
                {name}
            </h3>
            <p className="playlist-header-description">
                {description}
            </p>
            <div className="playlist-header-actions">
                <Button onClick={() => navigate(`/playlists/update/${id}`)}>Редактировать</Button>
                <Button onClick={() => deletePlaylist()}>Удалить</Button>
            </div>
        </div>
    </Card>
}