import { useQuery } from "@tanstack/react-query";
import { PLAYLIST_QUERY_KEY } from "entities/playlist/model/query-key";
import { usePlaylistsService } from "features/playlists/lib/usePlaylistsService";
import { useParams } from "react-router";
import { PlaylistHeader } from "widgets/playlist/ui/PlaylistHeader";

export const PlaylistPage = () => {
    const {playlistId = ""} = useParams();
    const {service} = usePlaylistsService();
    const {data: palylistData, isError, isLoading} = useQuery({
        queryKey: [PLAYLIST_QUERY_KEY, playlistId],
        queryFn: service.getPlaylist(playlistId || "")
    })

    if (isLoading) {
        return "Загрузка..."
    } else if (isError || !palylistData) {
        return "Не удалось загрузить плейлист"
    }

    return <div className="playlist-page">
            <PlaylistHeader
                id={playlistId}
                name={palylistData.name}
                description={palylistData.description}
                imageURL={palylistData.imageURL}
            />    
        </div>
}