import { getAxiosConf, getImageUrlFromFileId, songsApi } from "shared/api/api";
import type { ISongApi, ISongCreateCommentDTO, ISongCreateDTO, SongCommentsFilters, SongsFilters } from "./isongapi";

export class SongApi implements ISongApi {
    getSongs(token?: string | null, filters?: SongsFilters) {
        return async () => songsApi.getSongsApiV1SongsGet(filters?.id, filters?.tag, filters?.bpm, filters?.songKey, filters?.authorsIds, filters?.groupsIds, filters?.q, filters?.page, filters?.perPage, filters?.sortBy, filters?.sortByOrder, getAxiosConf(token)).then(({data: {data}}) => 
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
            playlists: data.playlists.map((playlist) => ({id: playlist.id, name: playlist.name, imageURL: getImageUrlFromFileId(playlist.file_id)})),
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
    getComments(id: string, token?: string | null, filter?: SongCommentsFilters) {
        return async () => songsApi.getSongCommentsApiV1SongsSongIdCommentsGet(id, undefined, filter?.q, "created_at", "asc", filter?.page, filter?.perPage, getAxiosConf(token)).then(({data: {data}}) => data.map((comment) => ({
            id: comment.id,
            userName: comment.created_by,
            createdAt: comment.created_at,
            content: comment.content,
        })))
    }
    createComment(id: string, data: ISongCreateCommentDTO, token?: string | null) {
        return async () => songsApi.createSongCommentApiV1SongsSongIdCommentsPost(id, {content: data.content}, getAxiosConf(token)).then(({data: {data}}) => ({
            id: data.id,
            userName: data.created_by,
            createdAt: data.created_at,
            content: data.content,
        }))
    }
}