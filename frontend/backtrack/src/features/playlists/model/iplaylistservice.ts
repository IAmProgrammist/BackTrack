import { ObjectSchema, type AnyObject } from "yup"

export interface PlaylistCreateDTO {
    name: string
    description: string
    songs: {id: string, tagSelector: string}[]
    icon: File[]
}

export interface PlaylistUpdateDTO {
    id: string
    name: string
    description: string
    songs: {id: string, tagSelector: string}[]
    icon: File[]
}

export interface PlaylistResponseShortDTO {
    id: string
    name: string
    tracksAmount: number
    imageURL: string
}

export interface PlaylistResponseExpandedDTO {
    id: string
    name: string
    description: string
    imageURL: string
    tracks: {id: string, name: string, tagSelector: string, groups: {id: string, name: string}[], authors: {id: string, name: string}[], duration: number}[]
}

export interface IPlaylistService {
    getPlaylists: () => () => Promise<PlaylistResponseShortDTO[]>
    getPlaylist: (id: string) => () => Promise<PlaylistResponseExpandedDTO>
    updatePlaylist: (id: string, data: unknown) => () => Promise<PlaylistResponseShortDTO>
    deletePlaylist: (id: string) => () => Promise<unknown>
    createPlaylist: (data: unknown) => () => Promise<PlaylistResponseShortDTO>
    updateSchema: () => ObjectSchema<AnyObject, PlaylistUpdateDTO>
    createSchema: () => ObjectSchema<AnyObject, PlaylistCreateDTO>
}
