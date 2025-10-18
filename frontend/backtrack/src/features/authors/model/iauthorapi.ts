import type { TypedFormData } from "shared/model/typedFormData"

export type AuthorCreateDTO = TypedFormData<{
    name: string
    description: string
    icon: File
}>

export type AuthorUpdateDTO = TypedFormData<{
    id: string
    name: string
    description: string
    icon: File
}>

export interface AuthorResponseDTO {
    id: string
    name: string
    description: string
    imageURL: string
}

export interface IAuthorApi {
    getAuthors: () => () => Promise<AuthorResponseDTO[]>
    getAuthor: (id: string) => () => Promise<AuthorResponseDTO>
    updateAuthor: (data: AuthorUpdateDTO) => () => Promise<AuthorResponseDTO>
    deleteAuthor: (id: string) => () => Promise<unknown>
    createAuthor: (data: AuthorCreateDTO) => () => Promise<AuthorResponseDTO>
}