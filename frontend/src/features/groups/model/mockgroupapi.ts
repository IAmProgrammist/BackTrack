import type { GroupCreateDTO, GroupUpdateDTO, IGroupApi } from "./igroupapi";

export class MockGroupApi implements IGroupApi {
    getGroups() {
        return async () => Promise.resolve([ {
            id: "1",
            name: "ABBA",
            description: "Swedish supergroup known for their catchy pop melodies and iconic harmonies.",
            participants: ["1", "2", "3", "4"],
            imageURL: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop"
        },
        {
            id: "2",
            name: "The Beatles",
            description: "Legendary British rock band that revolutionized popular music in the 1960s.",
            participants: ["5", "6", "7", "8"],
            imageURL: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop"
        },
        {
            id: "3",
            name: "Queen",
            description: "British rock band famous for their anthemic songs and Freddie Mercury's powerful vocals.",
            participants: ["9", "10", "11", "12"],
            imageURL: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
        },
        {
            id: "4",
            name: "The Rolling Stones",
            description: "English rock band formed in 1962, known for their gritty, blues-inspired sound.",
            participants: ["13", "14", "15", "16", "17"],
            imageURL: "https://images.unsplash.com/photo-1527904324834-3bda86da6771?w=400&h=400&fit=crop"
        },
        {
            id: "5",
            name: "Pink Floyd",
            description: "English rock band known for their progressive and psychedelic music.",
            participants: ["18", "19", "20", "21", "22"],
            imageURL: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop"
        },
        {
            id: "6",
            name: "Led Zeppelin",
            description: "British rock band known for their heavy, guitar-driven sound and dynamic performances.",
            participants: ["23", "24", "25", "26"],
            imageURL: "https://images.unsplash.com/photo-1571974599782-87624638275f?w=400&h=400&fit=crop"
        },
        {
            id: "7",
            name: "Fleetwood Mac",
            description: "British-American rock band known for their melodic pop-rock and interpersonal drama.",
            participants: ["27", "28", "29", "30", "31"],
            imageURL: "https://images.unsplash.com/photo-1526281216101-ea7f5d6b3c60?w=400&h=400&fit=crop"
        },
        {
            id: "8",
            name: "The Eagles",
            description: "American rock band known for their country-rock sound and vocal harmonies.",
            participants: ["32", "33", "34", "35", "36"],
            imageURL: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop"
        },
        {
            id: "9",
            name: "U2",
            description: "Irish rock band from Dublin, known for their anthemic sound and political activism.",
            participants: ["37", "38", "39", "40"],
            imageURL: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=400&fit=crop"
        },
        {
            id: "10",
            name: "Coldplay",
            description: "British rock band known for their melodic pop-rock anthems and atmospheric sound.",
            participants: ["41", "42", "43", "44"],
            imageURL: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
        }]) 
    }
    getGroup(id: string) {
        return async () => Promise.resolve({
                id,
                name: "ABBA",
                description: "Swedish supergroup known for their catchy pop melodies and iconic harmonies.",
                participants: [
                    {id: "1", name: "Agnetha Fältskog", imageURL: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face"},
                    {id: "2", name: "Björn Ulvaeus", imageURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"},
                    {id: "3", name: "Benny Andersson", imageURL: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"},
                    {id: "4", name: "Anni-Frid Lyngstad", imageURL: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face"}
                ],
                imageURL: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop"
            })
    }
    updateGroup(id: string, _data: GroupUpdateDTO) {
        return async () => Promise.resolve({
            id,
            name: "ABBA",
            description: "Swedish supergroup known for their catchy pop melodies and iconic harmonies.",
            participants: ["1", "2", "3", "4"],
            imageURL: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
        });
    }
    deleteGroup(_id: string) {
        return async () => Promise.resolve("Ok")
    }
    createGroup(_data: GroupCreateDTO) {
        return async () => Promise.resolve({
            id: "1",
            name: "ABBA",
            description: "Swedish supergroup known for their catchy pop melodies and iconic harmonies.",
            participants: ["1", "2", "3", "4"],
            imageURL: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
        });
    }
}