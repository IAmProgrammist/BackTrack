import type { GroupCreateDTO, GroupUpdateDTO, IGroupApi } from "./igroupapi";

export class MockGroupApi implements IGroupApi {
    getGroups() {
        return async () => Promise.resolve([{
            id: "1",
            name: "ABBA",
            description: "A greatest group ever!",
            participants: ["1", "2", "3"],
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        },
        {
            id: "2",
            name: "ABBA",
            description: "A greatest group ever!",
            participants: ["1", "2", "3"],
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        }]) 
    }
    getGroup(id: string) {
        return async () => Promise.resolve({
            id,
            name: "ABBA",
            description: "A greatest group ever!",
            participants: [{id: "1", name: "Агнета Фэльтског"}, {id: "1", name: "Бьорн Ульвеус"}],
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        })
    }
    updateGroup(data: GroupUpdateDTO) {
        return async () => Promise.resolve({
            id: "1",
            name: "ABBA",
            description: "DESCIP",
            participants: ["1", "2", "3"],
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        });
    }
    deleteGroup(id: string) {
        return async () => Promise.resolve("Ok")
    }
    createGroup(data: GroupCreateDTO) {
        return async () => Promise.resolve({
            id: "1",
            name: "ABBA",
            description: "DESCIP",
            participants: ["1", "2", "3"],
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        });
    }
}