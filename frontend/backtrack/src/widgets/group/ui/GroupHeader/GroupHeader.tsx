import { Avatar } from "shared/ui/Avatar/Avatar"
import { Button } from "shared/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "shared/ui/Card"
import "./group-header.css"
import type { GroupHeaderProps } from "./types"
import { useGroupsService } from "features/groups/lib/useGroupsService"
import { useMutation } from "@tanstack/react-query"
import { GROUP_QUERY_KEY } from "entities/group/model/query-key"
import { useNavigate } from "react-router"

export const GroupHeader = ({id, name, imageURL, description, participants}: GroupHeaderProps) => {
    const {service} = useGroupsService();
    const {mutate: deleteGroup} = useMutation({
        mutationKey: [GROUP_QUERY_KEY, id],
        mutationFn: () => service.deleteGroup(id)(),
        onSuccess: () => {
            navigate("/groups");
        }
    })
    const navigate = useNavigate();
    
    return <Card className="group-header">
        <CardHeader className="group-header-header">
            <img src={imageURL}/>
            <CardTitle className="group-title">
                <h3>{name}</h3>
                <Button onClick={() => navigate(`/groups/update/${id}`)}>Редактировать</Button>
                <Button onClick={() => deleteGroup()}>Удалить</Button>
            </CardTitle>
        </CardHeader>
        <CardContent className="group-content">
            <p className="group-desciption">
                {description}
            </p>
            <div className="group-participants">
                <div className="group-participants-text">Участники:</div>
                {participants.map((it) => (<Avatar src={it.imageURL}/>))}
            </div>
        </CardContent>
    </Card>
}