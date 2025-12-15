import { object, type AnyObject, type ObjectSchema } from "yup";
import type { GroupCreateDTO, GroupUpdateDTO, IGroupService } from "./igroupservice";
import { GROUP_DESCRIPTION_VALIDATION, GROUP_IMAGE_VALIDATION, GROUP_NAME_VALIDATION, GROUP_PARTICIPANTS_VALIDATION } from "entities/group/model/validators";
import type { GroupsFilters, IGroupApi } from "./igroupapi";
import type { IAuthService } from "features/auth/model/iauthservice";

export class GroupService implements IGroupService {
    groupApi: IGroupApi
    authService: IAuthService
    
    constructor(groupApi: IGroupApi, authService: IAuthService) {
        this.groupApi = groupApi;
        this.authService = authService;
    }
    
    getGroup(id: string) {
        return this.groupApi.getGroup(id, this.authService.getToken())
    }

    getGroups(filter?: GroupsFilters) {
        return this.groupApi.getGroups(this.authService.getToken(), filter)
    }

    createGroup(data: unknown) {
        const schema = this.createSchema();

        return async () => {
            let validated = await schema.validate(data) as GroupCreateDTO;
            return this.groupApi.createGroup({...validated, icon: validated.icon[0]}, this.authService.getToken())()
        }
    }

    updateGroup(id: string, data: unknown) {
        const schema = this.updateSchema();

        return async () => {
            let validated = await schema.validate(data) as GroupUpdateDTO;
            return this.groupApi.updateGroup(id, {...validated, icon: validated.icon[0]}, this.authService.getToken())()
        }
    }

    deleteGroup(id: string) {
        return this.groupApi.deleteGroup(id, this.authService.getToken())
    }

    createSchema(): ObjectSchema<AnyObject, GroupCreateDTO> {
        return object<GroupCreateDTO>().shape({
            name: GROUP_NAME_VALIDATION,
            description: GROUP_DESCRIPTION_VALIDATION,
            participants: GROUP_PARTICIPANTS_VALIDATION,
            icon: GROUP_IMAGE_VALIDATION
        })
    }

    updateSchema(): ObjectSchema<AnyObject, GroupUpdateDTO> {
        return object<GroupUpdateDTO>().shape({
            name: GROUP_NAME_VALIDATION,
            description: GROUP_DESCRIPTION_VALIDATION,
            participants: GROUP_PARTICIPANTS_VALIDATION,
            icon: GROUP_IMAGE_VALIDATION
        })
    }
}