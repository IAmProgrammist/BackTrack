import { objectToFormData } from "shared/model/objectToFormData";
import type { ISongApi } from "./isongapi";
import type { ISongCreateCommentDTO, ISongCreateDTO, ISongReleaseVersionDTO, ISongService } from "./isongservice";
import { object } from "yup";
import { SONG_AUTHORS_VALIDATOR, SONG_BPM_VALIDATOR, SONG_DESCRIPTION_VALIDATOR, SONG_FILES_VALIDATOR, SONG_GROUPS_VALIDATOR, SONG_KEY_VALIDATOR, SONG_LYRICS_VALIDATOR, SONG_NAME_VALIDATOR, SONG_TAG_VALIDATOR } from "entities/song/model/validators";
import { COMMENT_CONTENT_VALIDATOR } from "entities/comment/model/validators";

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

    createSong(data: unknown) {
        const schema = this.createSchema();

        return async () => {
            let validated = await schema.validate(data);
            const {files, bpm, authors, groups, ...restData} = validated;
            return this.songApi.createSong(objectToFormData({...restData, 
                ...(bpm ? {bpm: bpm.toString()} : {}),
                'files.file': files?.map((it) => it?.file?.[0] || new File([], "Failed")) || [], 
                'files.leading': files?.map((it) => `${it.leading || false}`) || []}))()
        }
    }
    
    releaseSongVersion(id: string, data: unknown) {
        const schema = this.releaseSchema();

        return async () => {
            let validated = await schema.validate(data);
            const {files, bpm, authors, groups, ...restData} = validated;
            return this.songApi.releaseSongVersion(id, objectToFormData({...restData, 
                ...(bpm ? {bpm: bpm.toString()} : {}),
                'files.file': files?.map((it) => it?.file?.[0] || new File([], "Failed")) || [], 
                'files.leading': files?.map((it) => `${it.leading || false}`) || []}))()
        }
    }

    deleteSong(id: string) {
        return this.songApi.deleteSong(id);
    }
    
    createComment(id: string, data: unknown) {
        const schema = this.createCommentSchema();

        return async () => {
            let validated = await schema.validate(data);
            return this.songApi.createComment(id, validated)()
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