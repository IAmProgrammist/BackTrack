import { ObjectSchema, type AnyObject } from "yup"

export interface GroupCreateDTO {
    name: string
    description: string
    participants: string[]
    icon: File[]
}

export interface GroupUpdateDTO {
    id: string
    name: string
    description: string
    participants: string[]
    icon: File[]
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
    participants: {id: string, name: string}[]
    imageURL: string
}

export interface IGroupService {
    getGroups: () => () => Promise<GroupResponseShortDTO[]>
    getGroup: (id: string) => () => Promise<GroupResponseExpandedDTO>
    updateGroup: (data: GroupUpdateDTO) => () => Promise<GroupResponseShortDTO>
    deleteGroup: (id: string) => () => Promise<unknown>
    createGroup: (data: GroupCreateDTO) => () => Promise<GroupResponseShortDTO>
    updateSchema: () => ObjectSchema<AnyObject, GroupUpdateDTO>
    createSchema: () => ObjectSchema<AnyObject, GroupCreateDTO>
}
