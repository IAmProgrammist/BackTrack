import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router"
import { Card } from "shared/ui/Card";
import "./song-header.css"
import { Button } from "shared/ui/Button";
import type { SongHeaderProps } from "./types";
import { Chip } from "shared/ui/Chip";
import { msToMMSS } from "entities/song/model/helpers";
import { useSongsService } from "features/song/lib/useSongsService";
import { SONG_QUERY_KEY } from "entities/song/model/query-key";

export const SongHeader = ({id,
    name,
    description, 
    tag,
    imageURL,
    bpm,
    songKey,
    duration,
    version
}: SongHeaderProps) => {
    const {service} = useSongsService();
    const {mutate: deleteSong} = useMutation({
        mutationKey: [SONG_QUERY_KEY, id],
        mutationFn: () => service.deleteSong(id)(),
        onSuccess: () => {
            navigate("/songs");
        }
    })
    const navigate = useNavigate();
    
    return <Card className="songheader">
        {imageURL && <img src={imageURL} className="songheader-image"/>}
        <div className="songheader-info">
            <div className="songheader-title">
                <h3>{name}</h3>
                {tag ? <Chip>Черновик</Chip> : null}
            </div>
            <p className="songheader-description">
                {description}
            </p>
            <h5 className="songheader-meta">
                {bpm && <>BPM: {bpm}
                <br/></>}
                {songKey && <>Тональность: {songKey}
                <br/></>}
                Длительность: {msToMMSS(duration)}
            </h5>
            <div className="songheader-actions">
                <Button onClick={() => navigate(`/songs/release/${id}?version=${version}`)}>Выпустить версию</Button>
                <Button onClick={() => deleteSong()}>Удалить</Button>
            </div>
        </div>
    </Card>
}