import { object, type AnyObject, type ObjectSchema } from "yup";
import type { PlaylistCreateDTO, PlaylistUpdateDTO, IPlaylistService } from "./iplaylistservice";
import type { IPlaylistApi } from "./iplaylistapi";
import { objectToFormData } from "shared/model/objectToFormData";
import { PLAYLIST_DESCRIPTION_VALIDATION, PLAYLIST_ICON_VALIDATION, PLAYLIST_NAME_VALIDATION, PLAYLIST_SONGS_VALIDATION } from "entities/playlist/model/validators";
import type { IAuthService } from "features/auth/model/iauthservice";

export class PlaylistService implements IPlaylistService {
    playlistApi: IPlaylistApi
    authService: IAuthService
    
    constructor(playlistApi: IPlaylistApi, authService: IAuthService) {
        this.playlistApi = playlistApi;
        this.authService = authService;
    }

    getPlaylist(id: string) {
        return this.playlistApi.getPlaylist(id, this.authService.getToken())
    }

    getPlaylists() {
        return this.playlistApi.getPlaylists(this.authService.getToken())
    }

    createPlaylist(data: unknown) {
        const schema = this.createSchema();
        
        return async () => {
            let validated = await schema.validate(data) as PlaylistCreateDTO;
            return this.playlistApi.createPlaylist({...validated, icon: validated.icon[0]}, this.authService.getToken())()
        }
    }

    updatePlaylist(id: string, data: unknown) {
        const schema = this.createSchema();
        
        return async () => {
            let validated = await schema.validate(data) as PlaylistUpdateDTO;
            return this.playlistApi.updatePlaylist(id, {...validated, icon: validated.icon[0]}, this.authService.getToken())()
        }
    }

    deletePlaylist(id: string) {
        return this.playlistApi.deletePlaylist(id, this.authService.getToken());
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