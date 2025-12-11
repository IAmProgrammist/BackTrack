import { object, type AnyObject, type ObjectSchema } from "yup";
import type { AuthorCreateDTO, AuthorUpdateDTO, IAuthorService } from "./iauthorservice";
import { AUTHOR_DESCRIPTION_VALIDATION, AUTHOR_IMAGE_VALIDATION, AUTHOR_NAME_VALIDATION } from "entities/author/model/validators";
import type { IAuthorApi } from "./iauthorapi";
import type { IAuthService } from "features/auth/model/iauthservice";

export class AuthorService implements IAuthorService {
    authorApi: IAuthorApi;
    authService: IAuthService
    
    constructor(authorApi: IAuthorApi, authService: IAuthService) {
        this.authorApi = authorApi;
        this.authService = authService;
    }

    getAuthor(id: string) {
        return this.authorApi.getAuthor(id, this.authService.getToken())
    }

    getAuthors() {
        return this.authorApi.getAuthors(this.authService.getToken())
    }

    createAuthor(data: unknown) {
        const schema = this.createSchema();

        return async () => {
            let validatedData = await schema.validate(data) as AuthorCreateDTO;
            return this.authorApi.createAuthor({...validatedData, icon: validatedData.icon[0]}, this.authService.getToken())()
       }
    }

    updateAuthor(id: string, data: unknown) {
        const schema = this.updateSchema();

        return async () => { 
            let validatedData = await schema.validate(data) as AuthorUpdateDTO;
            return this.authorApi.updateAuthor(id, {...validatedData, icon: validatedData.icon[0]}, this.authService.getToken())()
        }
    }

    deleteAuthor(id: string) {
        return this.authorApi.deleteAuthor(id, this.authService.getToken())
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