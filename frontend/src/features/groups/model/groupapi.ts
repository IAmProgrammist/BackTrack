import { getAxiosConf, getImageUrlFromFileId, groupApi } from "shared/api/api";
import type { GroupCreateDTO, GroupUpdateDTO, IGroupApi } from "./igroupapi";

export class GroupApi implements IGroupApi {
    getGroups(token?: string | null) {
        return async () => groupApi.getGroupsApiV1GroupsGet(undefined, undefined, undefined, undefined, undefined, undefined, undefined, getAxiosConf(token)).then((groupResponse) => 
        groupResponse.data.data.map((group) => ({
            id: group.id || "",
            participants: group.authors,
            name: group.name,
            description: group.description,
            imageURL: getImageUrlFromFileId(group.file_id)
        })))
    }
    getGroup(id: string, token?: string | null) {
        return async () => groupApi.getGroupApiV1GroupsGroupIdGet(id, getAxiosConf(token)).then(({data: {data: group}}) => ({
            name: group.name,
            id: group.id || "",
            description: group.description,
            imageURL: getImageUrlFromFileId(group.file_id),
            participants: group.authors.map((author) => ({
                name: author.name,
                id: author.id,
                imageURL: getImageUrlFromFileId(author.file_id)
            }))
        }))
    }
    updateGroup(id: string, data: GroupUpdateDTO, token?: string | null) {
        return async () => groupApi.updateGroupApiV1GroupsGroupIdPut(id, data.name, data.description, data.participants, data.icon, getAxiosConf(token)).then(({data: {data: group}}) => ({
            name: group.name,
            id: group.id || "",
            description: group.description,
            imageURL: getImageUrlFromFileId(group.file_id),
            participants: group.authors
        }))
    }
    deleteGroup(id: string, token?: string | null) {
        return async () => groupApi.deleteGroupApiV1GroupsGroupIdDelete(id, getAxiosConf(token))
    }
    createGroup(data: GroupCreateDTO, token?: string | null) {
        return async () => groupApi.createGroupApiV1GroupsPost(data.name, data.description, data.participants, data.icon, getAxiosConf(token)).then(({data: {data: group}}) => ({
            name: group.name,
            id: group.id || "",
            description: group.description,
            imageURL: getImageUrlFromFileId(group.file_id),
            participants: group.authors
        }))
    }
}


