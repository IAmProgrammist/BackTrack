import { authorsApi, getAxiosConf, getImageUrlFromFileId } from "shared/api/api";
import type { AuthorCreateDTO, AuthorsFilters, AuthorUpdateDTO, IAuthorApi } from "./iauthorapi";
import type { Data } from "shared/api/autogen";

export class AuthorApi implements IAuthorApi {
    getAuthors(token?: string | null, filters?: AuthorsFilters) {
        return async () => authorsApi.getAuthorsApiV1AuthorsGet(
            filters?.id || undefined, 
            filters?.q || undefined, 
            filters?.page || undefined, 
            filters?.perPage || undefined, 
            filters?.sortBy || undefined, 
            filters?.sortByOrder || undefined, 
            getAxiosConf(token)).then((authorsResponse) => {
            return (authorsResponse.data.data as unknown as Data[]).map((author) => ({
                id: author.id || "",
                name: author.name,
                description: author.description,
                imageURL: getImageUrlFromFileId(author.file_id)
            }))
        })
    }
    getAuthor(id: string, token?: string | null) {
        return async () => authorsApi.getAuthorApiV1AuthorsAuthorIdGet(id, getAxiosConf(token)).then((authorResponse) => {
            return {
                id: authorResponse.data.data.id || "",
                name: authorResponse.data.data.name,
                description: authorResponse.data.data.description,
                imageURL: getImageUrlFromFileId(authorResponse.data.data.file_id)
            }
        })
    }
    updateAuthor(id: string, data: AuthorUpdateDTO, token?: string | null) {
        return async () => authorsApi.updateAuthorApiV1AuthorsAuthorIdPut(id, data.name, data.description, data.icon, getAxiosConf(token)).then((authorResponse) => {
            return {
                id: authorResponse.data.data.id || "",
                name: authorResponse.data.data.name,
                description: authorResponse.data.data.description,
                imageURL: getImageUrlFromFileId(authorResponse.data.data.file_id)
            }
        })
    }
    deleteAuthor(id: string, token?: string | null) {
        return async () => authorsApi.deleteAuthorApiV1AuthorsAuthorIdDelete(id, getAxiosConf(token))
    }
    createAuthor(data: AuthorCreateDTO, token?: string | null) {
        return async () => authorsApi.createAuthorApiV1AuthorsPost(data.name, data.description, data.icon, getAxiosConf(token)).then((authorResponse) => {
            return {
                id: authorResponse.data.data.id || "",
                name: authorResponse.data.data.name,
                description: authorResponse.data.data.description,
                imageURL: getImageUrlFromFileId(authorResponse.data.data.file_id)
            }
        })
    }
}