import { useQuery } from "@tanstack/react-query"
import "./songs-grid.css"
import { SONG_QUERY_KEY } from "entities/song/model/query-key";
import { Song } from "entities/song/ui/Song";
import { useSongsService } from "features/song/lib/useSongsService";

export const SongsGrid = () => {
    const {service} = useSongsService();
    const {data: songsData, isLoading: songsIsLoading, isError: songsIsError} = useQuery({
        queryKey: [SONG_QUERY_KEY],
        queryFn: service.getSongs()
    })

    let content = null;
    if (songsIsLoading) {
        content = "Загрузка..."
    } else if (songsIsError) {
        content = "Не удалось загрузить песни :("
    } else {
        content = songsData?.map((it) => <Song key={it.id} redirect id={it.id} name={it.name} duration={it.duration} authors={it.authors} groups={it.groups}/>)
    }

    return <article className="songs-grid">
        <h1 className="songs-grid-title">
            Песни
        </h1>
        <div className="songs-grid-content">
            {content}
        </div>
    </article>
}