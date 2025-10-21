export type PlaylistCreateDTO = FormData

export type PlaylistUpdateDTO = FormData

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

export interface IPlaylistApi {
    getPlaylists: () => () => Promise<PlaylistResponseShortDTO[]>
    getPlaylist: (id: string) => () => Promise<PlaylistResponseExpandedDTO>
    updatePlaylist: (id: string, data: PlaylistUpdateDTO) => () => Promise<PlaylistResponseShortDTO>
    deletePlaylist: (id: string) => () => Promise<unknown>
    createPlaylist: (data: PlaylistCreateDTO) => () => Promise<PlaylistResponseShortDTO>
}