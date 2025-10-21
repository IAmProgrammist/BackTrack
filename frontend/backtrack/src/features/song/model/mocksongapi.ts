import type { ISongApi, ISongCreateCommentDTO } from "./isongapi";

export class MockSongApi implements ISongApi {
    getSongs() {
        return async () => Promise.resolve([{
            id: "1",
            version: "v1.2",
            tag: "Черновик",
            name: "Summer Breeze",
            authors: [{id: "1", name: "Bob Dylan"}],
            groups: [{id: "1", name: "ABBA"}],
            duration: 245000
        },
        {
            id: "2",
            version: "v2.0",
            tag: "Готово",
            name: "Midnight City",
            authors: [{id: "2", name: "Paul McCartney"}],
            groups: [{id: "2", name: "The Beatles"}],
            duration: 284000
        },
        {
            id: "3",
            version: "v1.5",
            tag: "На проверке",
            name: "Electric Dreams",
            authors: [{id: "3", name: "Carole King"}],
            groups: [{id: "3", name: "Queen"}],
            duration: 198000
        },
        {
            id: "4",
            version: "v3.1",
            tag: "Черновик",
            name: "Ocean Waves",
            authors: [{id: "4", name: "Leonard Cohen"}],
            groups: [{id: "4", name: "The Rolling Stones"}],
            duration: 312000
        },
        {
            id: "5",
            version: "v1.0",
            tag: "Готово",
            name: "Mountain High",
            authors: [{id: "5", name: "Joni Mitchell"}],
            groups: [{id: "5", name: "Pink Floyd"}],
            duration: 267000
        },
        {
            id: "6",
            version: "v2.3",
            tag: "На проверке",
            name: "Urban Jungle",
            authors: [{id: "6", name: "Bruce Springsteen"}],
            groups: [{id: "6", name: "Led Zeppelin"}],
            duration: 223000
        }])
    }
    getSong(id: string, version?: string) {
        return async () => Promise.resolve({
            id: id,
            version: version || "v2.0",
            tag: "Готово",
            name: "Midnight City",
            authors: [{id: "2", name: "Paul McCartney"}],
            groups: [{id: "2", name: "The Beatles"}],
            duration: 284000,
            description: "An atmospheric track with dreamy synth layers and driving rhythm section",
            bpm: 128,
            songKey: "C#m",
            lyrics: "Waiting in the car\nWaiting for a ride in the dark\nThe night city grows\nLook and see her eyes, they glow",
            files: [
                {url: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop", mime: "image/jpeg", leading: true, name: "cover.jpg"},
                {url: "https://example.com/audio/midnight-city.mp3", mime: "audio/mpeg", leading: true, name: "master.mp3"}
            ]
        })
    }
    getSongVersions(id: string) {
        return async () => Promise.resolve([{
            id,
            version: "v3.1",
            createdAt: "2024-01-15T10:30:00Z",
            changelog: "Final mix and mastering",
            tag: "Готово"
        },
        {
            id,
            version: "v3.0",
            createdAt: "2024-01-10T14:20:00Z",
            changelog: "Added final vocals and guitar solo",
            tag: "На проверке"
        },
        {
            id,
            version: "v2.5",
            createdAt: "2024-01-05T09:15:00Z",
            changelog: "Revised drum track and bass line",
            tag: "Черновик"
        },
        {
            id,
            version: "v2.0",
            createdAt: "2023-12-28T16:45:00Z",
            changelog: "Added synth layers and backing vocals",
            tag: "Черновик"
        },
        {
            id,
            version: "v1.0",
            createdAt: "2023-12-15T11:20:00Z",
            changelog: "Initial demo recording",
            tag: "Черновик"
        }])
    }
    createSong(_data: FormData) {
        return async () => Promise.resolve({
            id: "7",
            version: "v1.0",
            tag: "Черновик",
            name: "New Song",
            authors: [{id: "1", name: "Bob Dylan"}],
            groups: [{id: "1", name: "ABBA"}],
            duration: 210000
        })
    }
    releaseSongVersion(id: string, _data: FormData) {
        return async () => Promise.resolve({
            id,
            version: "v4.0",
            createdAt: new Date().toISOString(),
            changelog: "Final production ready version",
            tag: "Готово"
        })
    }
    deleteSong(_id: string) {
        return async () => Promise.resolve("Ok")
    }
    getComments() {
        return async () => Promise.resolve([
            {
                id: "1",
                userName: "MusicProducer42",
                createdAt: "2024-01-12T08:30:00Z",
                content: "The bridge section could use more dynamics, maybe add a crescendo?"
            },
            {
                id: "2",
                userName: "AudioEngineer",
                createdAt: "2024-01-11T14:22:00Z",
                content: "Great mix! The vocals sit perfectly in the track."
            },
            {
                id: "3",
                userName: "SongWriterPro",
                createdAt: "2024-01-10T09:15:00Z",
                content: "Love the chord progression in the chorus, very innovative!"
            },
            {
                id: "4",
                userName: "MusicLover99",
                createdAt: "2024-01-09T16:45:00Z",
                content: "The lyrics are really touching, great emotional depth."
            },
            {
                id: "5",
                userName: "BeatMaker",
                createdAt: "2024-01-08T11:20:00Z",
                content: "The drum pattern in verse 2 is fantastic, really drives the song forward."
            }
        ])
    }
    createComment(_id: string, _data: ISongCreateCommentDTO) {
        return async () => Promise.resolve({
            id: "6",
            userName: "NewListener",
            createdAt: new Date().toISOString(),
            content: "Just listened to this - absolutely amazing work!"
        })
    }
}