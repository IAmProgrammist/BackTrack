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

export const ContextProvider = ({children}: {children: ReactNode}) => {
    return <BrowserRouter>
        <AuthContextProvider>
            <QueryClientProvider>
                <HeaderContextProvider>
                    <GroupsContextProvider>
                        <AuthorsContextProvider>
                            <SongsContextProvider>
                                <PlaylistContextProvider>
                                    <SnackbarProvider>
                                        {children}
                                    </SnackbarProvider>
                                </PlaylistContextProvider>
                            </SongsContextProvider>
                        </AuthorsContextProvider>
                    </GroupsContextProvider>
                </HeaderContextProvider>
            </QueryClientProvider>
        </AuthContextProvider>
    </BrowserRouter>
}