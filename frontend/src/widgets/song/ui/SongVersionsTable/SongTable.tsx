import { Table, TableCell, TableHeaderCell, TableHR } from "shared/ui/Table/Table"
import "./styles.css"
import { Fragment } from "react/jsx-runtime"
import { Button } from "shared/ui/Button"
import { useNavigate, useParams } from "react-router"
import { useSongsService } from "features/song/lib/useSongsService"
import { useQuery } from "@tanstack/react-query"
import { SONG_VERSIONS_QUERY_KEY } from "entities/song/model/query-key"
import { Chip } from "shared/ui/Chip"
import { MdOpenInNew } from "react-icons/md"

export const SongVersionsTable = () => {
    const {songId = ""} = useParams();
    const navigate = useNavigate();
    const {service} = useSongsService();
    const {data: versionsData, isError, isLoading} = useQuery({
        queryKey: [SONG_VERSIONS_QUERY_KEY, songId],
        queryFn: service.getSongVersions(songId)
    })

    if (isLoading) {
        return "Загрузка..."
    } else if (isError || !versionsData) {
        return "Не удалось загрузить песню"
    }

    return <Table className="songversionstable">
        <TableHeaderCell>Версия</TableHeaderCell>
        <TableHeaderCell>Дата</TableHeaderCell>
        <TableHeaderCell>Тэг</TableHeaderCell>
        <TableHeaderCell>Изменения</TableHeaderCell>
        <TableHeaderCell></TableHeaderCell>
        {versionsData.map((song, id) => <Fragment key={id}>
            <TableHR className="songversionstable-hr"/>
            <TableCell>{song.version}</TableCell>
            <TableCell>{new Date(song.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>{song.tag && <Chip>{song.tag}</Chip>}</TableCell>
            <TableCell>{song.changelog}</TableCell>
            <TableCell><Button equated onClick={() => navigate(`/songs/view/${song.id}?version=${song.version}`)}><MdOpenInNew/></Button></TableCell>
        </Fragment>)}
    </Table>
}