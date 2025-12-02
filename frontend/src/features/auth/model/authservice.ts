import { EventListener } from "shared/model/eventHandler"
import type { AuthServiceEvents, IAuthService, LoginRequest, RegisterRequest } from "./iauthservice"
import type { IAuthRepository } from "./iauthrepository"
import { object } from "yup";
import { EMAIL_VALIDATOR, PASSWORD_VALIDATOR, USERNAME_VALIDATOR } from "entities/auth/model/validator";
import { authApi, getAxiosConf } from "shared/api/api";

export class AuthService extends EventListener<AuthServiceEvents> implements IAuthService {
    repository: IAuthRepository
    
    constructor(repository: IAuthRepository) {
        super();
        this.repository = repository;
    }

    login(data: LoginRequest) {
        const schema = object().shape({
            email: EMAIL_VALIDATOR,
            password: PASSWORD_VALIDATOR
        })
        const that = this;

        return async () => {
            const validatedData = await schema.validate(data);
            const loginData = await authApi.authSigninApiV1AuthSigninPost({
                password: validatedData.password,
                email: validatedData.email
            });

            const token = loginData.data.data.token?.access_token || "";
            that.repository.setAuthToken(token);
            that.eventHandler("tokenupdated", {token});

            return {
                id: loginData.data.data.id || 0,
                username: loginData.data.data.username || "",
                email: loginData.data.data.email || "",
                createdAt: loginData.data.data.created_at || "",
                updatedAt: loginData.data.data.updated_at || "",
                deletedAt: loginData.data.data.deleted_at || "",
            }
        }
    }
    register(data: RegisterRequest) {
        const schema = object().shape({
            username: USERNAME_VALIDATOR,
            email: EMAIL_VALIDATOR,
            password: PASSWORD_VALIDATOR
        })
        const that = this;

        return async () => {
            const validatedData = await schema.validate(data);
            const registerData = await authApi.authSignupApiV1AuthSignupPost({
                password: validatedData.password,
                email: validatedData.email,
                username: validatedData.username
            });

            const token = registerData.data.data.token?.access_token || "";
            that.repository.setAuthToken(token);
            that.eventHandler("tokenupdated", {token});

            return {
                id: registerData.data.data.id || 0,
                username: registerData.data.data.username || "",
                email: registerData.data.data.email || "",
                createdAt: registerData.data.data.created_at || "",
                updatedAt: registerData.data.data.updated_at || "",
                deletedAt: registerData.data.data.deleted_at || "",
            }
        }
    }
    getUserinfo() {
        const that = this;
        return async () => authApi.authInfoApiV1AuthInfoGet(getAxiosConf(that.getToken())).then((data) => ({
            id: data.data.data.id || 0,
            username: data.data.data.username || "",
            email: data.data.data.email || "",
            createdAt: data.data.data.created_at || "",
            updatedAt: data.data.data.updated_at || "",
            deletedAt: data.data.data.deleted_at || "",
        }))
    }
    getToken() {
        return this.repository.getAuthToken();
    }
}