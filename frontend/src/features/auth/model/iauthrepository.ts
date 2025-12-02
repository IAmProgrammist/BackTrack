export interface IAuthRepository {
    getAuthToken: () => string | null
    setAuthToken: (token: string) => void
    cleanAuthToken: () => void
}