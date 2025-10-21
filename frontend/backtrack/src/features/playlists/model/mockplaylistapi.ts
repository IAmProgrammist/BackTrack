import type { IPlaylistApi, PlaylistCreateDTO, PlaylistUpdateDTO } from "./iplaylistapi";

export class MockPlaylistApi implements IPlaylistApi {
    getPlaylists() {
        return async () => Promise.resolve([{
            id: "1",
            name: "Плейлист 1",
            tracksAmount: Math.floor(Math.random() * 100),
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        },
        {
            id: "2",
            name: "Плейлист 2",
            tracksAmount: Math.floor(Math.random() * 100),
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        },
        {
            id: "3",
            name: "Плейлист 3",
            tracksAmount: Math.floor(Math.random() * 100),
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        }])
    }
    getPlaylist(id: string) {
        return async () => Promise.resolve({
            id,
            name: "Плейлист 1",
            description: "Класснющий плейлист эва!",
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg",
            tracks: [
                {id: "1", name: "Классная песня", tagSelector: "Selector vo 👍", groups: [{id: "1", name: "Группа 1"}], authors: [{id: "1", name: "Автор 1"}], duration: Math.floor(Math.random() * 180000)},
                {id: "2", name: "Классная песня", tagSelector: "Selector vo 1 👍", groups: [{id: "1", name: "Группа 1"}], authors: [{id: "1", name: "Автор 1"}], duration: Math.floor(Math.random() * 180000)},
                {id: "3", name: "Классная песня", tagSelector: "Selector vo 2 👍", groups: [{id: "1", name: "Группа 1"}], authors: [{id: "1", name: "Автор 1"}], duration: Math.floor(Math.random() * 180000)},
                {id: "4", name: "Классная песня", tagSelector: "Selector vo 3 👍", groups: [{id: "1", name: "Группа 1"}], authors: [{id: "1", name: "Автор 1"}], duration: Math.floor(Math.random() * 180000)},
                {id: "5", name: "Классная песня", tagSelector: "Selector vo 4 👍", groups: [{id: "1", name: "Группа 1"}], authors: [{id: "1", name: "Автор 1"}], duration: Math.floor(Math.random() * 180000)},
                {id: "6", name: "Классная песня", tagSelector: "Selector vo 5 👍", groups: [{id: "1", name: "Группа 1"}], authors: [{id: "1", name: "Автор 1"}], duration: Math.floor(Math.random() * 180000)},
                {id: "7", name: "Классная песня", tagSelector: "Selector vo 6 👍", groups: [{id: "1", name: "Группа 1"}], authors: [{id: "1", name: "Автор 1"}], duration: Math.floor(Math.random() * 180000)},
            ]
        })
    }
    updatePlaylist(id: string, _data: PlaylistUpdateDTO){
        return async () => Promise.resolve({
            id,
            name: "Плейлист 1",
            tracksAmount: Math.floor(Math.random() * 100),
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        })
    }
    deletePlaylist(_id: string) {
        return async () => Promise.resolve("Ok")
    }
    createPlaylist(_data: PlaylistCreateDTO) {
        return async () => Promise.resolve({
            id: "1",
            name: "Плейлист 1",
            tracksAmount: Math.floor(Math.random() * 100),
            imageURL: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg"
        })
    }
}