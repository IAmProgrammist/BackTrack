import { useState, type ReactNode } from "react"
import { GroupsContextProvider as LibGroupsContextProvider } from "features/groups/lib/GroupsContextProvider"
import { GroupService } from "features/groups/model/groupservice"
import { MockGroupApi } from "features/groups/model/mockgroupapi"

export const GroupsContextProvider = ({children}: {children: ReactNode}) => {
    const [api] = useState(new MockGroupApi())
    const [service] = useState(new GroupService(api));
    
    return <LibGroupsContextProvider service={service}>
        {children}
    </LibGroupsContextProvider>
}