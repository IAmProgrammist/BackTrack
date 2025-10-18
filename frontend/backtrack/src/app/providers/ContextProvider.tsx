import type { ReactNode } from "react";
import { HeaderContextProvider } from "./HeaderContextProvider";
import { GroupsContextProvider } from "./GroupsContextProvider";
import { AuthorsContextProvider } from "./AuthorsContextProvider";
import { QueryClientProvider } from "./QueryClientProvider";
import { BrowserRouter } from "react-router";

export const ContextProvider = ({children}: {children: ReactNode}) => {
    return <BrowserRouter>
        <QueryClientProvider>
            <HeaderContextProvider>
                <GroupsContextProvider>
                    <AuthorsContextProvider>
                        {children}
                    </AuthorsContextProvider>
                </GroupsContextProvider>
            </HeaderContextProvider>
        </QueryClientProvider>
    </BrowserRouter>
}