import type { ReactNode } from "react";
import { SongsContext } from "./songsContext";
import type { ISongService } from "../model/isongservice";

export const SongsContextProvider = ({service, children}: {service: ISongService, children: ReactNode}) => {
    return <SongsContext.Provider value={service}>
        {children}
    </SongsContext.Provider>
}