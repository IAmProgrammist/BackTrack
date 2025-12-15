export interface PlaylistCreateDTO {
    name: string
    description: string
    songs: {id: string, tagSelector: string}[]
    icon: File
}

export interface PlaylistUpdateDTO {
    name: string
    description: string
    songs: {id: string, tagSelector: string}[]
    icon: File
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
    tracks: {id: string, name: string, tagSelector: string, groups: {id: string, name: string}[], authors: {id: string, name: string}[], duration?: number | null}[]
}

export interface IPlaylistApi {
    getPlaylists: (token?: string | null) => () => Promise<PlaylistResponseShortDTO[]>
    getPlaylist: (id: string, token?: string | null) => () => Promise<PlaylistResponseExpandedDTO>
    updatePlaylist: (id: string, data: PlaylistUpdateDTO, token?: string | null) => () => Promise<PlaylistResponseShortDTO>
    deletePlaylist: (id: string, token?: string | null) => () => Promise<unknown>
    createPlaylist: (data: PlaylistCreateDTO, token?: string | null) => () => Promise<PlaylistResponseShortDTO>
}