export interface IAuthRepository {
    getAuthToken: () => string | null
    setAuthToken: (token: string) => void
    getAuthTokenTemporary: () => string | null
    setAuthTokenTemporary: (token: string) => void
    cleanAuthToken: () => void
    cleanAuthTokenTemporary: () => void
}