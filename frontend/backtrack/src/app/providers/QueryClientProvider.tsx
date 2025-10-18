import { useState, type ReactNode } from "react";
import { QueryClientProvider as LibQueryClientProvider, QueryClient } from "@tanstack/react-query";

export const QueryClientProvider = ({children}: {children: ReactNode}) => {
    const [queryClient] = useState(new QueryClient());
    
    return <LibQueryClientProvider client={queryClient}>
        {children}
    </LibQueryClientProvider>
}