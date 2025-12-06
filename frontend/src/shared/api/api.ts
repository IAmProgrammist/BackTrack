import axios, { type RawAxiosRequestConfig } from "axios";
import { BASE_URL } from "shared/config/constants";
import { AuthApi, UsersApi } from "./autogen";


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