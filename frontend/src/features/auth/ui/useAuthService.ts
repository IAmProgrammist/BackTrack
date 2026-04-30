import { useCallback, useContext, useEffect, useState } from "react"
import type { AuthServiceEvents, IAuthService } from "../model/iauthservice"
import { AuthContext } from "./authContext";

export const useAuthService = () => {
    return useContext<IAuthService>(AuthContext);
}

export const useAuthToken = () => {
    const authService = useAuthService();
    const [token, setToken] = useState(authService.getToken());

    const onTokenChanged = useCallback((ev: AuthServiceEvents["tokenupdated"]) => {
        setToken(ev.token);
    }, [authService]);

    useEffect(() => {
        authService.addEventListener("tokenupdated", onTokenChanged);

        return () => {
            authService.removeEventListener("tokenupdated", onTokenChanged);    
        }
    }, [authService, onTokenChanged])

    return {token, service: authService};
}