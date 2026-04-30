import type { ReactNode } from "react";
import type { IPlaylistService } from "../model/iplaylistservice";
import { PlaylistsContext } from "./playlistsContext";

export const PlaylistsContextProvider = ({service, children}: {service: IPlaylistService, children: ReactNode}) => {
    return <PlaylistsContext.Provider value={service}>
        {children}
    </PlaylistsContext.Provider>
}