// components/overlays/KnowledgeOverlay.tsx
'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Brain, Info, Trash2, Layers, MessageSquareWarning } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { fetchKnowledgeVectors, fetchSlangVectors, removeKnowledgeVector, KnowledgeVector } from '@/lib/api/knowledge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


// Props Interface remains the same
interface KnowledgeOverlayProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function KnowledgeOverlay({ open, onOpenChange }: KnowledgeOverlayProps) {
    const queryClient = useQueryClient();

    // --- Fetch Knowledge Vectors ---
    const {
        data: knowledgeData,
        isLoading: isLoadingKnowledge,
        error: knowledgeError,
        isError: isKnowledgeError // Explicit boolean for easier checks
    } = useQuery<KnowledgeVector[], Error>({
        queryKey: ['knowledgeVectors'],
        queryFn: () => fetchKnowledgeVectors(50),
        enabled: open,
        staleTime: 5 * 60 * 1000,
    });

    // --- Fetch Slang Vectors ---
    const {
        data: slangData,
        isLoading: isLoadingSlang,
        error: slangError,
        isError: isSlangError // Explicit boolean
    } = useQuery<KnowledgeVector[], Error>({
        queryKey: ['slangVectors'],
        queryFn: () => fetchSlangVectors(50),
        enabled: open,
        staleTime: 5 * 60 * 1000,
    });

    // --- Mutation for Removing a Vector ---
    const removeMutation = useMutation({
        mutationFn: removeKnowledgeVector,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['knowledgeVectors'] });
            queryClient.invalidateQueries({ queryKey: ['slangVectors'] });
            toast.success('Knowledge Removed', {
                description: "The AI will no longer recall this specific piece of information."
            });
        },
        onError: (error) => {
            toast.error('Error Removing Knowledge', {
                description: error.message || "Could not remove the item. Please try again."
            });
        },
    });


    // --- Helper to Render a Single Knowledge Card ---
    const renderVectorCard = (vector: KnowledgeVector) => (
        <Card key={vector.id} className="overflow-hidden"> 
            {/* Main text content with appropriate padding */}
            <CardContent className=""> 
                <p className="text-sm">{vector.text}</p> 
            </CardContent>

            {/* Footer contains metadata and delete action */}
            <CardFooter className="flex justify-between items-center px-4 pt-1.5 pb-1 border-t bg-muted/50">
                {/* Metadata grouped together */}
                <div className="space-x-3 text-xs text-muted-foreground">
                    <span>
                        Updated {formatDistanceToNow(new Date(vector.last_updated), { addSuffix: true })} with {vector.mentions} mention{vector.mentions > 1 ? 's' : ''}
                    </span>
                </div>

                {/* Delete Button with Confirmation */}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7" 
                            disabled={removeMutation.isPending}
                            title="Forget this"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                <span style={{color: 'darkred'}}>This action cannot be undone. The AI will forget this specific piece of information:</span> <br />
                                <AlertDialogTitle className="mt-2 block font-normal text-sm text-gray-900 font-bold">"{vector.text}"</AlertDialogTitle>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-red-800 text-white hover:bg-red-900/90 focus-visible:ring-red-700 focus-visible:ring-offset-2" // Even darker red, white text, adjusted hover/focus
                                onClick={() => removeMutation.mutate(vector.id)}
                            >
                                Yes, Forget It
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    );


    // --- Loading Skeletons ---
    const renderSkeletons = (count = 3) => (
        Array.from({ length: count }).map((_, index) => (
            <Card key={`skeleton-${index}`} className="mb-4">
                <CardHeader className="pb-2 px-4 pt-3">
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="pb-3 pt-1 px-4 space-y-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </CardContent>
                <CardFooter className="pt-0 pb-3 px-4 flex justify-end">
                    <Skeleton className="h-7 w-7 rounded-md" />
                </CardFooter>
            </Card>
        ))
    );

    // --- Helper to render Tab Content (avoids repetition) ---
    const renderTabContent = (
        data: KnowledgeVector[] | undefined,
        isLoading: boolean,
        isError: boolean,
        error: Error | null,
        type: 'knowledge' | 'slang'
    ) => {
        if (isLoading) {
            return <div className="space-y-3 pt-4">{renderSkeletons(type === 'knowledge' ? 4 : 2)}</div>;
        }
        if (isError) {
            return (
                <div className="mt-4 p-4 text-destructive flex items-center gap-2 bg-destructive/10 rounded-md border border-destructive/30">
                    <Info className="h-5 w-5 flex-shrink-0" />
                    <span>Failed to load {type}: {error?.message || 'Unknown error'}</span>
                </div>
            );
        }
        if (!data || data.length === 0) {
            return (
                <div className="pt-10 text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                    {type === 'knowledge' ? <Layers className="h-10 w-10 mb-3 text-gray-400" /> : <MessageSquareWarning className="h-10 w-10 mb-3 text-gray-400" />}
                    <p className="font-semibold">No {type} learned yet!</p>
                    <p className="text-sm">Keep chatting for the AI to learn.</p>
                </div>
            );
        }
        return (
            <div className="space-y-3 pt-4">
                {data.map(vector => renderVectorCard(vector))}
            </div>
        );
    };


    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="sm:max-w-md md:max-w-lg lg:max-w-xl flex flex-col !p-0">
                <SheetHeader className="ml-2 mr-2 mt-2">
                    <SheetTitle className="flex items-center">
                        <Brain className="mr-2 h-5 w-5" /> AI Memory & Learned Knowledge
                    </SheetTitle>
                    <SheetDescription>
                        Review and manage what the AI has learned.
                    </SheetDescription>
                </SheetHeader>

                {/* Use Tabs component */}
                <Tabs defaultValue="knowledge" className="flex-grow flex flex-col overflow-hidden pl-6 pr-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="knowledge">
                            <Layers className="mr-1.5 h-4 w-4" /> Knowledge
                        </TabsTrigger>
                        <TabsTrigger value="slang">
                            <MessageSquareWarning className="mr-1.5 h-4 w-4" /> Terms
                        </TabsTrigger>
                    </TabsList>

                    {/* Add padding and ScrollArea INSIDE each TabsContent */}
                    <TabsContent value="knowledge" className="flex-grow overflow-hidden">
                        <ScrollArea className="h-full pr-4 pl-4">
                            {renderTabContent(knowledgeData, isLoadingKnowledge, isKnowledgeError, knowledgeError, 'knowledge')}
                        </ScrollArea>
                    </TabsContent>
                    <TabsContent value="slang" className="flex-grow overflow-hidden px-2">
                        <ScrollArea className="h-full pr-4 pl-4">
                            {renderTabContent(slangData, isLoadingSlang, isSlangError, slangError, 'slang')}
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    );
}