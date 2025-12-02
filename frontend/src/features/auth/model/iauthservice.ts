import type { EventListener } from "shared/model/eventHandler"
import type { AnyObject, ObjectSchema } from "yup"

export interface LoginRequest {
    email: string
    password: string
    remember: boolean
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
    remember: boolean
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
    login: (data: unknown) => () => Promise<LoginResponse>
    register: (data: unknown) => () => Promise<RegisterResponse>
    getUserinfo: () => () => Promise<UserInfo>
    getToken: () => string | null
    loginSchema: () => ObjectSchema<AnyObject, LoginRequest>
    registerSchema: () => ObjectSchema<AnyObject, RegisterRequest>
}