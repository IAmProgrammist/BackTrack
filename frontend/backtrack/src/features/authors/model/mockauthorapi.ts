import type { AuthorCreateDTO, AuthorUpdateDTO, IAuthorApi } from "./iauthorapi";

export class MockAuthorApi implements IAuthorApi {
    getAuthors() {
        return async () => Promise.resolve([{
            id: "1",
            name: "ABBA",
            description: "A greatest group ever!",
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        },
        {
            id: "1",
            name: "ABBA",
            description: "A greatest group ever!",
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        }]) 
    }
    getAuthor(id: string) {
        return async () => Promise.resolve({
            id,
            name: "ABBA",
            description: "A greatest group ever!",
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        })
    }
    updateAuthor(_data: AuthorUpdateDTO) {
        return async () => Promise.resolve({
            id: "1",
            name: "ABBA",
            description: "A greatest group ever!",
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        });
    }
    deleteAuthor(_id: string) {
        return async () => Promise.resolve("Ok")
    }
    createAuthor(_data: AuthorCreateDTO) {
        return async () => Promise.resolve({
            id: "1",
            name: "ABBA",
            description: "A greatest group ever!",
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        });
    }
}