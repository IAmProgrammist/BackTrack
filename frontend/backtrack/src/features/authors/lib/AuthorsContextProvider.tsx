import type { ReactNode } from "react";
import type { IAuthorService } from "../model/iauthorservice";
import { AuthorsContext } from "./authorsContext";

export const AuthorsContextProvider = ({service, children}: {service: IAuthorService, children: ReactNode}) => {
    return <AuthorsContext.Provider value={service}>
        {children}
    </AuthorsContext.Provider>
}