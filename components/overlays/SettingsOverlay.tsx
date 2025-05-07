'use client';

import React, { useState } from 'react';
import { useUIStore } from '@/store';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Settings, Brain, RefreshCw, Volume2, Languages, Activity, Waypoints } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { deleteAccount } from "@/lib/api/account";
import { signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";


// Voice options array
const voiceOptions = [
    { id: 'alloy', name: 'Ashley', description: 'Female' },
    { id: 'ash', name: 'Aiden', description: 'Male' },
    { id: 'coral', name: 'Britney', description: 'Female' },
    { id: 'echo', name: 'Charlie', description: 'Male' },
    { id: 'fable', name: 'Diana', description: 'Female' },
    { id: 'onyx', name: 'Eric', description: 'Male' },
    { id: 'nova', name: 'Fiona', description: 'Female' },
    { id: 'sage', name: 'George', description: 'Male' },
    { id: 'shimmer', name: 'Hannah', description: 'Female' },
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
        useLocalLingo,
        toggleLocalLingo,
        empathy,
        directness,
        warmth,
        challenge,
        setEmpathy,
        setDirectness,
        setWarmth,
        setChallenge,
        toggleOptedInToCare,
        toggleOptedInToConnect,
        isOptedInToCare,
        isOptedInToConnect,
        toggleConnectFormOverlay,
        userConnectProfile
    } = useUIStore();

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const toggleSettingsOverlay = useUIStore((state) => state.toggleSettingsOverlay);

    const handleDeleteAccount = async () => {
        try {
            setIsDeleting(true);
            const result = await deleteAccount();
            
            if (result.success) {
                toast.success("Your account has been deleted successfully");
                toggleSettingsOverlay(false);
                
                // Sign the user out
                await signOut({ redirect: false });

            } else {
                toast.error(`Account deletion partially completed: ${result.message}`);
            }
        } catch (error) {
            console.error("Failed to delete account:", error);
            toast.error("Failed to delete account");
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirmation(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="sm:max-w-md flex flex-col overflow-y-auto scrollbar-hide">
                <SheetHeader className="border-b pb-6 pt-2">
                    <SheetTitle className="flex items-center text-xl">
                        <Settings className="mr-3 h-5 w-5" /> Settings
                    </SheetTitle>
                    <SheetDescription className="mt-2">
                        Configure your AI assistant&apos;s behavior
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 py-8 mx-8 px-1 space-y-10">
                    {/* Opted in to Care */}
                    <div className="space-y-5">
                        <h3 className="text-lg font-medium flex items-center">
                            <Activity className="mr-3 h-5 w-5" /> Care
                            <span className="ml-3 px-2 py-0.5 rounded-full text-xs font-semibold bg-accent text-white">
                                Coming Soon
                            </span>
                        </h3>

                                                
                        <div className="flex items-center justify-between px-2">
                            <div className="space-y-2">
                                <Label htmlFor="opted-in-to-care" className="text-base">Opt in</Label>
                                <p className="text-sm text-muted-foreground">
                                    Create a profile to connect with therapists.
                                </p>
                            </div>
                            <Switch 
                                id="opted-in-to-care"
                                checked={isOptedInToCare}
                                onCheckedChange={toggleOptedInToCare}
                            />
                        </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Opted in to Connect */}
                    <div className="space-y-5">
                        <h3 className="text-lg font-medium flex items-center">
                            <Waypoints className="mr-3 h-5 w-5" /> Connect
                            <span className="ml-3 px-2 py-0.5 rounded-full text-xs font-semibold bg-accent text-white">
                                Coming Soon
                            </span>
                        </h3>
                        
                        <div className="flex items-center justify-between px-2">
                            <div className="space-y-2">
                                <Label htmlFor="opted-in-to-connect" className="text-base">Opt in</Label>
                                <p className="text-sm text-muted-foreground">
                                    Create a profile to connect with other users.
                                </p>
                            </div>
                            <div className="flex items-center">
                                <Switch 
                                    id="opted-in-to-connect"
                                    checked={isOptedInToConnect}
                                    onCheckedChange={toggleOptedInToConnect}
                                />
                            </div>
                        </div>
                        {userConnectProfile && (
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => toggleConnectFormOverlay(true)}
                                className="ml-4"
                            >
                                Edit Connect Profile
                            </Button>
                        )}
                    </div>

                    <Separator className="my-6" />

                    {/* Knowledge Extraction Setting */}
                    <div className="space-y-5">
                        <h3 className="text-lg font-medium flex items-center">
                            <Brain className="mr-3 h-5 w-5" /> Knowledge Management
                        </h3>
                        
                        <div className="flex items-center justify-between px-2">
                            <div className="space-y-2">
                                <Label htmlFor="extract-knowledge" className="text-base">Extract Knowledge</Label>
                                <p className="text-sm text-muted-foreground">
                                    Automatically create memories from your messages.
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

                    {/* Personality Settings */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium flex items-center">
                            🧠 Personality Settings
                        </h3>

                        <div className="space-y-5 px-2">
                            <div>
                                <Label className="text-base">Empathy</Label>
                                <Slider
                                    min={0}
                                    max={5}
                                    step={1}
                                    value={[empathy]}
                                    onValueChange={(value) => setEmpathy(value[0])}
                                />
                            </div>

                            <div>
                                <Label className="text-base">Directness</Label>
                                <Slider
                                    min={0}
                                    max={5}
                                    step={1}
                                    value={[directness]}
                                    onValueChange={(value) => setDirectness(value[0])}
                                />
                            </div>

                            <div>
                                <Label className="text-base">Warmth</Label>
                                <Slider
                                    min={0}
                                    max={5}
                                    step={1}
                                    value={[warmth]}
                                    onValueChange={(value) => setWarmth(value[0])}
                                />
                            </div>

                            <div>
                                <Label className="text-base">Challenge</Label>
                                <Slider
                                    min={0}
                                    max={5}
                                    step={1}
                                    value={[challenge]}
                                    onValueChange={(value) => setChallenge(value[0])}
                                />
                            </div>
                        </div>
                    </div>


                    <Separator className="my-6" />

                    {/* Local Lingo Moe Setting */}
                        <div className="space-y-5">
                            <h3 className="text-lg font-medium flex items-center">
                                <Languages className="mr-3 h-5 w-5" /> Be Local
                            </h3>

                            <div className="flex items-center justify-between px-2">
                                <div className="space-y-2">
                                    <Label htmlFor="local-lingo" className="text-base">Be Local</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Uses your location to adapt to the local accent in your area.<br />
                                    </p>
                                </div>
                                <Switch
                                    id="local-lingo"
                                    checked={useLocalLingo}
                                    onCheckedChange={toggleLocalLingo}
                                />
                            </div>
                        </div>
    
                </div>

                
             
                <div className="border-t pt-3 text-xs text-gray-700 text-center">
                    Settings are automatically saved.

                    
                </div>

                <div className="flex items-center justify-center mb-3">
                    <div className="flex items-center justify-center mb-3">
                        <Button
                            variant="ghost"
                            className="mt-1 rounded-full text-red-500"
                            onClick={() => setShowDeleteConfirmation(true)}
                        >
                            Delete Account
                        </Button>
                    </div>

                    {/* Confirmation Dialog */}
                    <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Delete Account</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete your account? This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="flex gap-2">
                                <Button variant="ghost" onClick={() => setShowDeleteConfirmation(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDeleteAccount}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Deleting...
                                        </>
                                    ) : (
                                        "Yes, Delete My Account"
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>


            </SheetContent>
        </Sheet>
    );
}
