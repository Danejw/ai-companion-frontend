'use client';

import React from 'react';
import { useUIStore } from '@/store';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Settings, Brain, RefreshCw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface SettingsOverlayProps {
    open: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export default function SettingsOverlay({ open, onOpenChange }: SettingsOverlayProps) {
    const { 
        extractKnowledge,
        toggleExtractKnowledge,
        summarizeFrequency,
        setSummarizeFrequency
    } = useUIStore();

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="sm:max-w-md flex flex-col">
                <SheetHeader className="border-b pb-6 pt-2">
                    <SheetTitle className="flex items-center text-xl">
                        <Settings className="mr-3 h-5 w-5" /> Settings
                    </SheetTitle>
                    <SheetDescription className="mt-2">
                        Configure your AI assistant&apos;s behavior
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 py-8 mx-8 px-1 space-y-10">
                    {/* Knowledge Extraction Setting */}
                    <div className="space-y-5">
                        <h3 className="text-lg font-medium flex items-center">
                            <Brain className="mr-3 h-5 w-5" /> Knowledge Management
                        </h3>
                        
                        <div className="flex items-center justify-between px-2">
                            <div className="space-y-2">
                                <Label htmlFor="extract-knowledge" className="text-base">Extract Knowledge</Label>
                                <p className="text-sm text-muted-foreground">
                                    Automatically extract knowledge from your messages
                                </p>
                            </div>
                            <Switch 
                                id="extract-knowledge"
                                checked={extractKnowledge}
                                onCheckedChange={toggleExtractKnowledge}
                            />
                        </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Summarization Setting */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium flex items-center">
                            <RefreshCw className="mr-3 h-5 w-5" /> Conversation Management
                        </h3>
                        
                        <div className="space-y-5 px-2">
                            <div>
                                <Label htmlFor="summarize-frequency" className="text-base">Summarize Frequency</Label>
                                <p className="text-sm text-muted-foreground mt-2">
                                    How often should conversations be summarized
                                </p>
                            </div>
                            
                            <Slider 
                                id="summarize-frequency"
                                min={5}
                                max={20}
                                step={1}
                                value={[summarizeFrequency]}
                                onValueChange={(value) => setSummarizeFrequency(value[0])}
                                className="my-4"
                            />
                            
                            <div className="text-sm font-medium text-center">
                                {summarizeFrequency <= 5 ? (
                                    <span>Summarize every 5 messages</span>
                                ) : (
                                    <span>Summarize every {summarizeFrequency} messages</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="border-t pt-5 pb-2 text-xs text-muted-foreground text-center">
                    Settings are automatically saved.
                </div>
            </SheetContent>
        </Sheet>
    );
}
