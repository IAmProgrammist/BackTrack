import type { ReactNode } from "react";
import { HeaderContextProvider } from "./HeaderContextProvider";
import { GroupsContextProvider } from "./GroupsContextProvider";
import { AuthorsContextProvider } from "./AuthorsContextProvider";
import { QueryClientProvider } from "./QueryClientProvider";
import { BrowserRouter } from "react-router";
import { SongsContextProvider } from "./SongsContextProvider";
import { PlaylistContextProvider } from "./PlaylistContextProvider";
import { AuthContextProvider } from "./AuthContextProvider";

export const ContextProvider = ({children}: {children: ReactNode}) => {
    return <BrowserRouter>
        <AuthContextProvider>
            <QueryClientProvider>
                <HeaderContextProvider>
                    <GroupsContextProvider>
                        <AuthorsContextProvider>
                            <SongsContextProvider>
                                <PlaylistContextProvider>
                                    {children}
                                </PlaylistContextProvider>
                            </SongsContextProvider>
                        </AuthorsContextProvider>
                    </GroupsContextProvider>
                </HeaderContextProvider>
            </QueryClientProvider>
        </AuthContextProvider>
    </BrowserRouter>
}