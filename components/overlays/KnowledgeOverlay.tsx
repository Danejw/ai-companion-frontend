// components/overlays/KnowledgeOverlay.tsx
'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Brain, Info, Trash2, Layers, MessageSquareWarning, PersonStanding, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { fetchKnowledgeVectors, fetchSlangVectors, removeKnowledgeVector, removeSlangVector, Vector } from '@/lib/api/knowledge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchMBTI, resetMBTI, type MBTIData } from '@/lib/api/mbti';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { fetchOcean, resetOcean, type Ocean } from '@/lib/api/ocean';
import InfoOCEANOverlay from '@/components/overlays/InfoOCEANOverlay';
import InfoMBTIOverlay from '@/components/overlays/InfoMBTIOverlay';

// Props Interface remains the same
interface KnowledgeOverlayProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function KnowledgeOverlay({ open, onOpenChange }: KnowledgeOverlayProps) {
    const queryClient = useQueryClient();
    const [isOceanInfoOpen, setIsOceanInfoOpen] = React.useState(false);
    const [isMbtiInfoOpen, setIsMbtiInfoOpen] = React.useState(false);

    // --- Fetch Knowledge Vectors ---
    const {
        data: knowledgeData,
        isLoading: isLoadingKnowledge,
        error: knowledgeError,
        isError: isKnowledgeError
    } = useQuery<Vector[], Error>({
        queryKey: ['knowledgeVectors'],
        queryFn: () => fetchKnowledgeVectors(20),
        enabled: open,
        staleTime: 5 * 60 * 1000,
    });

    // --- Fetch Slang Vectors ---
    const {
        data: slangData,
        isLoading: isLoadingSlang,
        error: slangError,
        isError: isSlangError
    } = useQuery<Vector[], Error>({
        queryKey: ['slangVectors'],
        queryFn: () => fetchSlangVectors(20),
        enabled: open,
        staleTime: 5 * 60 * 1000,
    });

