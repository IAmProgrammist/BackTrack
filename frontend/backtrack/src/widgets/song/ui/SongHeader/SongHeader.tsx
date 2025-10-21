import { useMutation } from "@tanstack/react-query";
import { PLAYLIST_QUERY_KEY } from "entities/playlist/model/query-key";
import { usePlaylistsService } from "features/playlists/lib/usePlaylistsService";
import { useNavigate } from "react-router"
import { Card } from "shared/ui/Card";
import "./song-header.css"
import { Button } from "shared/ui/Button";
import type { PlaylistHeaderProps } from "./types";
import { Chip } from "shared/ui/Chip";
import { msToMMSS } from "entities/song/model/helpers";
import { useSongsService } from "features/song/lib/useSongsService";
import { SONG_QUERY_KEY } from "entities/song/model/query-key";

export const PlaylistHeader = ({id,
    name,
    description, 
    tag,
    imageURL,
    bpm,
    songKey,
    duration,
    version
}: PlaylistHeaderProps) => {
    const {service} = useSongsService();
    const {mutate: deleteSong} = useMutation({
        mutationKey: [SONG_QUERY_KEY, id],
        mutationFn: () => service.deleteSong(id)(),
        onSuccess: () => {
            navigate("/songs");
        }
    })
    const navigate = useNavigate();
    
    return <Card className="song-header">
        <img src={imageURL} className="song-header-image"/>
        <div className="song-header-info">
            <h3 className="song-header-title">
                {name}
                {tag ? <Chip>Черновик</Chip> : null}
            </h3>
            <p className="song-header-description">
                {description}
            </p>
            <h4 className="song-header-meta">
                BPM: {bpm}
                <br/>
                Тональность: {songKey}
                <br/>
                Длительность: {msToMMSS(duration)}
            </h4>
            <div className="song-header-actions">
                <Button onClick={() => navigate(`/songs/release/${id}?version=${version}`)}>Выпустить версию</Button>
                <Button onClick={() => deleteSong()}>Удалить</Button>
            </div>
        </div>
    </Card>
}