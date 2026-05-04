import { useAuthService } from "features/auth/ui/useAuthService"
import { PlayerRepository } from "features/player/model/playerrepository"
import { PlayerService } from "features/player/model/playerservice"
import { PlayerContext } from "features/player/ui/playerContext"
import { useMemo } from "react"

export const PlayerContextProvider = ({children}: {children: React.ReactNode}) => {
    const authService = useAuthService();
    const player = useMemo(() => new PlayerService(new PlayerRepository(), authService), [authService])
    
    return <PlayerContext.Provider value={player}>
        {children}
    </PlayerContext.Provider>
}