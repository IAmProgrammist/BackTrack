import { useQuery } from "@tanstack/react-query"
import { useAuthService } from "./useAuthService"

export const keys = {
  auth: ['auth'],
}

export const useLogin = () => {
    const authService = useAuthService();
    
    return {
        mutationFn: (newData: unknown) => {
            return authService.login(newData)()
        },
        mutationKey: keys.auth
    }
}

export const useRegister = () => {
    const authService = useAuthService();
    
    return {
        mutationFn: (newData: unknown) => {
            return authService.register(newData)()
        },
        mutationKey: keys.auth
    }
}

export const useGetUserinfo = () => {
    const authService = useAuthService();
    
    return useQuery({
        queryFn: authService.getUserinfo(),
        queryKey: keys.auth
    })
}