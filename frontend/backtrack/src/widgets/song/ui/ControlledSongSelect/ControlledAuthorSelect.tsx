import { useQuery } from "@tanstack/react-query"
import { AUTHOR_QUERY_KEY } from "entities/author/model/query-key";
import { ControlledSelectInput } from "shared/ui/ControlledSelectInput";
import type { ControlledAuthorSelectProps } from "./types";
import { useSongsService } from "features/song/lib/useSongsService";

export const ControlledSongSelect = ({controlProps, selectProps = {}}: ControlledAuthorSelectProps) => {
    const {service} = useSongsService();
    const {data: authors} = useQuery({
        queryKey: [AUTHOR_QUERY_KEY],
        queryFn: service.getSongs()
    })

    return <ControlledSelectInput controlProps={controlProps} selectProps={
        {
            ...selectProps,
            options: 
                authors?.map((song) => ({
                    children: `${song.groups.map((gr) => gr.name).join(", ")}; ${song.authors.map((au) => au.name).join(", ")} - ${song.name}`,
                    value: song.id
                }))
        }
    }
    />
}