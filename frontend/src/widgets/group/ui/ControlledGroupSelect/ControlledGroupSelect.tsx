import { useQuery } from "@tanstack/react-query"
import { ControlledSelectInput } from "shared/ui/ControlledSelectInput";
import type { ControlledGroupSelectProps } from "./types";
import { useGroupsService } from "features/groups/lib/useGroupsService";
import { GROUP_QUERY_KEY } from "entities/group/model/query-key";

export const ControlledGroupSelect = ({controlProps, selectProps = {}}: ControlledGroupSelectProps) => {
    const {service} = useGroupsService();
    const {data: groups} = useQuery({
        queryKey: [GROUP_QUERY_KEY],
        queryFn: service.getGroups()
    })

    return <ControlledSelectInput controlProps={controlProps} selectProps={
        {
            ...selectProps,
            options: 
                groups?.map((author) => ({
                    children: author.name,
                    value: author.id
                }))
        }
    }
    />
}