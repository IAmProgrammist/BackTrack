import type { ReactNode } from "react";
import type { IHeaderService } from "../model/iheaderservice";
import { HeaderContext } from "./headerContext";

export const HeaderContextProvider = ({service, children}: {service: IHeaderService, children: ReactNode}) => {
    return <HeaderContext.Provider value={service}>
        {children}
    </HeaderContext.Provider>
}