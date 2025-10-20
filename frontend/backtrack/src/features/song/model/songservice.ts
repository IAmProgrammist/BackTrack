import { objectToFormData } from "shared/model/objectToFormData";
import type { ISongApi } from "./isongapi";
import type { ISongCreateCommentDTO, ISongCreateDTO, ISongReleaseVersionDTO, ISongResponseCommentDTO, ISongService } from "./isongservice";
import { object } from "yup";
import { COMMENT_CONTENT_VALIDATOR, SONG_AUTHORS_VALIDATOR, SONG_BPM_VALIDATOR, SONG_DESCRIPTION_VALIDATOR, SONG_FILES_VALIDATOR, SONG_GROUPS_VALIDATOR, SONG_KEY_VALIDATOR, SONG_LYRICS_VALIDATOR, SONG_NAME_VALIDATOR, SONG_TAG_VALIDATOR } from "entities/song/model/validators";

export class SongService implements ISongService {
    songApi: ISongApi

    constructor(songApi: ISongApi) {
        this.songApi = songApi;
    }

    getSongs() {
        return this.songApi.getSongs();
    }

    getSong(id: string, version?: string) {
        return this.songApi.getSong(id, version);
    }

    getSongVersions(id: string) {
        return this.songApi.getSongVersions(id);
    }

    createSong(data: ISongCreateDTO) {
        const schema = this.createSchema();

        return async () => {
            await schema.validate(data);
            const {files, ...restData} = data;
            return this.songApi.createSong(objectToFormData({...restData, bpm: data.bpm.toString(), 'files.file': files.map((it) => it.file), 'files.leading': files.map((it) => `${it.leading}`)}))()
        }
    }
    
    releaseSongVersion(id: string, data: ISongReleaseVersionDTO) {
        const schema = this.releaseSchema();

        return async () => {
            await schema.validate(data);
            const {files, ...restData} = data;
            return this.songApi.releaseSongVersion(id, objectToFormData({...restData, bpm: data.bpm.toString(), 'files.file': files.map((it) => it.file), 'files.leading': files.map((it) => `${it.leading}`)}))()
        }
    }

    deleteSong(id: string) {
        return this.songApi.deleteSong(id);
    }
    
    createComment(id: string, data: ISongCreateCommentDTO) {
        const schema = this.createCommentSchema();

        return async () => {
            await schema.validate(data);
            return this.songApi.createComment(id, data)()
        }
    }
    
    getComments(_id: string) {
        return this.songApi.getComments();
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