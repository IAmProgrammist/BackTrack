import { useQuery } from "@tanstack/react-query"
import { GROUP_QUERY_KEY } from "entities/group/model/query-key";
import { Group } from "entities/group/ui/Group";
import { useGroupsService } from "features/groups/lib/useGroupsService"
import "./groups-grid.css"

export const GroupsGrid = () => {
    const {service} = useGroupsService();
    const {data: groupsData, isLoading: groupsIsLoading, isError: groupsIsError} = useQuery({
        queryKey: [GROUP_QUERY_KEY],
        queryFn: service.getGroups()
    })

    let content = null;
    if (groupsIsLoading) {
        content = "Загрузка..."
    } else if (groupsIsError) {
        content = "Не удалось загрузить группы :("
    } else {
        content = groupsData?.map((it) => <Group key={it.id} redirect id={it.id} name={it.name} imageURL={it.imageURL}/>)
    }

    return <article className="groups-grid">
        <h1 className="groups-grid-title">
            Группы
        </h1>
        <div className="groups-grid-content">
            {content}
        </div>
    </article>
}