    // --- Mutation for Removing a Vector ---
    const removeKnowledgeMutation = useMutation({
        mutationFn: removeKnowledgeVector,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['knowledgeVectors'] });
            toast.success('Knowledge Removed');
        },
        onError: () => {
            toast.error('Error Removing Knowledge');
        },
    });

    const removeSlangMutation = useMutation({
        mutationFn: removeSlangVector,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['slangVectors'] });
            toast.success('Slang Term Removed');
        },
        onError: () => {
            toast.error('Error Removing Slang');
        },
    });

    // --- Fetch MBTI Data ---  
    const {
        data: mbtiData,
        isLoading: isLoadingMBTI,
        error: mbtiError,
        isError: isMBTIError
    } = useQuery<MBTIData, Error>({
        queryKey: ['mbtiData'], // Unique query key
        queryFn: fetchMBTI,    // Use the imported function
        enabled: open,         // Only fetch when the sheet is open
        staleTime: 15 * 60 * 1000, // MBTI might not change often, cache for 15 mins
        retry: 1, // Retry once on failure
    });

    // --- Fetch OCEAN Data ---
    const {
        data: oceanData,
        isLoading: isLoadingOcean,
        error: oceanError,
        isError: isOceanError
    } = useQuery<Ocean, Error>({
        queryKey: ['oceanData'],
        queryFn: fetchOcean,
        enabled: open,
        staleTime: 15 * 60 * 1000,
        retry: 1,
    });

    // --- Reset OCEAN Data ---
    const resetOceanMutation = useMutation({
        mutationFn: resetOcean,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['oceanData'] });
            toast.success('OCEAN traits have been reset');
        },
        onError: () => {
            toast.error('Failed to reset OCEAN traits');
        },
    });

    // --- Reset MBTI Data ---
    const resetMBTIMutation = useMutation({
        mutationFn: resetMBTI,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mbtiData'] });
            toast.success('MBTI traits have been reset');
        },
        onError: () => {
            toast.error('Failed to reset MBTI traits');
        },
    });

    // --- Helper to Render a Single Knowledge Card ---
    const renderVectorCard = (vector: Vector, type: 'knowledge' | 'slang') => (
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
                            disabled={type === 'knowledge' ? removeKnowledgeMutation.isPending : removeSlangMutation.isPending}
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
                                <AlertDialogTitle className="mt-2 block font-normal text-sm text-gray-900 font-bold">{vector.text}</AlertDialogTitle>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-red-800 text-white hover:bg-red-900/90 focus-visible:ring-red-700 focus-visible:ring-offset-2"
                                onClick={() => type === 'knowledge' 
                                    ? removeKnowledgeMutation.mutate(vector.id) 
                                    : removeSlangMutation.mutate(vector.id)}
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
        data: Vector[] | undefined,
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
                {data
                    .slice() // Create a copy to avoid mutating original array
                    .sort((a, b) => 
                        new Date(b.last_updated).getTime() - 
                        new Date(a.last_updated).getTime()
                    )
                    .map(vector => renderVectorCard(vector, type))}
            </div>
        );
    };

    // Add render function for OCEAN traits
    const renderOceanTrait = (label: string, value: number) => {
        const percentage = Math.round(value * 100);
        return (
            <div key={label} className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium capitalize">
                        {label}
                    </Label>
                    <span className="text-sm text-muted-foreground">
                        {percentage}%
                    </span>
                </div>
                <Slider 
                    value={[percentage]}
                    max={100}
                    step={1}
                    disabled
                    className="w-full"
                />
            </div>
        );
    };

    // Add a render function for MBTI traits similar to the OCEAN one
    const renderMBTITrait = (leftTrait: string, rightTrait: string, value: number) => {
        const percentage = Math.round(value * 100);
        return (
            <div key={`${leftTrait}-${rightTrait}`} className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">
                        {leftTrait}
                    </span>
                    <div className="relative flex justify-center w-16">
                        <span className="text-sm font-medium text-muted-foreground">
                            {percentage}%
                        </span>
                    </div>
                    <span className="text-sm font-medium capitalize">
                        {rightTrait}
                    </span>
                </div>
                <div className="relative pt-2">
                    <Slider 
                        value={[percentage]} 
                        max={100} 
                        step={1} 
                        disabled
                        className="w-full"
                    />
                </div>
            </div>
        );
    };

    return (
        <>
            <InfoOCEANOverlay open={isOceanInfoOpen} onOpenChange={setIsOceanInfoOpen} />
            <InfoMBTIOverlay open={isMbtiInfoOpen} onOpenChange={setIsMbtiInfoOpen} />

            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent side="right" className="sm:max-w-md md:max-w-lg lg:max-w-xl flex flex-col !p-0">
                    <SheetHeader className="ml-2 mr-2 mt-2">
                        <SheetTitle className="flex items-center">
                            <Brain className="mr-2 h-5 w-5" /> AI Memory & Learned Knowledge
                        </SheetTitle>
                        <SheetDescription>
                            Review and manage what your AI has learned.
                        </SheetDescription>
                    </SheetHeader>

                    {/* Use Tabs component */}
                    <Tabs defaultValue="knowledge" className="flex-grow flex flex-col overflow-hidden pl-3 pr-3">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="knowledge" className="flex items-center justify-center">
                                <Layers className="h-4 w-4 sm:mr-1.5" /> 
                                <span className="hidden sm:inline">Knowledge</span>
                            </TabsTrigger>
                            <TabsTrigger value="slang" className="flex items-center justify-center">
                                <MessageSquareWarning className="h-4 w-4 sm:mr-1.5" /> 
                                <span className="hidden sm:inline">Terms</span>
                            </TabsTrigger>
                            <TabsTrigger value="mbti" className="flex items-center justify-center">
                                <PersonStanding className="h-4 w-4 sm:mr-1.5" /> 
                                <span className="hidden sm:inline">MBTI</span>
                            </TabsTrigger>
                            <TabsTrigger value="ocean" className="flex items-center justify-center">
                                <User className="h-4 w-4 sm:mr-1.5" /> 
                                <span className="hidden sm:inline">OCEAN</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="knowledge" className="flex-grow overflow-hidden">
                            <ScrollArea className="h-full">
                                {renderTabContent(knowledgeData, isLoadingKnowledge, isKnowledgeError, knowledgeError, 'knowledge')}
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="slang" className="flex-grow overflow-hidden px-2">
                            <ScrollArea className="h-full">
                                {renderTabContent(slangData, isLoadingSlang, isSlangError, slangError, 'slang')}
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="mbti" className="flex-grow overflow-hidden px-2 flex flex-col">
                            <ScrollArea className="h-full flex-grow">
                                {isLoadingMBTI ? (
                                    <div className="space-y-3 pt-4">{renderSkeletons(1)}</div>
                                ) : isMBTIError ? (
                                    <div className="mt-4 p-4 text-destructive flex items-center gap-2 bg-destructive/10 rounded-md border border-destructive/30">
                                        <Info className="h-5 w-5 flex-shrink-0" />
                                        <span>Failed to load MBTI: {mbtiError?.message || 'Unknown error'}</span>
                                    </div>
                                ) : mbtiData && mbtiData.message_count > 0 ? (
                                    <div className="pt-4 space-y-6">
                                        <div className="text-center">
                                            <h3 className="text-2xl font-bold mb-2">Your MBTI Type</h3>
                                            <div className="text-4xl font-mono bg-primary/10 p-4 rounded-lg">
                                                {mbtiData.type || "NONE"}
                                            </div>
                                            <div className="text-sm text-muted-foreground mt-2">
                                                Based on {mbtiData?.message_count} interactions
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            {renderMBTITrait('Extraversion', 'Introversion', mbtiData.extraversion_introversion)}
                                            {renderMBTITrait('Sensing', 'Intuition', mbtiData.sensing_intuition)}
                                            {renderMBTITrait('Thinking', 'Feeling', mbtiData.thinking_feeling)}
                                            {renderMBTITrait('Judging', 'Perceiving', mbtiData.judging_perceiving)}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="pt-10 text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                                        <PersonStanding className="h-10 w-10 mb-3 text-gray-400" />
                                        <p className="font-semibold">No personality data yet!</p>
                                        <p className="text-sm">Keep chatting for MBTI insights.</p>
                                    </div>
                                )}
                            </ScrollArea>
                            
                            <div className="pt-2 pb-4 bg-background border-t mt-auto">
                                <div className="flex flex-col gap-2">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Reset MBTI Type
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Reset MBTI Type?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will reset your MBTI personality type and all related traits. This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    className="bg-red-800 text-white hover:bg-red-900/90"
                                                    onClick={() => resetMBTIMutation.mutate()}
                                                >
                                                    Yes, Reset
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full text-muted-foreground"
                                        onClick={() => {
                                            setIsMbtiInfoOpen(true);
                                            onOpenChange(false);
                                        }}
                                    >
                                        <Info className="h-4 w-4 mr-2" />
                                        Learn about MBTI
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="ocean" className="flex-grow overflow-hidden px-2 flex flex-col">
                            <ScrollArea className="h-full flex-grow">
                                {isLoadingOcean ? (
                                    <div className="space-y-3 pt-4">{renderSkeletons(1)}</div>
                                ) : isOceanError ? (
                                    <div className="mt-4 p-4 text-destructive flex items-center gap-2 bg-destructive/10 rounded-md border border-destructive/30">
                                        <Info className="h-5 w-5 flex-shrink-0" />
                                        <span>Failed to load OCEAN: {oceanError?.message || 'Unknown error'}</span>
                                    </div>
                                ) : oceanData && oceanData.response_count > 0 ? (
                                    <div className="pt-4 space-y-6">
                                        <div className="text-center">
                                            <h3 className="text-2xl font-bold mb-2">OCEAN Personality Traits</h3>
                                            <div className="text-sm text-muted-foreground mb-4">
                                                Based on {oceanData.response_count} interactions
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            {renderOceanTrait('Openness', oceanData.openness)}
                                            {renderOceanTrait('Conscientiousness', oceanData.conscientiousness)}
                                            {renderOceanTrait('Extraversion', oceanData.extraversion)}
                                            {renderOceanTrait('Agreeableness', oceanData.agreeableness)}
                                            {renderOceanTrait('Neuroticism', oceanData.neuroticism)}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="pt-10 text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                                        <User className="h-10 w-10 mb-3 text-gray-400" />
                                        <p className="font-semibold">No personality data yet!</p>
                                        <p className="text-sm">Keep chatting for OCEAN insights.</p>
                                    </div>
                                )}
                            </ScrollArea>
                            
                            <div className="pt-2 pb-4 bg-background border-t mt-auto">
                                <div className="flex flex-col gap-2">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Reset OCEAN Traits
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Reset OCEAN Traits?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will reset all your OCEAN personality traits. This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    className="bg-red-800 text-white hover:bg-red-900/90"
                                                    onClick={() => resetOceanMutation.mutate()}
                                                >
                                                    Yes, Reset
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full text-muted-foreground"
                                        onClick={() => {
                                            setIsOceanInfoOpen(true);
                                            onOpenChange(false);
                                        }}
                                    >
                                        <Info className="h-4 w-4 mr-2" />
                                        Learn about OCEAN
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </SheetContent>
            </Sheet>
        </>
    );
}