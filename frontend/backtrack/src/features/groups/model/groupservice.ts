import { object, type AnyObject, type ObjectSchema } from "yup";
import type { GroupCreateDTO, GroupUpdateDTO, IGroupService } from "./igroupservice";
import { GROUP_DESCRIPTION_VALIDATION, GROUP_IMAGE_VALIDATION, GROUP_NAME_VALIDATION, GROUP_PARTICIPANTS_VALIDATION } from "entities/group/model/validators";
import type { IGroupApi } from "./igroupapi";
import { objectToFormData } from "shared/model/objectToFormData";

export class GroupService implements IGroupService {
    groupApi: IGroupApi
    
    constructor(groupApi: IGroupApi) {
        this.groupApi = groupApi;
    }
    
    getGroup(id: string) {
        return this.groupApi.getGroup(id)
    }

    getGroups() {
        return this.groupApi.getGroups()
    }

    createGroup(data: unknown) {
        const schema = this.createSchema();

        return async () => {
            let validated = await schema.validate(data);
            return this.groupApi.createGroup(objectToFormData({...validated, icon: validated.icon[0]}))()
        }
    }

    updateGroup(id: string, data: unknown) {
        const schema = this.updateSchema();

        return async () => {
            let validated = await schema.validate(data);
            return this.groupApi.updateGroup(id, objectToFormData({...validated, icon: validated.icon[0]}))()
        }
    }

    deleteGroup(id: string) {
        return this.groupApi.deleteGroup(id)
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