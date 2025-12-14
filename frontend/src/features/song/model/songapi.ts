import { getAxiosConf, getImageUrlFromFileId, songsApi } from "shared/api/api";
import type { ISongApi, ISongCreateCommentDTO, ISongCreateDTO } from "./isongapi";

export class SongApi implements ISongApi {
    getSongs(token?: string | null) {
        return async () => songsApi.getSongsApiV1SongsGet(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, getAxiosConf(token)).then(({data: {data}}) => 
            data.map((song) => ({
                id: song.song_id,
                version: song.id,
                tag: song.tag,
                name: song.name,
                authors: song.authors.map((author) => ({id: author.id, name: author.name})),
                groups: song.groups.map((group) => ({id: group.id, name: group.name})),
                duration: song.duration
            })
        ))
    }
    getSong(id: string, version?: string, token?: string | null) {
        return async () => songsApi.getSongApiV1SongsSongIdGet(id, version, getAxiosConf(token)).then(({data: {data}}) => ({
            id: data.song_id,
            version: data.id,
            tag: data.tag,
            name: data.name,
            authors: data.authors.map((author) => ({id: author.id, name: author.name, imageURL: getImageUrlFromFileId(author.file_id)})),
            groups: data.groups.map((group) => ({id: group.id, name: group.name, imageURL: getImageUrlFromFileId(group.file_id)})),
            // TODO: playlists are not present yet! Need to fix this.
            playlists: [],
            duration: data.duration,
            description: data.description,
            bpm: data.bpm,
            songKey: data.key,
            lyrics: data.lyrics,
            files: data.files.map((file) => ({
                url: getImageUrlFromFileId(file.id), mime: file.mime, leading: file.leading, name: file.name
            }))
        }))
    }
    getSongVersions(id: string, token?: string | null) {
        return async () => songsApi.getSongReleasesApiV1SongsSongIdReleasesGet(id, undefined, undefined, undefined, undefined, undefined, getAxiosConf(token)).then(({data: {data}}) => 
            data.map((song) => ({
                id,
                version: song.id,
                createdAt: song.created_at,
                changelog: song.description,
                tag: song.tag
            }))
        )
    }
    createSong(data: ISongCreateDTO, token?: string | null) {
        return async () => songsApi.createSongApiV1SongsPost(data.name, data.tag, data.description || "", data.bpm, data.songKey, data.lyrics, data.files.map((complexFile) => complexFile.file[0]), data.files.map((complexFile) => complexFile.leading), data.authors, data.groups, undefined, getAxiosConf(token)).then(({data: {data}}) => ({
            id: data.song_id,
            version: data.id,
            tag: data.tag,
            name: data.name,
            authors: data.authors.map((author) => ({id: author.id, name: author.name})),
            groups: data.groups.map((group) => ({id: group.id, name: group.name})),
            duration: data.duration
        }))
    }
    releaseSongVersion(id: string, data: ISongCreateDTO, token?: string | null) {
        return async () => songsApi.createSongApiV1SongsPost(data.name, data.tag, data.description || "", data.bpm, data.songKey, data.lyrics, data.files.map((complexFile) => complexFile.file[0]), data.files.map((complexFile) => complexFile.leading), data.authors, data.groups, id, getAxiosConf(token)).then(({data: {data}}) => ({
            id: data.song_id,
            version: data.id,
            tag: data.tag,
            name: data.name,
            authors: data.authors.map((author) => ({id: author.id, name: author.name})),
            groups: data.groups.map((group) => ({id: group.id, name: group.name})),
            duration: data.duration
        }))
    }
    deleteSong(id: string, token?: string | null) {
        return async () => songsApi.deleteSongApiV1SongsSongIdDelete(id, getAxiosConf(token))
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