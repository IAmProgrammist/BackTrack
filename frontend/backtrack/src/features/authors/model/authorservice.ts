import { object, type AnyObject, type ObjectSchema } from "yup";
import type { AuthorCreateDTO, AuthorUpdateDTO, IAuthorService } from "./iauthorservice";
import { AUTHOR_DESCRIPTION_VALIDATION, AUTHOR_IMAGE_VALIDATION, AUTHOR_NAME_VALIDATION } from "entities/author/model/validators";
import type { IAuthorApi } from "./iauthorapi";
import { objectToFormData } from "shared/model/objectToFormData";

export class AuthorService implements IAuthorService {
    authorApi: IAuthorApi;
    
    constructor(authorApi: IAuthorApi) {
        this.authorApi = authorApi;
    }

    getAuthor(id: string) {
        return this.authorApi.getAuthor(id)
    }

    getAuthors() {
        return this.authorApi.getAuthors()
    }

    createAuthor(data: AuthorCreateDTO) {
        const schema = this.createSchema();

        return async () => {
            await schema.validate(data);
            return this.authorApi.createAuthor(objectToFormData({...data, icon: data.icon[0]}))()
       }
    }

    updateAuthor(data: AuthorUpdateDTO) {
        const schema = this.updateSchema();

        return async () => { 
            await schema.validate(data);
            return this.authorApi.updateAuthor(objectToFormData({...data, icon: data.icon[0]}))()
        }
    }

    deleteAuthor(id: string) {
        return this.authorApi.deleteAuthor(id)
    }

    createSchema(): ObjectSchema<AnyObject, AuthorCreateDTO> {
        return object<AuthorCreateDTO>().shape({
            name: AUTHOR_NAME_VALIDATION,
            description: AUTHOR_DESCRIPTION_VALIDATION,
            icon: AUTHOR_IMAGE_VALIDATION
        })
    }

    updateSchema(): ObjectSchema<AnyObject, AuthorUpdateDTO> {
        return object<AuthorUpdateDTO>().shape({
            name: AUTHOR_NAME_VALIDATION,
            description: AUTHOR_DESCRIPTION_VALIDATION,
            icon: AUTHOR_IMAGE_VALIDATION
        })
    }
}