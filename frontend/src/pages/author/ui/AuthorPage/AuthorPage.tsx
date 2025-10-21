import { AuthorHeader } from "widgets/author/ui/AuthorHeader"
import "./author-page.css"
import { SongsGrid } from "widgets/song/ui/SongsGrid"
import { useAuthorsService } from "features/authors/lib/useAuthorsService"
import { useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { AUTHOR_QUERY_KEY } from "entities/author/model/query-key"
import { GroupsGrid } from "widgets/group/ui/GroupsGrid"

export const AuthorPage = () => {
    const {authorId} = useParams();
    const {service} = useAuthorsService();
    const {data: authorData, isError, isLoading} = useQuery({
        queryKey: [AUTHOR_QUERY_KEY, authorId],
        queryFn: service.getAuthor(authorId || "")
    })

    if (isLoading) {
        return "Загрузка..."
    } else if (isError || !authorData) {
        return "Не удалось загрузить автора"
    }

    return <div className="author-page">
        <AuthorHeader id={authorData.id} name={authorData.name} imageURL={authorData.imageURL} description={authorData.description}/>
        <GroupsGrid/>
        <SongsGrid/>
    </div>
}