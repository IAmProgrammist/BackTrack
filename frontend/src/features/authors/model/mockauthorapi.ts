import type { AuthorCreateDTO, AuthorUpdateDTO, IAuthorApi } from "./iauthorapi";

export class MockAuthorApi implements IAuthorApi {
    getAuthors() {
        return async () => Promise.resolve([{
            id: "1",
            name: "Bob Dylan",
            description: "American singer-songwriter and Nobel Prize laureate, known for poetic lyrics that chronicle social issues.",
            imageURL: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
        },
        {
            id: "2",
            name: "Paul McCartney",
            description: "British singer-songwriter, member of The Beatles, one of the most successful composers in history.",
            imageURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
        },
        {
            id: "3",
            name: "Carole King",
            description: "American singer-songwriter who wrote numerous hits for various artists before her solo career.",
            imageURL: "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=400&h=400&fit=crop"
        },
        {
            id: "4",
            name: "Leonard Cohen",
            description: "Canadian singer-songwriter and poet known for his deep baritone voice and literary lyrics.",
            imageURL: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
        },
        {
            id: "5",
            name: "Joni Mitchell",
            description: "Canadian singer-songwriter known for her personal lyrics and innovative guitar tunings.",
            imageURL: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop"
        },
        {
            id: "6",
            name: "Bruce Springsteen",
            description: "American singer-songwriter known for his poetic lyrics about working class American life.",
            imageURL: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop"
        },
        {
            id: "7",
            name: "Taylor Swift",
            description: "American singer-songwriter known for her narrative songwriting about personal experiences.",
            imageURL: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop"
        },
        {
            id: "8",
            name: "Stevie Wonder",
            description: "American singer-songwriter and multi-instrumentalist, a pioneer in R&B and soul music.",
            imageURL: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=400&h=400&fit=crop"
        }]) 
    }
    getAuthor(id: string) {
        return async () => Promise.resolve({
            id,
            name: "Bob Dylan",
            description: "American singer-songwriter and Nobel Prize laureate, known for poetic lyrics that chronicle social issues.",
            imageURL: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
        })
    }
    updateAuthor(id: string, _data: AuthorUpdateDTO) {
        return async () => Promise.resolve({
            id,
            name: "Bob Dylan",
            description: "American singer-songwriter and Nobel Prize laureate, known for poetic lyrics that chronicle social issues.",
            imageURL: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
        });
    }
    deleteAuthor(_id: string) {
        return async () => Promise.resolve("Ok")
    }
    createAuthor(_data: AuthorCreateDTO) {
        return async () => Promise.resolve({
            id: "1",
            name: "Bob Dylan",
            description: "American singer-songwriter and Nobel Prize laureate, known for poetic lyrics that chronicle social issues.",
            imageURL: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
        });
    }
}