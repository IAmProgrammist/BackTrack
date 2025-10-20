export type AuthorCreateDTO = FormData

export type AuthorUpdateDTO = FormData

export interface AuthorResponseDTO {
    id: string
    name: string
    description: string
    imageURL: string
}

export interface IAuthorApi {
    getAuthors: () => () => Promise<AuthorResponseDTO[]>
    getAuthor: (id: string) => () => Promise<AuthorResponseDTO>
    updateAuthor: (id: string, data: AuthorUpdateDTO) => () => Promise<AuthorResponseDTO>
    deleteAuthor: (id: string) => () => Promise<unknown>
    createAuthor: (data: AuthorCreateDTO) => () => Promise<AuthorResponseDTO>
}