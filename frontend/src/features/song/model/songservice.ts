import type { ISongApi } from "./isongapi";
import type { ISongCreateCommentDTO, ISongCreateDTO, ISongReleaseVersionDTO, ISongService } from "./isongservice";
import { object } from "yup";
import { SONG_AUTHORS_VALIDATOR, SONG_BPM_VALIDATOR, SONG_DESCRIPTION_VALIDATOR, SONG_FILES_VALIDATOR, SONG_GROUPS_VALIDATOR, SONG_KEY_VALIDATOR, SONG_LYRICS_VALIDATOR, SONG_NAME_VALIDATOR, SONG_TAG_VALIDATOR } from "entities/song/model/validators";
import { COMMENT_CONTENT_VALIDATOR } from "entities/comment/model/validators";
import type { IAuthService } from "features/auth/model/iauthservice";

export class SongService implements ISongService {
    songApi: ISongApi
    authService: IAuthService

    constructor(songApi: ISongApi, authService: IAuthService) {
        this.songApi = songApi;
        this.authService = authService;
    }

    getSongs() {
        return this.songApi.getSongs(this.authService.getToken());
    }

    getSong(id: string, version?: string) {
        return this.songApi.getSong(id, version, this.authService.getToken());
    }

    getSongVersions(id: string) {
        return this.songApi.getSongVersions(id, this.authService.getToken());
    }

    createSong(data: unknown) {
        const schema = this.createSchema();

        return async () => {
            let validated = await schema.validate(data);
            const {files, bpm, authors, groups, ...restData} = validated;
            return this.songApi.createSong({
                name: restData.name,
                tag: restData.tag || null,
                description: restData.description || null,
                bpm: bpm || null,
                songKey: restData.songKey || null,
                lyrics: restData.lyrics || null,
                authors: authors as string[],
                groups: groups as string[],
                files: files as {file: File[], leading: boolean}[]
            }, this.authService.getToken())()
        }
    }
    
    releaseSongVersion(id: string, data: unknown) {
        const schema = this.releaseSchema();

        return async () => {
            let validated = await schema.validate(data);
            const {files, bpm, authors, groups, ...restData} = validated;
            return this.songApi.releaseSongVersion(id, {
                name: restData.name,
                tag: restData.tag || null,
                description: restData.description || null,
                bpm: bpm || null,
                songKey: restData.songKey || null,
                lyrics: restData.lyrics || null,
                authors: authors as string[],
                groups: groups as string[],
                files: files as {file: File[], leading: boolean}[]
            }, this.authService.getToken())()
        }
    }

    deleteSong(id: string) {
        return this.songApi.deleteSong(id, this.authService.getToken());
    }
    
    createComment(id: string, data: unknown) {
        const schema = this.createCommentSchema();

        return async () => {
            let validated = await schema.validate(data);
            return this.songApi.createComment(id, validated, this.authService.getToken())()
        }
    }
    
    getComments(id: string) {
        return this.songApi.getComments(id, this.authService.getToken());
    }
    
    createCommentSchema() {
        return object<ISongCreateCommentDTO>().shape({
            content: COMMENT_CONTENT_VALIDATOR
        })
    }

    createSchema() {
        return object<ISongCreateDTO>().shape({
            name: SONG_NAME_VALIDATOR,
            tag: SONG_TAG_VALIDATOR,
            description: SONG_DESCRIPTION_VALIDATOR,
            bpm: SONG_BPM_VALIDATOR,
            songKey: SONG_KEY_VALIDATOR,
            lyrics: SONG_LYRICS_VALIDATOR,
            files: SONG_FILES_VALIDATOR,
            authors: SONG_AUTHORS_VALIDATOR,
            groups: SONG_GROUPS_VALIDATOR
        })
    }

    releaseSchema() {
        return object<ISongReleaseVersionDTO>().shape({
            name: SONG_NAME_VALIDATOR,
            tag: SONG_TAG_VALIDATOR,
            description: SONG_DESCRIPTION_VALIDATOR,
            bpm: SONG_BPM_VALIDATOR,
            songKey: SONG_KEY_VALIDATOR,
            lyrics: SONG_LYRICS_VALIDATOR,
            files: SONG_FILES_VALIDATOR,
            authors: SONG_AUTHORS_VALIDATOR,
            groups: SONG_GROUPS_VALIDATOR
        })
    }
}