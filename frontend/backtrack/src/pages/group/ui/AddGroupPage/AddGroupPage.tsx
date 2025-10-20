import { useGroupsService } from "features/groups/lib/useGroupsService";
import { useNavigate } from "react-router";
import { Button } from "shared/ui/Button";
import { ControlledFileInput } from "shared/ui/ControlledFileInput/ControlledFileInput";
import { ControlledTextInput } from "shared/ui/ControlledTextInput/ControlledTextInput";
import { ControlledAuthorSelect } from "widgets/author/ui/ControlledAuthorSelect";
import { Mutate } from "widgets/mutate/ui/Mutate"

export const AddGroupPage = () =>  {
    const {service} = useGroupsService();
    const navigate = useNavigate();
    
    return <Mutate title="Создать группу" 
            mutationFn={(data) => service.createGroup(data)()} 
            yupSchema={service.createSchema()} 
            onSuccess={(data) => navigate(`/groups/view/${data.id}`)}
        >
        <ControlledTextInput controlProps={{name: "name"}} inputProps={{subText: "Имя"}}/>
        <ControlledTextInput controlProps={{name: "description"}} inputProps={{subText: "Описание"}}/>
        <ControlledAuthorSelect controlProps={{name: "participants"}} selectProps={{subText: "Участники"}}/>
        <ControlledFileInput controlProps={{name: "icon"}} inputProps={{subText: "Картинка", type: "file"}}/>

        <div><Button type="submit">Создать</Button></div>
    </Mutate>
}