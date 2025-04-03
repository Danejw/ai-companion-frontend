'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';


interface InfoOCEANOverlayProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function InfoOCEANOverlay({ open, onOpenChange }: InfoOCEANOverlayProps) {
    if (!open) return null;
    
    return (
        <div className="fixed inset-0 bg-background z-[25] overflow-hidden">

            <Button
                variant="ghost"
                className="absolute right-6 top-6 sm:right-6 sm:top-6 z-[6]"
                onClick={() => onOpenChange(false)}
            >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>

            <ScrollArea className="h-full w-full">
                <div className="flex min-h-screen w-full justify-center bg-gradient-to-b from-background  via-background to-blue-50/30 dark:to-slate-950/40">
                    <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32 pt-24">

                        {/* Hero Section - Enhanced Styling */}
                        <section className="text-center mb-16 sm:mb-20 lg:mb-24">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-5 sm:mb-6 text-gray-900 dark:text-gray-100 leading-tight tracking-tight">
                                Understanding OCEAN Personality Traits
                            </h1>
                            <p className="text-lg sm:text-xl text-muted-foreground mb-10 sm:mb-12 max-w-3xl mx-auto">
                                The OCEAN model, also known as the Big Five Personality Traits, helps understand personality through five key dimensions.
                            </p>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                            {[
                                {
                                    title: "Openness",
                                    description: "Appreciation for art, emotion, adventure, unusual ideas, curiosity, and variety of experience."
                                },
                                {
                                    title: "Conscientiousness",
                                    description: "Tendency to be organized and dependable, show self-discipline, act dutifully, aim for achievement, and prefer planned rather than spontaneous behavior."
                                },
                                {
                                    title: "Extraversion",
                                    description: "Energy, positive emotions, surgency, assertiveness, sociability and the tendency to seek stimulation in the company of others."
                                },
                                {
                                    title: "Agreeableness",
                                    description: "Tendency to be compassionate and cooperative rather than suspicious and antagonistic towards others."
                                },
                                {
                                    title: "Neuroticism",
                                    description: "Tendency to experience unpleasant emotions easily, such as anger, anxiety, depression, and vulnerability."
                                }
                            ].map((trait) => (
                                <div key={trait.title} className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="text-xl font-semibold mb-3">{trait.title}</h3>
                                    <p className="text-muted-foreground">{trait.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* Usage Notes */}
                        <section className="mb-16 sm:mb-20">
                            <h2 className="text-3xl font-bold mb-6 text-center">Important Considerations</h2>
                            <div className="bg-card border rounded-lg p-6 max-w-3xl mx-auto">
                                <ul className="space-y-3">
                                    <li className="flex gap-2">
                                        <span className="text-primary font-bold">•</span>
                                        <span>OCEAN is based on decades of personality research and is widely used in psychology.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-primary font-bold">•</span>
                                        <span>Each trait exists on a spectrum - there are no "good" or "bad" scores.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-primary font-bold">•</span>
                                        <span>Your AI companion analyzes your communication style to estimate your personality traits.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-primary font-bold">•</span>
                                        <span>These insights are for educational purposes and should not replace professional psychological assessment.</span>
                                    </li>
                                </ul>
                            </div>
                        </section>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
} 