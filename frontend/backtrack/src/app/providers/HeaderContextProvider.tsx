import { useState, type ReactNode } from "react";
import { HeaderRepository } from "features/header/model/headerrepository";
import { HeaderService } from "features/header/model/headerservice";
import { HeaderContextProvider as LibHeaderContextProvider } from "features/header/lib/HeaderContextProvider";

export const HeaderContextProvider = ({children}: {children: ReactNode}) => {
    const [repository] = useState(new HeaderRepository());
    const [service] = useState(new HeaderService(repository));
    
    return <LibHeaderContextProvider service={service}>
        {children}
    </LibHeaderContextProvider>
}