import type { ReactNode } from "react";
import { HeaderContextProvider } from "./HeaderContextProvider";
import { GroupsContextProvider } from "./GroupsContextProvider";
import { AuthorsContextProvider } from "./AuthorsContextProvider";
import { QueryClientProvider } from "./QueryClientProvider";
import { BrowserRouter } from "react-router";
import { SongsContextProvider } from "./SongsContextProvider";
import { PlaylistContextProvider } from "./PlaylistContextProvider";
import { AuthContextProvider } from "./AuthContextProvider";
import { SnackbarProvider } from "notistack";
import { PlayerContextProvider } from "./PlayerContextProvider";

export const ContextProvider = ({children}: {children: ReactNode}) => {
    return <BrowserRouter>
        <AuthContextProvider>
            <QueryClientProvider>
                <HeaderContextProvider>
                    <GroupsContextProvider>
                        <AuthorsContextProvider>
                            <SongsContextProvider>
                                <PlaylistContextProvider>
                                    <PlayerContextProvider>
                                        <SnackbarProvider>
                                            {children}
                                        </SnackbarProvider>
                                    </PlayerContextProvider>
                                </PlaylistContextProvider>
                            </SongsContextProvider>
                        </AuthorsContextProvider>
                    </GroupsContextProvider>
                </HeaderContextProvider>
            </QueryClientProvider>
        </AuthContextProvider>
    </BrowserRouter>
}