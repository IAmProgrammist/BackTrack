import { useQuery } from "@tanstack/react-query";
import { AUTHOR_QUERY_KEY } from "entities/author/model/query-key";
import { useAuthorsService } from "features/authors/lib/useAuthorsService"
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Button } from "shared/ui/Button";
import { ControlledFileInput } from "shared/ui/ControlledFileInput/ControlledFileInput";
import { ControlledTextInput } from "shared/ui/ControlledTextInput/ControlledTextInput";
import { Mutate } from "widgets/mutate/ui/Mutate"

export const EditAuthorPage = () =>  {
    const {service} = useAuthorsService();
    const navigate = useNavigate();
    const {authorId} = useParams(); 
    
    return <Mutate title="Обновить автора" 
        mutationFn={(data) => service.updateAuthor(authorId || "", data)()} 
        yupSchema={service.updateSchema()} 
        onSuccess={(data) => navigate(`/authors/view/${data.id}`)}
        onError={(e) => console.log(e)}>
        <EditAuthorFormPage/>
    </Mutate>
}

export const EditAuthorFormPage = () => {
    const {authorId} = useParams(); 
    const {setValue} = useFormContext();
    const {service} = useAuthorsService();
    
    const {data: authorData} = useQuery({
        queryKey: [AUTHOR_QUERY_KEY, authorId],
        queryFn: () => service.getAuthor(authorId || "")()
    })

    useEffect(() => {
        if (!authorData) return;
        
        setValue("name", authorData.name);
        setValue("description", authorData.description);
    }, [authorData])

    return <>
        <ControlledTextInput controlProps={{name: "name"}} inputProps={{subText: "Имя"}}/>
        <ControlledTextInput controlProps={{name: "description"}} inputProps={{subText: "Описание"}}/>
        <ControlledFileInput controlProps={{name: "icon"}} inputProps={{subText: "Картинка", type: "file"}}/>

        <div><Button type="submit">Обновить</Button></div>
    </>
}