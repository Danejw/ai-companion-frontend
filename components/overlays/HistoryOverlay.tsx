// components/overlays/HistoryOverlay.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
// Import the updated fetch function - now returns string[]
import { fetchConversationHistory } from '@/lib/api/conversation_history'; // Adjust path

// UI Imports remain the same
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, Info, MessageSquare, NotebookText } from 'lucide-react'; // Added NotebookText for Summary
import { Separator } from '@/components/ui/separator';

// Props Interface remains the same
interface HistoryOverlayProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// Helper function to parse role and content from history string
const parseHistoryString = (item: string): { role: 'user' | 'assistant' | 'summary' | 'unknown', content: string } => {
    if (item.startsWith("Summary:")) {
        return { role: 'summary', content: item.substring("Summary:".length).trim() };
    } else if (item.includes(':')) {
        const parts = item.split(':', 1); // Split only on the first colon
        const speaker = parts[0].trim();
        const content = item.substring(parts[0].length + 1).trim();
        // Basic check for speaker name - adjust if needed
        if (speaker.toLowerCase().includes('astra') || speaker.toLowerCase().includes('ai')) {
            return { role: 'assistant', content: content };
        } else {
            // Assume user otherwise, could refine later
            return { role: 'user', content: content };
        }
    }
    // If no colon or prefix recognized
    return { role: 'unknown', content: item };
};

export default function HistoryOverlay({ open, onOpenChange }: HistoryOverlayProps) {
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // --- Fetch History (useQuery now expects string[]) ---
    const {
        data: historyData, // This will be string[] | undefined
        isLoading: isLoadingHistory,
        error: historyError,
        isFetched,
    } = useQuery({
        queryKey: ['conversationHistory'],
        queryFn: fetchConversationHistory, // Fetch function returns string[]
        enabled: open,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    // --- Scroll to bottom effect remains the same ---
    useEffect(() => {
        // ... (scroll effect code is unchanged) ...
        if (isFetched && historyData && historyData.length > 0) {
            const viewport = scrollAreaRef.current?.querySelector<HTMLDivElement>('[data-radix-scroll-area-viewport]');
            if (viewport) {
                setTimeout(() => { viewport.scrollTop = viewport.scrollHeight; }, 0);
            }
        }
    }, [isFetched, historyData]);

    // --- Updated Render Message Helper ---
    // Now accepts the raw string and index
    const renderHistoryItem = (itemString: string, index: number) => {
        const { role, content } = parseHistoryString(itemString);

        // Special rendering for summary or unknown
        if (role === 'summary' || role === 'unknown') {
            return (
                <div key={index} className="my-4 p-3 bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-400 rounded-md text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                    {role === 'summary' ? <NotebookText className="h-4 w-4 mt-0.5 flex-shrink-0" /> : <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                    <p className="whitespace-pre-wrap">{content}</p>
                </div>
            );
        }

        // Standard bubble rendering for user/assistant
        return (
            <div key={index} className="mb-4 flex flex-col">
                <div className={`flex items-start space-x-3 ${role === 'user' ? 'justify-end' : ''}`}>
                    {/* Icon/Avatar */}
                    {role === 'assistant' && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                    )}

                    {/* Content Bubble */}
                    <div className={`max-w-[75%] rounded-lg px-3 py-2 ${role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p className="text-sm whitespace-pre-wrap">{content}</p>
                    </div>

                    {/* Icon/Avatar for User */}
                    {role === 'user' && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                    )}
                </div>
            </div>
        );
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="sm:max-w-md md:max-w-lg flex flex-col">
                <SheetHeader>
                    <SheetTitle className="flex items-center">
                        <MessageSquare className="mr-2 h-5 w-5" /> Conversation History
                    </SheetTitle>
                    <SheetDescription>
                        Review your past interactions with the AI.
                    </SheetDescription>
                </SheetHeader>

                <Separator className="my-4" />

                <ScrollArea 
                    className="flex-grow pr-4 h-[calc(100vh-180px)]" 
                    ref={scrollAreaRef}
                    style={{ scrollBehavior: 'smooth' }}
                >
                    <div className="space-y-2 pb-4">
                        {/* Loading/Error states remain the same */}
                        {isLoadingHistory && (
                            <div className="space-y-4 p-4">
                                <Skeleton className="h-16 w-3/4" />
                                <Skeleton className="h-12 w-2/3 ml-auto" />
                                <Skeleton className="h-20 w-4/5" />
                            </div>
                        )}
                        {historyError && (<div className="p-4 text-center text-destructive flex flex-col items-center justify-center h-full"> {/* ... Error Info ... */} <Info className="mb-2 h-6 w-6" /> <p>Failed to load history.</p> <p className="text-sm text-muted-foreground">{historyError.message}</p> </div>)}

                        {/* Map over the string array (historyData) */}
                        {!isLoadingHistory && !historyError && historyData && (
                            historyData.length > 0 ? (
                                // Pass the string item and index to the render function
                                historyData.map(renderHistoryItem)
                            ) : (
                                <div className="p-4 text-center text-muted-foreground flex items-center justify-center h-full">
                                    No history yet. Start chatting!
                                </div>
                            )
                        )}
                    </div>
                </ScrollArea>
                {/* Footer remains commented out */}
            </SheetContent>
        </Sheet>
    );
}