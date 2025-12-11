import { useState, type ReactNode } from "react"
import { AuthorsContextProvider as LibAuthorsContextProvider } from "features/authors/ui/AuthorsContextProvider"
import { AuthorService } from "features/authors/model/authorservice"
import { AuthorApi } from "features/authors/model/authorapi";
import { useAuthService } from "features/auth/ui/useAuthService";

export const AuthorsContextProvider = ({children}: {children: ReactNode}) => {
    const authService = useAuthService();
    const [api] = useState(new AuthorApi())
    const [service] = useState(new AuthorService(api, authService));
    
    return <LibAuthorsContextProvider service={service}>
        {children}
    </LibAuthorsContextProvider>
}