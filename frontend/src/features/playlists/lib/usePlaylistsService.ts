import { useContext } from "react"
import { PlaylistsContext } from "./playlistsContext"

export const usePlaylistsService = () => {
    const service = useContext(PlaylistsContext);

    return {service}
}