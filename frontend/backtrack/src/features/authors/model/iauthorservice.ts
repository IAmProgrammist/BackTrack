import { ObjectSchema, type AnyObject } from "yup"

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
    getAuthors: () => () => Promise<AuthorResponseDTO[]>
    getAuthor: (id: string) => () => Promise<AuthorResponseDTO>
    updateAuthor: (data: AuthorUpdateDTO) => () => Promise<AuthorResponseDTO>
    deleteAuthor: (id: string) => () => Promise<unknown>
    createAuthor: (data: AuthorCreateDTO) => () => Promise<AuthorResponseDTO>
    updateSchema: () => ObjectSchema<AnyObject, AuthorUpdateDTO>
    createSchema: () => ObjectSchema<AnyObject, AuthorCreateDTO>
}
