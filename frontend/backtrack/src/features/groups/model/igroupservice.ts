import { ObjectSchema } from "yup"

export interface GroupCreateSchema {
    name: string
    description: string
    participants: string[]
    icon: File[]
}

export interface GroupUpdateSchema {
    id: string
    name: string
    description: string
    participants: string[]
    icon: File[]
}

export interface GroupResponseShortSchema {
    id: string
    name: string
    description: string
    participants: string[]
    imageURL: string
}

export interface GroupResponseExpandedSchema {
    id: string
    name: string
    description: string
    participants: {id: string, name: string}[]
    imageURL: string
}

export interface IGroupService {
    getGroups: () => Promise<GroupResponseShortSchema[]>
    getGroup: (id: string) => Promise<GroupResponseExpandedSchema>
    updateGroup: (data: GroupUpdateSchema) => Promise<GroupResponseShortSchema>
    deleteGroup: (id: string) => Promise<unknown>
    createGroup: (data: GroupCreateSchema) => Promise<GroupResponseShortSchema>
    updateSchema: () => ObjectSchema<GroupUpdateSchema>
    createSchema: () => ObjectSchema<GroupCreateSchema>
}
