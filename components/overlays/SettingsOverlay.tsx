'use client';

import React from 'react';
import { useUIStore } from '@/store';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Settings, Brain, RefreshCw, Volume2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Voice options array
const voiceOptions = [
    { id: 'alloy', name: 'Alloy', description: 'Female' },
    { id: 'ash', name: 'Ash', description: 'Male' },
    { id: 'coral', name: 'Coral', description: 'Female' },
    { id: 'echo', name: 'Echo', description: 'Female' },
    { id: 'fable', name: 'Fable', description: 'Female' },
    { id: 'onyx', name: 'Onyx', description: 'Male' },
    { id: 'nova', name: 'Nova', description: 'Female' },
    { id: 'sage', name: 'Sage', description: 'Female' },
    { id: 'shimmer', name: 'Shimmer', description: 'Female' },
];

interface SettingsOverlayProps {
    open: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export default function SettingsOverlay({ open, onOpenChange }: SettingsOverlayProps) {
    const { 
        extractKnowledge,
        toggleExtractKnowledge,
        summarizeFrequency,
        setSummarizeFrequency,
        selectedVoice,
        setSelectedVoice,
        isRawMode,
        toggleRawMode
    } = useUIStore();

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="sm:max-w-md flex flex-col overflow-y-auto">
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

                    <Separator className="my-6" />

                    {/* Voice Settings */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium flex items-center">
                            <Volume2 className="mr-3 h-5 w-5" /> Voice Settings
                        </h3>
                        
                        <div className="space-y-5 px-2">
                            <div>
                                <Label className="text-base">Voice Selection</Label>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Choose the voice of your AI assistant
                                </p>
                            </div>
                            
                            <RadioGroup 
                                value={selectedVoice} 
                                onValueChange={setSelectedVoice}
                                className="mt-4"
                            >
                                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                                    {voiceOptions.map((voice) => (
                                        <div 
                                            key={voice.id} 
                                            className={`flex items-center p-3 rounded-md border hover:bg-accent/10 transition-colors cursor-pointer ${selectedVoice === voice.id ? 'border-accent bg-accent/5' : ''}`}
                                            onClick={() => setSelectedVoice(voice.id)}
                                        >
                                            <div className="mr-2">
                                                <RadioGroupItem value={voice.id} id={voice.id} />
                                            </div>
                                            <Label htmlFor={voice.id} className="flex-1 cursor-pointer">
                                                <div className="font-medium">{voice.name}</div>
                                                <div className="text-xs text-accent/80">{voice.description}</div>
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </RadioGroup>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Raw Mode Setting */}
                    <div className="flex-1 py-8 mx-8 px-1 space-y-10">
                        <div className="space-y-5">
                            <h3 className="text-lg font-medium flex items-center">
                                <Brain className="mr-3 h-5 w-5" /> Raw Mode
                            </h3>

                            <div className="flex items-center justify-between px-2">
                                <div className="space-y-2">
                                    <Label htmlFor="raw-mode" className="text-base">Raw Mode</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Gives unfiltered, objective answers. May be blunt or uncomfortable. <br />
                                        <span className="text-xs text-red-500">Use at your own risk.</span>
                                    </p>
                                </div>
                                <Switch
                                    id="raw-mode"
                                    checked={isRawMode}
                                    onCheckedChange={toggleRawMode}
                                />
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
