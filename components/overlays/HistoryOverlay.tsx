// components/overlays/HistoryOverlay.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchConversationHistory, ConversationMessage } from '@/lib/api/conversation_history';
import { format, parseISO } from 'date-fns'; // Import for formatting timestamps and parseISO

// UI Imports
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Info, MessageSquare } from 'lucide-react';

// Props Interface
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
        isFetched,
    } = useQuery({
        queryKey: ['conversationHistory'],
        queryFn: fetchConversationHistory,
        enabled: open,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    // --- Scroll to bottom effect ---
    useEffect(() => {
        if (isFetched && historyData && historyData.length > 0) {
            const viewport = scrollAreaRef.current?.querySelector<HTMLDivElement>('[data-radix-scroll-area-viewport]');
            if (viewport) {
                setTimeout(() => { viewport.scrollTop = viewport.scrollHeight; }, 0);
            }
        }
    }, [isFetched, historyData]);

    // --- Get unique roles from the history data ---
    const uniqueRoles = historyData ? 
        [...new Set(historyData.filter(msg => msg.role !== 'Summary').map(msg => msg.role))] 
        : [];

    // --- Updated Render Message Helper ---
    const renderHistoryItem = (message: ConversationMessage, index: number) => {
        const { role, content } = message;
        
        // Access created_at directly from the raw message object
        const created_at = (message as any).created_at;
        
        // Format the timestamp
        let formattedTime = 'Invalid Date';
        try {
            if (created_at) {
                const date = new Date(created_at);
                if (!isNaN(date.getTime())) {
                    formattedTime = format(date, 'MMM d, h:mm a');
                }
            }
        } catch (error) {
            console.error('Date formatting error:', error);
        }
        
        // Handle summary messages - case insensitive check
        if (role.toLowerCase() === 'summary') {
            return (
                <div key={index} className="my-6 flex flex-col items-center">
                    {/* Avatar with "S" centered above */}
                    <Avatar className="h-8 w-8 mb-1">
                        <AvatarFallback>S</AvatarFallback>
                    </Avatar>
                    
                    {/* Role label centered */}
                    <span className="text-xs font-medium mb-2">Summary</span>
                    
                    {/* Pink message bubble centered */}
                    <div 
                        className="rounded-lg px-4 py-3 text-white shadow-sm"
                        style={{ 
                            backgroundColor: '#f472b6',
                            maxWidth: '80%'
                        }}
                    >
                        <p className="text-sm whitespace-pre-wrap break-words text-center">
                            {content}
                        </p>
                    </div>
                    
                    {/* Timestamp */}
                    <div className="text-xs text-gray-500 mt-1">
                        {formattedTime}
                    </div>
                </div>
            );
        }
        
        // Get background color based on role and determine alignment
        const roleIndex = uniqueRoles.indexOf(role);
        const bubbleColor = roleIndex % 2 === 0 ? '#818cf8' : '#a78bfa';
        
        // Alternate alignment based on index (odd/even)
        const isAlignRight = index % 2 === 1;
        
        // Standard bubble rendering for users with alternating colors and alignment
        return (
            <div key={index} className="mb-6">
                <div className={`flex items-start space-x-3 px-4 ${isAlignRight ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Avatar with first letter of role name */}
                    <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback>
                            {role.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className={`flex flex-col ${isAlignRight ? 'items-end' : 'items-start'}`}>
                        {/* Display role name */}
                        <span className="text-xs font-medium mb-1">{role}</span>
                        
                        {/* Content Bubble with improved padding and text wrapping */}
                        <div 
                            className="rounded-lg px-4 py-3 text-white shadow-sm"
                            style={{ 
                                backgroundColor: bubbleColor,
                                maxWidth: '280px',
                                minWidth: '80px'
                            }}
                        >
                            <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
                        </div>
                        
                        {/* Timestamp with proper formatting */}
                        <div className="text-xs text-gray-500 mt-1">
                            {formattedTime}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="sm:max-w-md md:max-w-lg flex flex-col p-0 overflow-hidden">
                <SheetHeader className="px-6 py-4 flex-shrink-0">
                    <SheetTitle className="flex items-center">
                        <MessageSquare className="mr-2 h-5 w-5" /> Conversation History
                    </SheetTitle>
                    <SheetDescription>
                        Review your past interactions with your AI.
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea 
                    className="flex-grow h-[calc(100vh-180px)] bg-gray-100 mt-0" 
                    ref={scrollAreaRef}
                    style={{ scrollBehavior: 'smooth' }}
                >
                    <div className="space-y-2 pb-4">
                        {/* Loading state */}
                        {isLoadingHistory && (
                            <div className="space-y-4 p-4">
                                <Skeleton className="h-16 w-3/4" />
                                <Skeleton className="h-12 w-2/3 ml-auto" />
                                <Skeleton className="h-20 w-4/5" />
                            </div>
                        )}
                        
                        {/* Error state */}
                        {historyError && (
                            <div className="p-4 text-center text-destructive flex flex-col items-center justify-center h-full">
                                <Info className="mb-2 h-6 w-6" />
                                <p>Failed to load history.</p>
                                <p className="text-sm text-muted-foreground">
                                    {(historyError as Error).message}
                                </p>
                            </div>
                        )}

                        {/* Map over the ConversationMessage array */}
                        {!isLoadingHistory && !historyError && historyData && (
                            historyData.length > 0 ? (
                                historyData.map(renderHistoryItem)
                            ) : (
                                <div className="p-4 text-center text-muted-foreground flex items-center justify-center h-full">
                                    No history yet. Start chatting!
                                </div>
                            )
                        )}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}