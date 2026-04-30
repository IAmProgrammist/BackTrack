import type { SortByOrder } from "shared/api/autogen"

export interface GroupCreateDTO {
    name: string
    description: string
    icon: File
    participants: string[]
}

export interface GroupUpdateDTO {
    name: string
    description: string
    icon: File
    participants: string[]
}

export interface GroupResponseShortDTO {
    id: string
    name: string
    description: string
    participants: string[]
    imageURL: string
}

export interface GroupResponseExpandedDTO {
    id: string
    name: string
    description: string
    participants: {id: string, name: string, imageURL: string}[]
    imageURL: string
}

export interface GroupsFilters {
    id?: string[]
    q?: string
    authorsId?: string[]
    page?: number
    perPage?: number
    sortBy?: "id" | "name"
    sortByOrder?: SortByOrder
}

export interface IGroupApi {
    getGroups: (token?: string | null, filters?: GroupsFilters) => () => Promise<GroupResponseShortDTO[]>
    getGroup: (id: string, token?: string | null) => () => Promise<GroupResponseExpandedDTO>
    updateGroup: (id: string, data: GroupUpdateDTO, token?: string | null) => () => Promise<GroupResponseShortDTO>
    deleteGroup: (id: string, token?: string | null) => () => Promise<unknown>
    createGroup: (data: GroupCreateDTO, token?: string | null) => () => Promise<GroupResponseShortDTO>
}