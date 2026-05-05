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
import { useObservableState } from "observable-hooks";
import { usePlayerContext } from "features/player/ui/usePlayerContext";
import { useMemo } from "react";
import { MdPause, MdPlayArrow } from "react-icons/md";

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

    const playerService = usePlayerContext();

    const playingQueue = useObservableState(playerService.queue$);
    const paused = useObservableState(playerService.paused$);

    const currentSong = useMemo(() => {
        return playingQueue?.items?.[playingQueue?.index] || null
    }, [playingQueue])
    
    return <Card className="songheader">
        {imageURL && <img src={imageURL} className="songheader-image"/>}
        <div className="songheader-info">
            <div className="songheader-title">
                <h3>{name}</h3>
                {tag ? <Chip>{tag}</Chip> : null}
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
                <Button className="songheader-play" equated onClick={() => {
                    if (currentSong && id === currentSong.id && version === currentSong?.version && !paused) {
                        playerService.togglePlay(false);
                    } else {
                        playerService.scheduleTrack(id, version || undefined)()
                    }
                }}>{currentSong && id === currentSong.id && version === currentSong?.version && !paused ? <MdPause/> : <MdPlayArrow/>}</Button>
                <Button onClick={() => navigate(`/songs/release/${id}?version=${version}`)}>Выпустить версию</Button>
                <Button onClick={() => deleteSong()}>Удалить</Button>
            </div>
        </div>
    </Card>
}