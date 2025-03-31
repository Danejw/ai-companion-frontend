'use client'; 

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';



// This component wraps children with all necessary client-side providers
export function ClientProviders({ children }: { children: React.ReactNode }) {
    // Ensure QueryClient is only created once per session
    const [queryClient] = React.useState(() => new QueryClient());

    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                {children}
                <Toaster richColors position="top-right" />
                {/* <ReactQueryDevtools initialIsOpen={false} /> */}
            </QueryClientProvider>
        </SessionProvider>
    );
}