import { ObjectSchema, type AnyObject } from "yup"
import type { AuthorsFilters } from "./iauthorapi"

export interface AuthorCreateDTO {
    name: string
    description: string
    icon: File[]
}

export interface AuthorUpdateDTO {
    id: string
    name: string
    description: string
    icon: File[]
}

export interface AuthorResponseDTO {
    id: string
    name: string
    description: string
    imageURL: string
}

export interface IAuthorService {
    getAuthors: (filters?: AuthorsFilters) => () => Promise<AuthorResponseDTO[]>
    getAuthor: (id: string) => () => Promise<AuthorResponseDTO>
    updateAuthor: (id: string, data: unknown) => () => Promise<AuthorResponseDTO>
    deleteAuthor: (id: string) => () => Promise<unknown>
    createAuthor: (data: unknown) => () => Promise<AuthorResponseDTO>
    updateSchema: () => ObjectSchema<AnyObject, AuthorUpdateDTO>
    createSchema: () => ObjectSchema<AnyObject, AuthorCreateDTO>
}
