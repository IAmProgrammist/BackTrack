import { useAuthorsService } from "features/authors/lib/useAuthorsService"
import { useNavigate } from "react-router";
import { Button } from "shared/ui/Button";
import { ControlledFileInput } from "shared/ui/ControlledFileInput/ControlledFileInput";
import { ControlledTextInput } from "shared/ui/ControlledTextInput/ControlledTextInput";
import { Mutate } from "widgets/mutate/ui/Mutate"

export const AddAuthorPage = () =>  {
    const {service} = useAuthorsService();
    const navigate = useNavigate();
    
    return <Mutate title="Создать автора" mutationFn={(data) => service.createAuthor(data)()} yupSchema={service.createSchema()} onSuccess={(data) => navigate(`/authors/view/${data.id}`)}>
        <ControlledTextInput controlProps={{name: "name"}} inputProps={{subText: "Имя"}}/>
        <ControlledTextInput controlProps={{name: "description"}} inputProps={{subText: "Описание"}}/>
        <ControlledFileInput controlProps={{name: "icon"}} inputProps={{subText: "Картинка", type: "file"}}/>

        <div><Button type="submit">Создать</Button></div>
    </Mutate>
}