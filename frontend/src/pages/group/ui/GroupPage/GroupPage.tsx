import "./group-page.css"
import { SongsGrid } from "widgets/song/ui/SongsGrid"
import { useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { useGroupsService } from "features/groups/lib/useGroupsService"
import { GROUP_QUERY_KEY } from "entities/group/model/query-key"
import { GroupHeader } from "widgets/group/ui/GroupHeader"

export const GroupPage = () => {
    const {groupId} = useParams();
    const {service} = useGroupsService();
    const {data: groupData, isError, isLoading} = useQuery({
        queryKey: [GROUP_QUERY_KEY, groupId],
        queryFn: service.getGroup(groupId || "")
    })

    if (isLoading) {
        return "Загрузка..."
    } else if (isError || !groupData) {
        return "Не удалось загрузить группу"
    }

    return <div className="group-page">
        <GroupHeader 
        id={groupData.id} 
        name={groupData.name} 
        imageURL={groupData.imageURL} 
        description={groupData.description} 
        participants={groupData.participants}
        />
        <SongsGrid filters={{groupsIds: [groupId || ""]}}/>
    </div>
}