import { useQuery } from "@tanstack/react-query"
import "./authors-grid.css"
import { useAuthorsService } from "features/authors/lib/useAuthorsService";
import { AUTHOR_QUERY_KEY } from "entities/author/model/query-key";
import { Author } from "entities/author/ui/Author";
import { Button } from "shared/ui/Button";
import { useNavigate } from "react-router";

export const AuthorsGrid = () => {
    const {service} = useAuthorsService();
    const {data: authorsData, isLoading: authorsIsLoading, isError: authorsIsError} = useQuery({
        queryKey: [AUTHOR_QUERY_KEY],
        queryFn: service.getAuthors()
    })
    const navigate = useNavigate();

    let content = null;
    if (authorsIsLoading) {
        content = "Загрузка..."
    } else if (authorsIsError) {
        content = "Не удалось загрузить авторов :("
    } else {
        content = authorsData?.map((it) => <Author key={it.id} redirect id={it.id} name={it.name} imageURL={it.imageURL}/>)
    }

    return <article className="authors-grid">
        <h1 className="authors-grid-title">
            Авторы <Button onClick={() => navigate("/authors/create")}>Добавить</Button>
        </h1>
        <div className="authors-grid-content">
            {content}
        </div>
    </article>
}