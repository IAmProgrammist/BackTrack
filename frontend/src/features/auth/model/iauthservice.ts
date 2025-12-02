import type { EventListener } from "shared/model/eventHandler"

export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    id: number
    username: string
    email: string
    createdAt: string,
    updatedAt: string,
    deletedAt: string
}

export interface RegisterRequest {
    username: string
    email: string
    password: string
}

export interface RegisterResponse {
    id: number
    username: string
    email: string
    createdAt: string,
    updatedAt: string,
    deletedAt: string
}

export interface UserInfo {
    id: number
    username: string
    email: string
    createdAt: string
    updatedAt: string
    deletedAt: string
}

export type AuthServiceEvents = {
    "tokenupdated": {token: string}
}

export interface IAuthService extends EventListener<AuthServiceEvents> {
    login: (data: LoginRequest) => () => Promise<LoginResponse>
    register: (data: RegisterRequest) => () => Promise<RegisterResponse>
    getUserinfo: () => () => Promise<UserInfo>
    getToken: () => string | null
}