import { Slider } from "shared/ui/Slider"
import "./player.css"
import { Card, CardContent } from "shared/ui/Card"
import { Button } from "shared/ui/Button"
import { Icon } from '@mdi/react';
import { mdiShuffleDisabled } from "@mdi/js"
import { MdClose, MdExpandLess, MdExpandMore, MdLink, MdPause, MdPlayArrow, MdRepeat, MdRepeatOne, MdShuffle, MdSkipNext, MdSkipPrevious, MdSource, MdViewAgenda } from "react-icons/md"
import { usePlayerContext } from "features/player/ui/usePlayerContext"
import { useObservableState } from "observable-hooks";
import { sampleTime } from "rxjs"
import dayjs from "dayjs";
import { match } from "ts-pattern"
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SONG_VERSIONS_QUERY_KEY } from "entities/song/model/query-key";
import { useSongsService } from "features/song/lib/useSongsService";
import { useNavigate } from "react-router";
import clsx from "clsx";
import { PLAYLIST_QUERY_KEY } from "entities/playlist/model/query-key";
import { usePlaylistsService } from "features/playlists/lib/usePlaylistsService";
import { SongTable } from "widgets/song/ui/SongTable";

export const Player = () => {
    const [expanded, setExpanded] = useState(false);
    const playerService = usePlayerContext();
    const {service: songService} = useSongsService();
    const {service: playlistService} = usePlaylistsService();

    const currentTime = useObservableState(playerService.currentTime$.pipe(sampleTime(500))) || 0;
    const paused = useObservableState(playerService.paused$);
    const duration = useObservableState(playerService.duration$) || 0;
    const volume = useObservableState(playerService.volume$);
    const trackPlaying = useObservableState(playerService.playing$);
    const playlistPlaying = useObservableState(playerService.queue$);

    const navigate = useNavigate();

    const currentTrack = useMemo(() => {
        return playlistPlaying?.items?.[playlistPlaying.index];
    }, [playlistPlaying])

    const {data: songData, isLoading: songIsLoading, isError: songIsError} = useQuery({
        queryKey: [SONG_VERSIONS_QUERY_KEY, currentTrack?.id, currentTrack?.version],
        queryFn: () => songService.getSong(currentTrack?.id || "", currentTrack?.version || undefined)(),
        enabled: !!currentTrack
    })

    const {data: playlistData, isLoading: playlistIsLoading, isError: playlistIsError} = useQuery({
        queryKey: [PLAYLIST_QUERY_KEY, trackPlaying?.id],
        queryFn: () => playlistService.getPlaylist(trackPlaying?.id || "")(),
        enabled: !!trackPlaying?.id && trackPlaying.type === "playlist"
    })

    const {tracksPlaying, isLoading: tracksQueueIsLoading, isError: tracksQueueIsError} = useMemo(() => {
        if (trackPlaying?.type === "track") {
            return {tracksPlaying: songData ? [songData] : [], isLoading: songIsLoading, isError: songIsError}
        }
        if (trackPlaying?.type === "playlist") {
            return {tracksPlaying: playlistData ? playlistData.tracks : [], isLoading: playlistIsLoading, isError: playlistIsError}
        }

        return {tracksPlaying: [], isLoading: false, isError: false};
    }, [trackPlaying, songData, songIsLoading, songIsError, playlistData, playlistIsLoading, playlistIsError])

    const handleOpenSong = useCallback(() => {
        if(currentTrack) {
            navigate(`/songs/view/${currentTrack.id}${currentTrack.version ? `?version=${currentTrack.version}` : ''}`)
        }
    }, [currentTrack, navigate])
    

    return <div className={clsx("player-container", trackPlaying && trackPlaying?.type !== "empty" && "player-container--visible", expanded && "player-container--expanded")}>
        <div className="player-widget-actions">
            <Button equated chonk onClick={() => {
                if (trackPlaying?.type === "playlist") {
                    setExpanded(false)
                    navigate(`/playlists/view/${trackPlaying.id}`)
                } else if (trackPlaying?.type === "track") {
                    setExpanded(false)
                    handleOpenSong()
                }
            }}>
                <MdSource size={"2rem"}/>
            </Button>
            <Button equated chonk onClick={() => setExpanded(!expanded)}>
                {expanded ? <MdExpandMore size="2rem"/> : <MdExpandLess size="2rem"/>}
            </Button>
            <Button equated chonk onClick={() => {
                setExpanded(false)
                playerService.cleanPlaylist()
            }}>
                <MdClose size={"2rem"}/>
            </Button>
        </div>
        <Card className="player">
            <div className={clsx("player-queue", !expanded && "player-queue--hidden")}>
                {tracksQueueIsLoading ? "Загрузка треков, подождите..." : null}
                {tracksQueueIsError ? "Не удалось загрузить треки из очереди" : null}
                {!tracksQueueIsError && !tracksQueueIsLoading && <SongTable playlistId={trackPlaying?.type === "playlist" ? trackPlaying?.id : undefined} tracks={tracksPlaying}/>}
            </div>
            <CardContent>
                <div className="player-content">
                    <div className="player-progress">
                        {dayjs(currentTime * 1000).format("mm:ss")}
                        <Slider className="player-progress-controller" progress={currentTime / duration || 0} onProgressChange={(progress) => playerService.setCurrentTime(progress * duration)}/>
                        {dayjs(duration * 1000).format("mm:ss")}
                    </div>
                    
                    <div className="player-controls">
                        <div className="player-info" >
                            <div className="player-name" onClick={handleOpenSong}>{songIsLoading ? "Loading..." : songData?.name}</div>
                            <div className="player-artists" onClick={handleOpenSong}>{songIsLoading ? "Loading..." : [
                                    ...(songData?.groups?.map((group) => group.name) || []),
                                    ...(songData?.authors?.map((author) => author.name) || [])
                                ].join(", ")}</div>
                        </div>
                        
                        <div className="player-buttons">
                            <Button equated chonk onClick={() => playerService.updatePlaylistOrderState(
                                match(playlistPlaying?.orderType)
                                    .with("default", () => "repeat" as const)
                                    .with("repeat", () => "shuffle" as const)
                                    .with("shuffle", () => "default" as const)
                                    .otherwise(() => "default" as const)
                                )}>
                                {playlistPlaying?.orderType === "shuffle" && <MdShuffle size={"2rem"}/>}
                                {playlistPlaying?.orderType === "repeat" && <MdRepeat size={"2rem"}/>}
                                {playlistPlaying?.orderType === "default" ? <Icon path={mdiShuffleDisabled} size={'2rem'} /> : null}
                            </Button>
                            <Button equated chonk onClick={() => playerService.previous()}>
                                <MdSkipPrevious size={"2rem"}/>
                            </Button>
                            <Button equated chonk onClick={() => playerService.togglePlay()}>
                                {paused ? <MdPlayArrow size={"2rem"}/> : <MdPause size={"2rem"}/>}
                            </Button>
                            <Button equated chonk onClick={() => playerService.next()}>
                                <MdSkipNext size={"2rem"}/>
                            </Button>
                            <Button equated chonk onClick={() => playerService.updateTrackOrderState(match(trackPlaying?.state).with("default", () => "repeat" as const).with("repeat", () => "default" as const).otherwise(() => "default" as const))}>
                                {trackPlaying?.state === "repeat" && <MdRepeatOne size={"2rem"}/>}
                                {trackPlaying?.state === "default" && <MdRepeat size={"2rem"}/>}
                            </Button>
                        </div>
                        <div className="player-volume">
                            <Slider progress={volume || 0} onProgressChange={(volume) => playerService.setVolume(volume)}/>
                        </div>
                    </div>
                    
                </div>
            </CardContent>
        </Card>
    </div>
}