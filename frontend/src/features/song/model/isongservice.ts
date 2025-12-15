import type { AnyObject, ObjectSchema } from "yup"
import type { SongCommentsFilters, SongsFilters } from "./isongapi"

export interface ISongCreateDTO {
    name: string
    tag: string
    description: string
    bpm: number
    songKey: string
    lyrics: string
    files: {file: File[], leading: boolean}[]
    authors: string[]
    groups: string[]
}

export interface ISongReleaseVersionDTO {
    name: string
    tag: string
    description: string
    bpm: number
    songKey: string
    lyrics: string
    files: {file: File, leading: boolean}[]
    authors: string[]
    groups: string[]
}

export interface ISongResponseShortDTO {
    id: string
    version: string
    tag: string
    name: string
    authors: {id: string, name: string}[]
    groups: {id: string, name: string}[]
    duration: number | null
}

export interface ISongResponseExtendedDTO {
    id: string
    version: string
    name: string
    description: string
    tag: string
    bpm: number | null
    songKey: string | null
    duration: number | null
    lyrics: string
    authors: {id: string, name: string, imageURL: string}[]
    groups: {id: string, name: string, imageURL: string}[]
    playlists: {id: string, name: string, imageURL: string}[]
    files: {url: string, mime: string, leading: boolean, name: string}[]
}

export interface ISongResponseVersionDTO {
    id: string
    version: string
    createdAt: string
    changelog: string
    tag: string
}

export interface ISongResponseCommentDTO {
    id: string
    userName: string
    createdAt: string
    content: string
}

export interface ISongCreateCommentDTO {
    content: string
}

export interface ISongService {
    getSongs: (filter?: SongsFilters) => () => Promise<ISongResponseShortDTO[]>
    getSong: (id: string, version?: string) => () => Promise<ISongResponseExtendedDTO>
    getSongVersions: (id: string) => () => Promise<ISongResponseVersionDTO[]>
    createSong: (data: unknown) => () => Promise<ISongResponseShortDTO>
    releaseSongVersion: (id: string, data: unknown) => () => Promise<ISongResponseShortDTO>
    deleteSong: (id: string) => () => Promise<unknown>
    createComment: (id: string, data: unknown) => () => Promise<ISongResponseCommentDTO>
    getComments: (id: string, filter?: SongCommentsFilters) => () => Promise<ISongResponseCommentDTO[]>
    createSchema: () => ObjectSchema<AnyObject, ISongCreateDTO>
    releaseSchema: () => ObjectSchema<AnyObject, ISongReleaseVersionDTO>
    createCommentSchema: () => ObjectSchema<AnyObject, ISongCreateCommentDTO>
}