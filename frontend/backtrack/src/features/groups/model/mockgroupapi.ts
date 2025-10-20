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
        },
        {
            id: "3",
            name: "ABBA",
            description: "A greatest group ever!",
            participants: ["1", "2", "3"],
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        },
        {
            id: "4",
            name: "ABBA",
            description: "A greatest group ever!",
            participants: ["1", "2", "3"],
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        },
        {
            id: "5",
            name: "ABBA",
            description: "A greatest group ever!",
            participants: ["1", "2", "3"],
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        },
        {
            id: "6",
            name: "ABBA",
            description: "A greatest group ever!",
            participants: ["1", "2", "3"],
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        },
        {
            id: "7",
            name: "ABBA",
            description: "A greatest group ever!",
            participants: ["1", "2", "3"],
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        },
        {
            id: "8",
            name: "ABBA",
            description: "A greatest group ever!",
            participants: ["1", "2", "3"],
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        },
        {
            id: "9",
            name: "ABBA",
            description: "A greatest group ever!",
            participants: ["1", "2", "3"],
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        },
        {
            id: "10",
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
            participants: [
                {id: "1", name: "Агнета Фэльтског", imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"}, 
                {id: "1", name: "Бьорн Ульвеус", imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"}
            ],
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        })
    }
    updateGroup(id: string, _data: GroupUpdateDTO) {
        return async () => Promise.resolve({
            id,
            name: "ABBA",
            description: "DESCIP",
            participants: ["1", "2", "3"],
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        });
    }
    deleteGroup(_id: string) {
        return async () => Promise.resolve("Ok")
    }
    createGroup(_data: GroupCreateDTO) {
        return async () => Promise.resolve({
            id: "1",
            name: "ABBA",
            description: "DESCIP",
            participants: ["1", "2", "3"],
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        });
    }
}