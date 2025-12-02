import { AuthRepository } from "features/auth/model/authrepository";
import { AuthService } from "features/auth/model/authservice";
import { AuthContext } from "features/auth/ui/authContext";
import { useState, type ReactNode } from "react";

export const AuthContextProvider = ({children}: {children: ReactNode}) => {
    const [repository] = useState(new AuthRepository());
    const [service] = useState(new AuthService(repository));

    return <AuthContext.Provider value={service}>
        {children}
    </AuthContext.Provider>
}