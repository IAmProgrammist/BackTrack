import { PlaylistsContextProvider } from "features/playlists/lib/PlaylistsContextProvider"
import { MockPlaylistApi } from "features/playlists/model/mockplaylistapi"
import { PlaylistService } from "features/playlists/model/playlistservice"
import { useState, type ReactNode } from "react"

export const PlaylisContextProvider = ({children}: {children: ReactNode}) => {
    const [api] = useState(new MockPlaylistApi())
    const [service] = useState(new PlaylistService(api))
    
    return <PlaylistsContextProvider service={service}>
        {children}
    </PlaylistsContextProvider>
}