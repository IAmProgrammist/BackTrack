import { useEffect, useState, type ReactNode } from "react";
import { QueryClientProvider as LibQueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useAuthToken } from "features/auth/ui/useAuthService";

export const QueryClientProvider = ({children}: {children: ReactNode}) => {
    const [queryClient] = useState(new QueryClient());
    const authToken = useAuthToken();
    useEffect(() => {
        console.log("A token reset detected. Resetting all query client caches.");
        queryClient.clear();
    }, [authToken, queryClient])
    
    return <LibQueryClientProvider client={queryClient}>
        {children}
    </LibQueryClientProvider>
}