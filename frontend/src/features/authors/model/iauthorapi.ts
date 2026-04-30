import type { SortByOrder } from "shared/api/autogen"

export interface AuthorCreateDTO {
    name: string
    description: string
    icon: File
}

export interface AuthorUpdateDTO {
    name: string
    description: string
    icon: File
}

export interface AuthorResponseDTO {
    id: string
    name: string
    description: string
    imageURL: string
}

export interface AuthorsFilters {
    id?: string[]
    q?: string
    page?: number
    perPage?: number
    sortBy?: "id" | "name"
    sortByOrder?: SortByOrder
}

export interface IAuthorApi {
    getAuthors: (token?: string | null, filters?: AuthorsFilters) => () => Promise<AuthorResponseDTO[]>
    getAuthor: (id: string, token?: string | null) => () => Promise<AuthorResponseDTO>
    updateAuthor: (id: string, data: AuthorUpdateDTO, token?: string | null) => () => Promise<AuthorResponseDTO>
    deleteAuthor: (id: string, token?: string | null) => () => Promise<unknown>
    createAuthor: (data: AuthorCreateDTO, token?: string | null) => () => Promise<AuthorResponseDTO>
}