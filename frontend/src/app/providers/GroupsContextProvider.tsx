import { useState, type ReactNode } from "react"
import { GroupsContextProvider as LibGroupsContextProvider } from "features/groups/lib/GroupsContextProvider"
import { GroupService } from "features/groups/model/groupservice"
import { useAuthService } from "features/auth/ui/useAuthService"
import { GroupApi } from "features/groups/model/groupapi"

export const GroupsContextProvider = ({children}: {children: ReactNode}) => {
    const authService = useAuthService();
    const [api] = useState(new GroupApi())
    const [service] = useState(new GroupService(api, authService));
    
    return <LibGroupsContextProvider service={service}>
        {children}
    </LibGroupsContextProvider>
}