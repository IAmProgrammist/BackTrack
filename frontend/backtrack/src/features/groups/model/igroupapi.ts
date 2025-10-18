export type GroupCreateDTO = FormData

export type GroupUpdateDTO = FormData

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
    participants: {id: string, name: string}[]
    imageURL: string
}

export interface IGroupApi {
    getGroups: () => () => Promise<GroupResponseShortDTO[]>
    getGroup: (id: string) => () => Promise<GroupResponseExpandedDTO>
    updateGroup: (data: GroupUpdateDTO) => () => Promise<GroupResponseShortDTO>
    deleteGroup: (id: string) => () => Promise<unknown>
    createGroup: (data: GroupCreateDTO) => () => Promise<GroupResponseShortDTO>
}