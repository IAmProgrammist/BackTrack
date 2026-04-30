import type { ReactNode } from "react";
import type { IGroupService } from "../model/igroupservice";
import { GroupsContext } from "./groupsContext";

export const GroupsContextProvider = ({service, children}: {service: IGroupService, children: ReactNode}) => {
    return <GroupsContext.Provider value={service}>
        {children}
    </GroupsContext.Provider>
}