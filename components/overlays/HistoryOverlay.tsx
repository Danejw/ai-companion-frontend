// components/overlays/HistoryOverlay.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchConversationHistory, ConversationMessage } from '@/lib/api/conversation_history'; // Adjust path

import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter, // If needed for actions like clear history
    SheetClose, // Button to close the sheet
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area'; // For scrollable content
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // For role icons
import { Bot, User, Info, MessageSquare } from 'lucide-react'; // Icons
import { Separator } from '@/components/ui/separator'; // To separate messages

// Define Props Interface
interface HistoryOverlayProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function HistoryOverlay({ open, onOpenChange }: HistoryOverlayProps) {
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // --- Fetch History ---
    const {
        data: historyData,
        isLoading: isLoadingHistory,
        error: historyError,
        isFetched, // Use isFetched to know when data is available
    } = useQuery({
        queryKey: ['conversationHistory'], // Unique key
        queryFn: fetchConversationHistory,
        enabled: open, // Only fetch when the sheet is open
        staleTime: 5 * 60 * 1000, // Refetch after 5 mins if stale
        refetchOnWindowFocus: false, // Don't refetch just on window focus for history
    });

    // --- Scroll to bottom when history loads or updates ---
    useEffect(() => {
        if (isFetched && historyData && historyData.length > 0) {
            // Access the viewport element within ScrollArea
            const viewport = scrollAreaRef.current?.querySelector<HTMLDivElement>('[data-radix-scroll-area-viewport]');
            if (viewport) {
                // Use setTimeout to ensure rendering is complete before scrolling
                setTimeout(() => {
                    viewport.scrollTop = viewport.scrollHeight;
                }, 0);
            }
        }
    }, [isFetched, historyData]); // Dependency array


    // Helper to render message bubble
    const renderMessage = (message: ConversationMessage) => (
        <div className="mb-4 flex flex-col">
            <div className={`flex items-start space-x-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                {/* Icon/Avatar */}
                {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8">
                        {/* Optional: Add assistant image <AvatarImage src="/path/to/ai-avatar.png" /> */}
                        <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                )}

                {/* Content Bubble */}
                <div
                    className={`max-w-[75%] rounded-lg px-3 py-2 ${message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                >
                    {/* Basic text display, consider markdown rendering library later if needed */}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>

                {/* Icon/Avatar for User */}
                {message.role === 'user' && (
                    <Avatar className="h-8 w-8">
                        {/* Optional: Add user image <AvatarImage src={session?.user?.image || undefined} /> */}
                        <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                )}
            </div>
        </div>
    );

    return (
        // Use side="left" or "right" as preferred
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="sm:max-w-md md:max-w-lg flex flex-col"> {/* Make sheet flex column */}
                <SheetHeader>
                    <SheetTitle className="flex items-center">
                        <MessageSquare className="mr-2 h-5 w-5" /> Conversation History
                    </SheetTitle>
                    <SheetDescription>
                        Review your past interactions with the AI.
                    </SheetDescription>
                </SheetHeader>

                <Separator className="my-4" />

                {/* Scrollable History Area */}
                {/* Use flex-grow to make ScrollArea fill available space */}
                <ScrollArea className="flex-grow pr-4" ref={scrollAreaRef}> {/* Added padding-right */}
                    {isLoadingHistory && (
                        // Show skeletons while loading
                        <div className="space-y-4 p-4">
                            <Skeleton className="h-16 w-3/4" />
                            <Skeleton className="h-12 w-2/3 ml-auto" />
                            <Skeleton className="h-20 w-4/5" />
                        </div>
                    )}

                    {historyError && (
                        <div className="p-4 text-center text-destructive flex flex-col items-center justify-center h-full">
                            <Info className="mb-2 h-6 w-6" />
                            <p>Failed to load history.</p>
                            <p className="text-sm text-muted-foreground">{historyError.message}</p>
                        </div>
                    )}

                    {!isLoadingHistory && !historyError && historyData && (
                        historyData.length > 0 ? (
                            historyData.map(renderMessage)
                        ) : (
                            <div className="p-4 text-center text-muted-foreground flex items-center justify-center h-full">
                                No history yet. Start chatting!
                            </div>
                        )
                    )}
                </ScrollArea>

                {/* Optional Footer */}
                {/* <SheetFooter className="mt-4">
                    <Button variant="destructive">Clear History</Button>
                    <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                    </SheetClose>
                </SheetFooter> */}
            </SheetContent>
        </Sheet>
    );
}