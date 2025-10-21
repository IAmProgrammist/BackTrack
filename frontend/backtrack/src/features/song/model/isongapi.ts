export interface ISongResponseShortDTO {
    id: string
    version: string
    tag: string
    name: string
    authors: {id: string, name: string}[]
    groups: {id: string, name: string}[]
    duration: number
}

export interface ISongResponseExtendedDTO {
    id: string
    version: string
    name: string
    description: string
    tag: string
    bpm: number
    songKey: string
    duration: number
    lyrics: string
    files: {url: string, mime: string, leading: boolean, name: string}[]
    authors: {id: string, name: string}[]
    groups: {id: string, name: string}[]
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
    getSongs: () => () => Promise<ISongResponseShortDTO[]>
    getSong: (id: string, version?: string) => () => Promise<ISongResponseExtendedDTO>
    getSongVersions: (id: string) => () => Promise<ISongResponseVersionDTO[]>
    createSong: (data: FormData) => () => Promise<ISongResponseShortDTO>
    releaseSongVersion: (id: string, data: FormData) => () => Promise<ISongResponseVersionDTO>
    deleteSong: (id: string) => () => Promise<unknown>
    getComments: () => () => Promise<ISongResponseCommentDTO[]>
    createComment: (id: string, data: ISongCreateCommentDTO) => () => Promise<ISongResponseCommentDTO>
}