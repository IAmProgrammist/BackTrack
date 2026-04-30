import { Table, TableCell, TableHeaderCell, TableHR } from "shared/ui/Table/Table"
import "./song-table.css"
import type { SongTableProps } from "./types"
import { Fragment } from "react/jsx-runtime"
import { msToMMSS } from "entities/song/model/helpers"
import { Button } from "shared/ui/Button"
import { BiDotsVertical } from "react-icons/bi"

export const SongTable = ({tracks}: SongTableProps) => {
    return <Table className="song-table">
        <TableHeaderCell>Название трека</TableHeaderCell>
        <TableHeaderCell>Исполнители</TableHeaderCell>
        <TableHeaderCell>Длительность</TableHeaderCell>
        <TableHeaderCell></TableHeaderCell>
        {tracks.map((song, id) => <Fragment key={id}>
            <TableHR/>
            <TableCell>{song.name}</TableCell>
            <TableCell>{song.groups.map((gr) => gr.name).join(", ")}; {song.authors.map((au) => au.name).join(", ")}</TableCell>
            <TableCell>{msToMMSS(song.duration)}</TableCell>
            <TableCell><Button equated><BiDotsVertical/></Button></TableCell>
        </Fragment>)}
    </Table>
}