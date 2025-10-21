import { useQuery } from "@tanstack/react-query"
import { AUTHOR_QUERY_KEY } from "entities/author/model/query-key";
import { ControlledSelectInput } from "shared/ui/ControlledSelectInput";
import type { ControlledGroupSelectProps } from "./types";
import { useGroupsService } from "features/groups/lib/useGroupsService";

export const ControlledGroupSelect = ({controlProps, selectProps = {}}: ControlledGroupSelectProps) => {
    const {service} = useGroupsService();
    const {data: authors} = useQuery({
        queryKey: [AUTHOR_QUERY_KEY],
        queryFn: service.getGroups()
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