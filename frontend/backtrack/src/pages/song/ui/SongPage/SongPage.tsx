import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router";
import "./song-page.css"
import { useSongsService } from "features/song/lib/useSongsService";
import { SONG_QUERY_KEY } from "entities/song/model/query-key";
import { SongHeader } from "widgets/song/ui/SongHeader";
import { Lyrics } from "entities/song/ui/Lyrics";
import { SongVersionsTable } from "widgets/song/ui/SongVersionsTable";
import { Card, CardContent, CardTitle } from "shared/ui/Card";
import { GroupItem } from "entities/group/ui/SongItem";
import { AuthorItem } from "entities/author/ui/AuthorItem";
import { File } from "shared/ui/File/File";
import { FileGrid } from "widgets/file/ui/FileGrid/FileGrid";

export const SongPage = () => {
    const {songId = ""} = useParams();
    const [searchParams] = useSearchParams();
    const version = searchParams.get("version") || undefined;

    const {service} = useSongsService();
    const {data: songData, isError, isLoading} = useQuery({
        queryKey: [SONG_QUERY_KEY, songId, version],
        queryFn: service.getSong(songId, version)
    })

    if (isLoading) {
        return "Загрузка..."
    } else if (isError || !songData) {
        return "Не удалось загрузить песню"
    }

    return <div className="songpage">
        <SongHeader
            id={songData.id}
            name={songData.name}
            description={songData.description}
            tag={songData.tag}
            imageURL={songData.files.find((file) => file.mime.startsWith("image") && file.leading)?.url}
            bpm={songData?.bpm?.toString()}
            songKey={songData?.songKey}
            duration={songData.duration}
            version={songData.version}
        />
        <div className="songpage-sections">
            <div className="songpage-section">
                <Card>
                    <CardTitle className="songpage-section-title">
                        Слова
                    </CardTitle>
                    <CardContent className="songpage-section-content">
                        <Lyrics lyrics={songData.lyrics}/>
                    </CardContent>
                </Card>
                <Card>
                    <CardTitle className="songpage-section-title">
                        История изменений
                    </CardTitle>
                    <CardContent className="songpage-section-content">
                        <SongVersionsTable/>
                    </CardContent>
                </Card>
            </div>
            <div className="songpage-section">
                <Card>
                    <CardTitle className="songpage-section-title">
                        Группы
                    </CardTitle>
                    <CardContent className="songpage-section-content">
                        {songData.groups.length === 0 ? "Групп нет" : songData.groups.map((it) => <GroupItem key={it.id} imageURL={it.imageURL} name={it.name} id={it.id}/>)}
                    </CardContent>
                </Card>
                <Card>
                    <CardTitle className="songpage-section-title">
                        Авторы
                    </CardTitle>
                    <CardContent className="songpage-section-content">
                        {songData.groups.length === 0 ? "Авторов нет" : songData.authors.map((it) => <AuthorItem key={it.id} imageURL={it.imageURL} name={it.name} id={it.id}/>)}
                    </CardContent>
                </Card>
                <Card>
                    <CardTitle className="songpage-section-title">
                        Файлы
                    </CardTitle>
                    <CardContent className="songpage-section-content">
                        <FileGrid files={songData.files}/>
                    </CardContent>
                </Card>
                <Card>
                    <CardTitle className="songpage-section-title">
                        Плейлисты
                    </CardTitle>
                    <CardContent className="songpage-section-content">
                        <Lyrics lyrics={songData.lyrics}/>
                    </CardContent>
                </Card>
                <Card>
                    <CardTitle className="songpage-section-title">
                        Комментарии
                    </CardTitle>
                    <CardContent className="songpage-section-content">
                        <Lyrics lyrics={songData.lyrics}/>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
}