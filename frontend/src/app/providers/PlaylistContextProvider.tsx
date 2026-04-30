import { useAuthService } from "features/auth/ui/useAuthService"
import { PlaylistsContextProvider } from "features/playlists/lib/PlaylistsContextProvider"
import { PlaylistApi } from "features/playlists/model/playlistapi"
import { PlaylistService } from "features/playlists/model/playlistservice"
import { useState, type ReactNode } from "react"

export const PlaylistContextProvider = ({children}: {children: ReactNode}) => {
    const authService = useAuthService();
    const [api] = useState(new PlaylistApi())
    const [service] = useState(new PlaylistService(api, authService))
    
    return <PlaylistsContextProvider service={service}>
        {children}
    </PlaylistsContextProvider>
}