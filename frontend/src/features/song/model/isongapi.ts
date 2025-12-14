export interface ISongCreateDTO {
    name: string
    tag: string | null
    description: string | null
    bpm: number | null
    songKey: string | null
    lyrics: string | null
    files: {file: File[], leading: boolean}[]
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
    files: {url: string, mime: string, leading: boolean, name: string}[]
    authors: {id: string, name: string, imageURL: string}[]
    groups: {id: string, name: string, imageURL: string}[]
    playlists: {id: string, name: string, imageURL: string}[]
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

export interface ISongApi {
    getSongs: (token?: string | null) => () => Promise<ISongResponseShortDTO[]>
    getSong: (id: string, version?: string, token?: string | null) => () => Promise<ISongResponseExtendedDTO>
    getSongVersions: (id: string, token?: string | null) => () => Promise<ISongResponseVersionDTO[]>
    createSong: (data: ISongCreateDTO, token?: string | null) => () => Promise<ISongResponseShortDTO>
    releaseSongVersion: (id: string, data: ISongCreateDTO, token?: string | null) => () => Promise<ISongResponseShortDTO>
    deleteSong: (id: string, token?: string | null) => () => Promise<unknown>
    getComments: (id: string, token?: string | null) => () => Promise<ISongResponseCommentDTO[]>
    createComment: (id: string, data: ISongCreateCommentDTO, token?: string | null) => () => Promise<ISongResponseCommentDTO>
}