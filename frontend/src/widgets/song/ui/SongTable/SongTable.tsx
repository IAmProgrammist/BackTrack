import { Table, TableCell, TableHeaderCell, TableHR } from "shared/ui/Table/Table"
import "./song-table.css"
import type { SongTableProps } from "./types"
import { Fragment } from "react/jsx-runtime"
import { msToMMSS } from "entities/song/model/helpers"
import { Button } from "shared/ui/Button"
import { MdPause, MdPlayArrow } from "react-icons/md"
import { Link } from "react-router"
import { usePlayerContext } from "features/player/ui/usePlayerContext"
import { useObservableState } from "observable-hooks"
import { useMemo } from "react"

export const SongTable = ({tracks, playlistId}: SongTableProps) => {
    const playerService = usePlayerContext();

    const playingQueue = useObservableState(playerService.queue$);
    const paused = useObservableState(playerService.paused$);

    const currentSong = useMemo(() => {
        return playingQueue?.items?.[playingQueue?.index] || null
    }, [playingQueue])

    const handleOpenSong = (id: string, version: string | null) => {
        return `/songs/view/${id}${version ? `?version=${version}` : ''}`
    }

    return <Table className="song-table">
        <TableHeaderCell>Название трека</TableHeaderCell>
        <TableHeaderCell>Исполнители</TableHeaderCell>
        <TableHeaderCell>Длительность</TableHeaderCell>
        <TableHeaderCell></TableHeaderCell>
        {tracks.map((song, id) => <Fragment key={id}>
            <TableHR/>
            <TableCell className="song-table-name">
                <Button equated chonk onClick={() => {
                    if (currentSong && song.id === currentSong.id && song.version === currentSong?.version && !paused) {
                        playerService.togglePlay(false);
                    } else {
                        if (playlistId) {
                            playerService.schedulePlaylist(playlistId, id)()
                        } else {
                            playerService.scheduleTrack(song.id, song.version || undefined)()
                        }
                    }
                }}>{currentSong && song.id === currentSong.id && song.version === currentSong?.version && !paused ? <MdPause size="2rem"/> : <MdPlayArrow size="2rem"/>}</Button>
                <Link to={handleOpenSong(song.id, song.version)}>{song.name}</Link>
            </TableCell>
            <TableCell>
                {[
                    ...song.groups.map((group) => <Link to={`/groups/view/${group.id}`}>{group.name}</Link>),
                    <> </>,
                    ...song.authors.map((author) => <Link to={`/authors/view/${author.id}`}>{author.name}</Link>)
                ]}
            </TableCell>
            <TableCell>{msToMMSS(song.duration)}</TableCell>
            <TableCell></TableCell>
        </Fragment>)}
    </Table>
}