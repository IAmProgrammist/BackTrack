import { ObjectSchema, type AnyObject } from "yup"
import type { GroupsFilters } from "./igroupapi"

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
    participants: {id: string, name: string, imageURL: string}[]
    imageURL: string
}

export interface IGroupService {
    getGroups: (filter?: GroupsFilters) => () => Promise<GroupResponseShortDTO[]>
    getGroup: (id: string) => () => Promise<GroupResponseExpandedDTO>
    updateGroup: (id: string, data: unknown) => () => Promise<GroupResponseShortDTO>
    deleteGroup: (id: string) => () => Promise<unknown>
    createGroup: (data: unknown) => () => Promise<GroupResponseShortDTO>
    updateSchema: () => ObjectSchema<AnyObject, GroupUpdateDTO>
    createSchema: () => ObjectSchema<AnyObject, GroupCreateDTO>
}
