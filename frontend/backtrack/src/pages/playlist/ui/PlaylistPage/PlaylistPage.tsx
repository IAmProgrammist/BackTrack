import { useQuery } from "@tanstack/react-query";
import { PLAYLIST_QUERY_KEY } from "entities/playlist/model/query-key";
import { usePlaylistsService } from "features/playlists/lib/usePlaylistsService";
import { useParams } from "react-router";
import { Card, CardContent } from "shared/ui/Card";
import { PlaylistHeader } from "widgets/playlist/ui/PlaylistHeader";
import { SongTable } from "widgets/song/ui/SongTable";
import "./playlist-page.css"

export const PlaylistPage = () => {
    const {playlistId = ""} = useParams();
    const {service} = usePlaylistsService();
    const {data: playlistData, isError, isLoading} = useQuery({
        queryKey: [PLAYLIST_QUERY_KEY, playlistId],
        queryFn: service.getPlaylist(playlistId || "")
    })

    if (isLoading) {
        return "Загрузка..."
    } else if (isError || !playlistData) {
        return "Не удалось загрузить плейлист"
    }

    return <div className="playlist-page">
            <PlaylistHeader
                id={playlistId}
                name={playlistData.name}
                description={playlistData.description}
                imageURL={playlistData.imageURL}
            />
            <Card>
                <CardContent>
                    <SongTable tracks={playlistData.tracks}/>
                </CardContent>
            </Card>
        </div>
}