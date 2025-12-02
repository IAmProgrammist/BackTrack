import { useState, type ReactNode } from "react"
import { AuthorsContextProvider as LibAuthorsContextProvider } from "features/authors/ui/AuthorsContextProvider"
import { AuthorService } from "features/authors/model/authorservice"
import { MockAuthorApi } from "features/authors/model/mockauthorapi";

export const AuthorsContextProvider = ({children}: {children: ReactNode}) => {
    const [api] = useState(new MockAuthorApi())
    const [service] = useState(new AuthorService(api));
    
    return <LibAuthorsContextProvider service={service}>
        {children}
    </LibAuthorsContextProvider>
}