import { useState, type ReactNode } from "react";
import { SongsContextProvider as LibSongsContextProvider } from "features/song/lib/SongsContextProvider";
import { MockSongApi } from "features/song/model/mocksongapi";
import { SongService } from "features/song/model/songservice";

export const SongsContextProvider = ({children}: {children: ReactNode}) => {
    const [api] = useState(new MockSongApi());
    const [service] = useState(new SongService(api));
    
    return <LibSongsContextProvider service={service}>
        {children}
    </LibSongsContextProvider>
}