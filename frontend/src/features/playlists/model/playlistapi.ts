import { getAxiosConf, getImageUrlFromFileId, playlistApi } from "shared/api/api";
import type { IPlaylistApi, PlaylistCreateDTO, PlaylistUpdateDTO } from "./iplaylistapi";

export class PlaylistApi implements IPlaylistApi {
    getPlaylists(token?: string | null) {
        return async () => playlistApi.getPlaylistsApiV1PlaylistsGet(undefined, undefined, undefined, undefined, undefined, undefined, getAxiosConf(token)).then(({data: {data}}) => data.map((playlist) => ({
            id: playlist.id,
            name: playlist.name,
            tracksAmount: playlist.tracks_amount,
            imageURL: getImageUrlFromFileId(playlist.file_id)
        })) )
    }
    getPlaylist(id: string, token?: string | null) {
        return async () => playlistApi.getPlaylistApiV1PlaylistsPlaylistIdGet(id, getAxiosConf(token)).then(({data: {data}}) => ({
            id: data.id,
            name: data.name,
            description: data.description,
            imageURL: getImageUrlFromFileId(data.file_id),
            tracks: data.tracks.map((track) => ({
                id: track.id, 
                name: track.name, 
                tagSelector: track.filter, 
                duration: track.duration,
                groups: track.groups.map((group) => ({id: group.id, name: group.name})),
                authors: track.authors.map((author) => ({id: author.id, name: author.name})),
            }))
        }))
    }
    updatePlaylist(id: string, data: PlaylistUpdateDTO, token?: string | null){
        return async () => playlistApi.updatePlaylistApiV1PlaylistsPlaylistIdPut(id, data.name, data.description, data.songs.map((song) => song.id), data.songs.map((song) => song.tagSelector), data.icon, getAxiosConf(token)).then(({data: {data}}) => ({
            id: data.id,
            name: data.name,
            tracksAmount: data.tracks_amount,
            imageURL: getImageUrlFromFileId(data.file_id)
        }))
    }
    deletePlaylist(id: string, token?: string | null) {
        return async () => playlistApi.deletePlaylistApiV1PlaylistsPlaylistIdDelete(id, getAxiosConf(token))
    }
    createPlaylist(data: PlaylistCreateDTO, token?: string | null) {
        return async () => playlistApi.createPlaylistApiV1PlaylistsPost(data.name, data.description, data.songs.map((song) => song.id), data.songs.map((song) => song.tagSelector), data.icon, getAxiosConf(token)).then(({data: {data}}) => ({
            id: data.id,
            name: data.name,
            tracksAmount: data.tracks_amount,
            imageURL: getImageUrlFromFileId(data.file_id)
        }))
    }
}