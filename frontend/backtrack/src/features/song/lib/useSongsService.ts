import { useContext } from "react"
import { SongsContext } from "./songsContext";

export const usePlaylistsService = () => {
    const service = useContext(SongsContext);

    return {service}
}