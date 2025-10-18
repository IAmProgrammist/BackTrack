import type { TypedFormData } from "shared/model/typedFormData"

export type PlaylistCreateDTO = TypedFormData<{
    name: string
    description: string
    songs: string
    icon: File
}>

export type PlaylistUpdateDTO = TypedFormData<{
    id: string
    name: string
    description: string
    songs: string
    icon: File
}>

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
    tracks: {id: string, name: string, groups: {id: string, name: string}[], authors: {id: string, name: string}[], duration: number}[]
}

export interface IPlaylistApi {
    getPlaylists: () => () => Promise<PlaylistResponseShortDTO[]>
    getPlaylist: (id: string) => () => Promise<PlaylistResponseExpandedDTO>
    updatePlaylist: (data: PlaylistUpdateDTO) => () => Promise<PlaylistResponseShortDTO>
    deletePlaylist: (id: string) => () => Promise<unknown>
    createPlaylist: (data: PlaylistCreateDTO) => () => Promise<PlaylistResponseShortDTO>
}