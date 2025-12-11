import { authorsApi, getAxiosConf } from "shared/api/api";
import type { AuthorCreateDTO, AuthorUpdateDTO, IAuthorApi } from "./iauthorapi";
import { BASE_URL } from "shared/config/constants";
import type { Data } from "shared/api/autogen";

export class AuthorApi implements IAuthorApi {
    getAuthors(token?: string | null) {
        return async () => authorsApi.getAuthorsApiV1AuthorsGet(undefined, undefined, undefined, undefined, undefined, undefined, getAxiosConf(token)).then((authorsResponse) => {
            return (authorsResponse.data.data as unknown as Data[]).map((author) => ({
                id: author.id || "",
                name: author.name,
                description: author.description,
                imageURL: `${BASE_URL}/api/v1/files/${author.file_id}/download`
            }))
        })
    }
    getAuthor(id: string, token?: string | null) {
        return async () => authorsApi.getAuthorApiV1AuthorsAuthorIdGet(id, getAxiosConf(token)).then((authorResponse) => {
            return {
                id: authorResponse.data.data.id || "",
                name: authorResponse.data.data.name,
                description: authorResponse.data.data.description,
                imageURL: `${BASE_URL}/api/v1/files/${authorResponse.data.data.file_id}/download`
            }
        })
    }
    updateAuthor(id: string, data: AuthorUpdateDTO, token?: string | null) {
        return async () => authorsApi.updateAuthorApiV1AuthorsAuthorIdPut(id, data.name, data.description, data.icon, getAxiosConf(token)).then((authorResponse) => {
            return {
                id: authorResponse.data.data.id || "",
                name: authorResponse.data.data.name,
                description: authorResponse.data.data.description,
                imageURL: `${BASE_URL}/api/v1/files/${authorResponse.data.data.file_id}/download`
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
                imageURL: `${BASE_URL}/api/v1/files/${authorResponse.data.data.file_id}/download`
            }
        })
    }
}