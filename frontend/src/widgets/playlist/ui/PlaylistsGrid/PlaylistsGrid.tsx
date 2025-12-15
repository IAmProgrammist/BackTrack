import { useQuery } from "@tanstack/react-query"
import "./playlists-grid.css"
import { usePlaylistsService } from "features/playlists/lib/usePlaylistsService";
import { PLAYLIST_QUERY_KEY } from "entities/playlist/model/query-key";
import { Playlist } from "entities/playlist/ui/Playlist";
import { Button } from "shared/ui/Button";
import { useNavigate } from "react-router";
import type { PlaylistsFilters } from "features/playlists/model/iplaylistapi";

export const PlaylistsGrid = ({filters}: {filters: PlaylistsFilters}) => {
    const {service} = usePlaylistsService();
    const {data: playlistsData, isLoading: playlistsIsLoading, isError: playlistsIsError} = useQuery({
        queryKey: [PLAYLIST_QUERY_KEY, filters],
        queryFn: service.getPlaylists(filters)
    })
    const navigate = useNavigate();

    let content = null;
    if (playlistsIsLoading) {
        content = "Загрузка..."
    } else if (playlistsIsError) {
        content = "Не удалось загрузить плейлисты :("
    } else {
        content = playlistsData?.map((it) => <Playlist key={it.id} redirect id={it.id} name={it.name} songsAmount={it.tracksAmount}/>)
    }

    return <article className="playlists-grid">
        <h1 className="playlists-grid-title">
            Плейлисты<Button onClick={() => navigate("/playlists/create")}>Создать</Button>
        </h1>
        <div className="playlists-grid-content">
            {content}
        </div>
    </article>
}