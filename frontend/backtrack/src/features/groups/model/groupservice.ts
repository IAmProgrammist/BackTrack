import type { ObjectSchema } from "yup";
import type { GroupCreateSchema, GroupUpdateSchema, IGroupService } from "./igroupservice";

export class GroupService implements IGroupService {
    constructor() {

    }

    getGroup(id: string) {
        return Promise.resolve({
            id,
            name: "ABBA",
            description: "A greatest group ever!",
            participants: [{id: "1", name: "Агнета Фэльтског"}, {id: "1", name: "Бьорн Ульвеус"}],
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        })
    }

    getGroups() {
        return Promise.resolve([{
            id: "1",
            name: "ABBA",
            description: "A greatest group ever!",
            participants: ["1", "2", "3"],
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        },
        {
            id: "1",
            name: "ABBA",
            description: "A greatest group ever!",
            participants: ["1", "2", "3"],
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        }]) 
    }

    createGroup(data: GroupCreateSchema) {
        const schema = this.createSchema();
        schema.validate(data).;
    }

    updateGroup(data: GroupUpdateSchema) {

    }

    deleteGroup(id: string) {

    }

    createSchema(): ObjectSchema<GroupCreateSchema> {
        
    }

    updateSchema(): ObjectSchema<GroupUpdateSchema> {

    }
}