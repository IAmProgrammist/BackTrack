import type { IAuthRepository } from "./iauthrepository";

const TOKEN_STORAGE = "token_storage"

export class AuthRepository implements IAuthRepository {
    getAuthToken() {
        return localStorage.getItem(TOKEN_STORAGE);
    }
    setAuthToken(token: string) {
        localStorage.setItem(TOKEN_STORAGE, token);
    }
    cleanAuthToken() {
        localStorage.removeItem(TOKEN_STORAGE);
    }
}