import type { ISongApi, ISongCreateCommentDTO } from "./isongapi";

export class MockSongApi implements ISongApi {
    constructor() {

    }

    getSongs() {
        return async () => Promise.resolve([{
            id: "1",
            version: "dawdasd",
            tag: "Черновик",
            name: "Крутая песня",
            authors: [{id: "1", name: "Крутой автор"}],
            groups: [{id: "1", name: "Крутая группа"}],
            duration: 195000
        },
        {
            id: "2",
            version: "dawdasd",
            tag: "Черновик",
            name: "Крутая песня",
            authors: [{id: "1", name: "Крутой автор"}],
            groups: [{id: "1", name: "Крутая группа"}],
            duration: 195000
        },
        {
            id: "3",
            version: "dawdasd",
            tag: "Черновик",
            name: "Крутая песня",
            authors: [{id: "1", name: "Крутой автор"}],
            groups: [{id: "1", name: "Крутая группа"}],
            duration: 195000
        }])
    }
    getSong(id: string, version?: string) {
        return async () => Promise.resolve({
            id: id,
            version: version || "dasdasd",
            tag: "Черновик",
            name: "Крутая песня",
            authors: [{id: "1", name: "Крутой автор"}],
            groups: [{id: "1", name: "Крутая группа"}],
            duration: 195000,
            description: "Lorem ipsum",
            bpm: 130,
            songKey: "D",
            lyrics: "Пока в процессе...",
            files: [{url: "https://dknews.kz/storage/news/2021-10/E21Y6T0JhyxNxfh6UuEJ3xw4a2Wy6aDw4Omhid7z.jpg", mime: "image/jpeg", leading: true, name: "Обложка.png"}]
        })
    }
    getSongVersions(id: string) {
        return async () => Promise.resolve([{
            id,
            version: "dasdaaw",
            createdAt: new Date().toISOString(),
            changelog: "Правки",
            tag: "Черновик"
        },
        {
            id,
            version: "dasdaaw",
            createdAt: new Date().toISOString(),
            changelog: "Правки",
            tag: "Черновик"
        },
        {
            id,
            version: "dasdaaw",
            createdAt: new Date().toISOString(),
            changelog: "Правки",
            tag: "Черновик"
        },
        {
            id,
            version: "dasdaaw",
            createdAt: new Date().toISOString(),
            changelog: "Правки",
            tag: "Черновик"
        },
        {
            id,
            version: "dasdaaw",
            createdAt: new Date().toISOString(),
            changelog: "Правки",
            tag: "Черновик"
        },
        {
            id,
            version: "dasdaaw",
            createdAt: new Date().toISOString(),
            changelog: "Правки",
            tag: "Черновик"
        }])
    }
    createSong(_data: FormData) {
        return async () => Promise.resolve({
            id: "3",
            version: "dawdasd",
            tag: "Черновик",
            name: "Крутая песня",
            authors: [{id: "1", name: "Крутой автор"}],
            groups: [{id: "1", name: "Крутая группа"}],
            duration: 195000
        })
    }
    releaseSongVersion(id: string, _data: FormData) {
        return async () => Promise.resolve({
            id,
            version: "ver2",
            createdAt: new Date().toISOString(),
            changelog: "Changed a lot of data",
            tag: "Черновик"
        })
    }
    deleteSong(_id: string) {
        return async () => Promise.resolve("Ok")
    }
    getComments() {
        return async () => Promise.resolve([
            {
                id: "1",
                userName: "User A",
                createdAt: new Date().toISOString(),
                content: "A greate comment-e"
            },
            {
                id: "2",
                userName: "User A",
                createdAt: new Date().toISOString(),
                content: "A greate comment-e"
            },
            {
                id: "3",
                userName: "User A",
                createdAt: new Date().toISOString(),
                content: "A greate comment-e"
            },
            {
                id: "4",
                userName: "User A",
                createdAt: new Date().toISOString(),
                content: "A greate comment-e"
            },
            {
                id: "5",
                userName: "User A",
                createdAt: new Date().toISOString(),
                content: "A greate comment-e"
            }
        ])
    }
    createComment(_id: string, _data: ISongCreateCommentDTO) {
        return async () => Promise.resolve({
            id: "1",
            userName: "User A",
            createdAt: new Date().toISOString(),
            content: "A greate comment-e"
        })
    }
}