import { useContext } from "react"
import { SongsContext } from "./songsContext";

export const useSongsService = () => {
    const service = useContext(SongsContext);

    return {service}
}