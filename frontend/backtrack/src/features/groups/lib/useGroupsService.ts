import { useContext } from "react"
import { GroupsContext } from "./groupsContext"

export const useGroupsService = () => {
    const service = useContext(GroupsContext);

    return {service}
}