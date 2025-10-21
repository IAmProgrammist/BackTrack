import { useQuery } from "@tanstack/react-query"
import { AUTHOR_QUERY_KEY } from "entities/author/model/query-key";
import { useAuthorsService } from "features/authors/lib/useAuthorsService"
import { ControlledSelectInput } from "shared/ui/ControlledSelectInput";
import type { ControlledAuthorSelectProps } from "./types";

export const ControlledAuthorSelect = ({controlProps, selectProps = {}}: ControlledAuthorSelectProps) => {
    const {service} = useAuthorsService();
    const {data: authors} = useQuery({
        queryKey: [AUTHOR_QUERY_KEY],
        queryFn: service.getAuthors()
    })

    return <ControlledSelectInput controlProps={controlProps} selectProps={
        {
            ...selectProps,
            options: 
                authors?.map((author) => ({
                    children: author.name,
                    value: author.id
                }))
        }
    }
    />
}