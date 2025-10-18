import { useQuery } from "@tanstack/react-query";
import { useGroupsService } from "features/groups/lib/useGroupsService";
import "./home-page.css"
import { GROUP_QUERY_KEY } from "entities/group/model/query-key";
import { Group } from "entities/group/ui/Group";
import { useAuthorsService } from "features/authors/lib/useAuthorsService";
import { AUTHOR_QUERY_KEY } from "entities/author/model/query-key";
import { Author } from "entities/author/ui/Author";
import { useEffect } from "react";
import type { AuthorService } from "features/authors/model/authorservice";

export const HomePage = () => {
    const {service: groupService} = useGroupsService();
    const {data: groups} = useQuery({
        queryKey: [GROUP_QUERY_KEY],
        queryFn: groupService.getGroups()
    })

    const {service: authorService} = useAuthorsService();

    useEffect(() => {
        (authorService as AuthorService).getAuthors();
    }, [authorService])

    const {data: authors} = useQuery({
        queryKey: [AUTHOR_QUERY_KEY],
        queryFn: authorService.getAuthors()
    })

    return <div>
        {groups?.map((group) => <Group key={group.id} redirect id={group.id} imageURL={group.imageURL} name={group.name}/>)}
        {authors?.map((author) => <Author key={author.id} redirect id={author.id} imageURL={author.imageURL} name={author.name}/>)}
    </div>
}