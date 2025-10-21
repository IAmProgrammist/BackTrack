import { object, type AnyObject, type ObjectSchema } from "yup";
import type { PlaylistCreateDTO, PlaylistUpdateDTO, IPlaylistService } from "./iplaylistservice";
import type { IPlaylistApi } from "./iplaylistapi";
import { objectToFormData } from "shared/model/objectToFormData";
import { PLAYLIST_DESCRIPTION_VALIDATION, PLAYLIST_ICON_VALIDATION, PLAYLIST_NAME_VALIDATION, PLAYLIST_SONGS_VALIDATION } from "entities/playlist/model/validators";

export class PlaylistService implements IPlaylistService {
    playlistApi: IPlaylistApi
    
    constructor(playlistApi: IPlaylistApi) {
        this.playlistApi = playlistApi;
    }

    getPlaylist(id: string) {
        return this.playlistApi.getPlaylist(id)
    }

    getPlaylists() {
        return this.playlistApi.getPlaylists()
    }

    createPlaylist(data: unknown) {
        const schema = this.createSchema();
        
        return async () => {
            let validated = await schema.validate(data);
            return this.playlistApi.createPlaylist(objectToFormData({...validated, icon: validated.icon[0], songs: JSON.stringify(validated.songs)}))()
        }
    }

    updatePlaylist(id: string, data: unknown) {
        const schema = this.createSchema();
        
        return async () => {
            let validated = await schema.validate(data);
            return this.playlistApi.updatePlaylist(id, objectToFormData({...validated, icon: validated.icon[0], songs: JSON.stringify(validated.songs)}))()
        }
    }

    deletePlaylist(id: string) {
        return this.playlistApi.deletePlaylist(id);
    }

    createSchema(): ObjectSchema<AnyObject, PlaylistCreateDTO> {
        return object<PlaylistCreateDTO>().shape({
            name: PLAYLIST_NAME_VALIDATION,
            description: PLAYLIST_DESCRIPTION_VALIDATION,
            icon: PLAYLIST_ICON_VALIDATION,
            songs: PLAYLIST_SONGS_VALIDATION
        })
    }

    updateSchema(): ObjectSchema<AnyObject, PlaylistUpdateDTO> {
        return object<PlaylistUpdateDTO>().shape({
            name: PLAYLIST_NAME_VALIDATION,
            description: PLAYLIST_DESCRIPTION_VALIDATION,
            icon: PLAYLIST_ICON_VALIDATION,
            songs: PLAYLIST_SONGS_VALIDATION
        })
    }
}