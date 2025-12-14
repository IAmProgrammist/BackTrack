import axios, { type RawAxiosRequestConfig } from "axios";
import { BASE_URL } from "shared/config/constants";
import { AuthApi, AuthorsApi, UsersApi, GroupsApi, SongsApi } from "./autogen";


export const axiosClient = axios.create({})

export const getAxiosConf = (token?: string | null): RawAxiosRequestConfig => {
    if (token) {
        return {headers: {
            Authorization: `bearer ${token}`
        }}
    }

    return {}
}

export const authApi = new AuthApi(undefined, BASE_URL, axiosClient);
export const usersApi = new UsersApi(undefined, BASE_URL, axiosClient);
export const authorsApi = new AuthorsApi(undefined, BASE_URL, axiosClient);
export const songsApi = new SongsApi(undefined, BASE_URL, axiosClient);
export const groupApi = new GroupsApi(undefined, BASE_URL, axiosClient);export const getImageUrlFromFileId = (fileId: string): string => {
    return `${BASE_URL}/api/v1/files/${fileId}/download`;
};
