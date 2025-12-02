import { useMutation, useQuery } from "@tanstack/react-query"
import { useAuthService } from "./useAuthService"
import type { LoginRequest, RegisterRequest } from "../model/iauthservice";

export const keys = {
  auth: ['auth'],
}

export const useLogin = () => {
    const authService = useAuthService();
    
    return useMutation({
        mutationFn: (newData: LoginRequest) => {
            return authService.login(newData)()
        },
        mutationKey: keys.auth
    })
}

export const useRegister = () => {
    const authService = useAuthService();
    
    return useMutation({
        mutationFn: (newData: RegisterRequest) => {
            return authService.register(newData)()
        },
        mutationKey: keys.auth
    })
}

export const useGetUserinfo = () => {
    const authService = useAuthService();
    
    return useQuery({
        queryFn: authService.getUserinfo(),
        queryKey: keys.auth
    })
}