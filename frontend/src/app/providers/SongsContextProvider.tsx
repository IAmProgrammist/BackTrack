import { useState, type ReactNode } from "react";
import { SongsContextProvider as LibSongsContextProvider } from "features/song/lib/SongsContextProvider";
import { SongService } from "features/song/model/songservice";
import { useAuthService } from "features/auth/ui/useAuthService";
import { SongApi } from "features/song/model/songapi";

export const SongsContextProvider = ({children}: {children: ReactNode}) => {
    const authService = useAuthService();
    const [api] = useState(new SongApi());
    const [service] = useState(new SongService(api, authService));
    
    return <LibSongsContextProvider service={service}>
        {children}
    </LibSongsContextProvider>
}