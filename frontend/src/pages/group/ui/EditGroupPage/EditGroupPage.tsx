import { useQuery } from "@tanstack/react-query";
import { GROUP_QUERY_KEY } from "entities/group/model/query-key";
import { useGroupsService } from "features/groups/lib/useGroupsService";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Button } from "shared/ui/Button";
import { ControlledFileInput } from "shared/ui/ControlledFileInput/ControlledFileInput";
import { ControlledTextInput } from "shared/ui/ControlledTextInput/ControlledTextInput";
import { ControlledAuthorSelect } from "widgets/author/ui/ControlledAuthorSelect";
import { Mutate } from "widgets/mutate/ui/Mutate"

export const EditGroupPage = () =>  {
    const {service} = useGroupsService();
    const navigate = useNavigate();
    
    return <Mutate title="Редактировать группу" 
            mutationFn={(data) => service.createGroup(data)()} 
            yupSchema={service.createSchema()} 
            onSuccess={(data) => navigate(`/groups/view/${data.id}`)}
        >
        <EditGroupFormPage/>
    </Mutate>
}

export const EditGroupFormPage = () => {
    const {groupId} = useParams(); 
    const {setValue} = useFormContext();
    const {service} = useGroupsService();
    
    const {data: groupData} = useQuery({
        queryKey: [GROUP_QUERY_KEY, groupId],
        queryFn: () => service.getGroup(groupId || "")()
    })

    useEffect(() => {
        if (!groupData) return;
        
        setValue("name", groupData.name);
        setValue("description", groupData.description);
        setValue("participants", groupData.participants);
    }, [groupData])

    return <>
        <ControlledTextInput controlProps={{name: "name"}} inputProps={{subText: "Имя"}}/>
        <ControlledTextInput controlProps={{name: "description"}} inputProps={{subText: "Описание"}}/>
        <ControlledAuthorSelect controlProps={{name: "participants"}} selectProps={{subText: "Участники"}}/>
        <ControlledFileInput controlProps={{name: "icon"}} inputProps={{subText: "Картинка", type: "file"}}/>

        <div><Button type="submit">Обновить</Button></div>
    </>
}