import { Avatar } from "shared/ui/Avatar/Avatar"
import { Button } from "shared/ui/Button"
import { Card, CardContent, CardTitle } from "shared/ui/Card"
import "./author-header.css"
import type { AuthorHeaderProps } from "./types"
import { useMutation } from "@tanstack/react-query"
import { AUTHOR_QUERY_KEY } from "entities/author/model/query-key"
import { useAuthorsService } from "features/authors/lib/useAuthorsService"
import { useNavigate } from "react-router"

export const AuthorHeader = ({name, imageURL, description, id}: AuthorHeaderProps) => {
    const {service} = useAuthorsService();
    const {mutate: deleteAuthor} = useMutation({
        mutationKey: [AUTHOR_QUERY_KEY, id],
        mutationFn: () => service.deleteAuthor(id)(),
        onSuccess: () => {
            navigate("/authors");
        }
    })
    const navigate = useNavigate();

    return <Card className="authorheader">
        <Avatar src={imageURL}/>
        <CardContent className="authorheader-info">
            <CardTitle className="authorheader-title">
                {name} 
                <Button className="authorheader-title-edit" onClick={() => navigate(`/authors/update/${id}`)}>Редактировать</Button>
                <Button onClick={() => deleteAuthor()}>Удалить</Button>
            </CardTitle>
            <p>
                {description}
            </p>
        </CardContent>
    </Card>
}