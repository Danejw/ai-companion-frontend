'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';


interface InfoMBTIOverlayProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function InfoMBTIOverlay({ open, onOpenChange }: InfoMBTIOverlayProps) {
    if (!open) return null;
    
    return (
        <div className="fixed inset-0 bg-background z-[25] overflow-hidden ">
            <Button
                variant="ghost"
                className="absolute right-20 top-20 sm:right-20 sm:top-20 z-[25]"
                onClick={() => onOpenChange(false)}
            >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
            
            
            <ScrollArea className="h-full w-full">
                <div className="flex min-h-screen w-full justify-center overflow-hidden bg-gradient-to-b from-background via-background to-blue-50/30 dark:to-slate-950/40"> 
                    <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32"> 

                        {/* Hero Section */}
                        <section className="text-center mb-16 sm:mb-20 lg:mb-24">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 dark:text-gray-100 leading-tight tracking-tight">
                                Understanding MBTI Personality Types
                            </h1>
                            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                                The Myers-Briggs Type Indicator (MBTI) is a personality assessment that helps you understand your preferences for how you interact with the world, process information, make decisions, and structure your life.
                            </p>
                        </section>

                        {/* Four Dichotomies Section */}
                        <section className="mb-16 sm:mb-24">
                            <h2 className="text-3xl font-bold mb-8 text-center">The Four MBTI Dichotomies</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="text-xl font-semibold mb-3 flex items-center">
                                        <span className="flex-1">Extraversion (E)</span>
                                        <span className="text-primary">vs</span>
                                        <span className="flex-1 text-right">Introversion (I)</span>
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Where you focus your attention and get your energy. Extraverts are energized by the outer world of people and activities, while Introverts draw energy from their inner world of ideas and experiences.
                                    </p>
                                </div>

                                <div className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="text-xl font-semibold mb-3 flex items-center">
                                        <span className="flex-1">Sensing (S)</span>
                                        <span className="text-primary">vs</span>
                                        <span className="flex-1 text-right">Intuition (N)</span>
                                    </h3>
                                    <p className="text-muted-foreground">
                                        How you take in information. Sensing types focus on concrete facts and details through their five senses, while Intuitive types prefer to focus on patterns, possibilities, and future implications.
                                    </p>
                                </div>

                                <div className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="text-xl font-semibold mb-3 flex items-center">
                                        <span className="flex-1">Thinking (T)</span>
                                        <span className="text-primary">vs</span>
                                        <span className="flex-1 text-right">Feeling (F)</span>
                                    </h3>
                                    <p className="text-muted-foreground">
                                        How you make decisions. Thinking types decide based on logical analysis and objective criteria, while Feeling types prioritize values, harmony, and the impact on people.
                                    </p>
                                </div>

                                <div className="p-6 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="text-xl font-semibold mb-3 flex items-center">
                                        <span className="flex-1">Judging (J)</span>
                                        <span className="text-primary">vs</span>
                                        <span className="flex-1 text-right">Perceiving (P)</span>
                                    </h3>
                                    <p className="text-muted-foreground">
                                        How you organize your world. Judging types prefer structure, planning, and closure, while Perceiving types value flexibility, spontaneity, and keeping options open.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 16 Personality Types */}
                        <section className="mb-16 sm:mb-24">
                            <h2 className="text-3xl font-bold mb-8 text-center">The 16 MBTI Personality Types</h2>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { type: "ISTJ", name: "The Inspector", traits: "Practical, detail-oriented, reliable" },
                                    { type: "ISFJ", name: "The Protector", traits: "Caring, loyal, traditional" },
                                    { type: "INFJ", name: "The Counselor", traits: "Insightful, principled, complex" },
                                    { type: "INTJ", name: "The Mastermind", traits: "Strategic, independent, visionary" },
                                    { type: "ISTP", name: "The Craftsman", traits: "Adaptable, observant, practical" },
                                    { type: "ISFP", name: "The Composer", traits: "Sensitive, creative, in-the-moment" },
                                    { type: "INFP", name: "The Healer", traits: "Idealistic, compassionate, individualistic" },
                                    { type: "INTP", name: "The Architect", traits: "Logical, innovative, analytical" },
                                    { type: "ESTP", name: "The Dynamo", traits: "Energetic, pragmatic, spontaneous" },
                                    { type: "ESFP", name: "The Performer", traits: "Enthusiastic, friendly, fun-loving" },
                                    { type: "ENFP", name: "The Champion", traits: "Imaginative, passionate, people-oriented" },
                                    { type: "ENTP", name: "The Visionary", traits: "Inventive, curious, adaptable" },
                                    { type: "ESTJ", name: "The Supervisor", traits: "Organized, practical, responsible" },
                                    { type: "ESFJ", name: "The Provider", traits: "Warm, cooperative, structured" },
                                    { type: "ENFJ", name: "The Teacher", traits: "Charismatic, empathetic, organized" },
                                    { type: "ENTJ", name: "The Commander", traits: "Decisive, strategic, efficient" }
                                ].map(personality => (
                                    <div key={personality.type} className="p-4 border rounded-lg bg-card text-center hover:shadow-md transition-shadow">
                                        <h3 className="text-xl font-bold mb-1">{personality.type}</h3>
                                        <h4 className="font-medium text-muted-foreground mb-2">{personality.name}</h4>
                                        <p className="text-sm">{personality.traits}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Usage Notes */}
                        <section className="mb-16 sm:mb-20">
                            <h2 className="text-3xl font-bold mb-6 text-center">Important Considerations</h2>
                            <div className="bg-card border rounded-lg p-6 max-w-3xl mx-auto">
                                <ul className="space-y-3">
                                    <li className="flex gap-2">
                                        <span className="text-primary font-bold">•</span>
                                        <span>MBTI is a preference indicator, not a measure of ability or character.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-primary font-bold">•</span>
                                        <span>All types have unique strengths and challenges - no type is better than others.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-primary font-bold">•</span>
                                        <span>Your AI companion analyzes your communication patterns to estimate your MBTI preferences.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-primary font-bold">•</span>
                                        <span>This assessment is for educational purposes and should not replace professional psychological guidance.</span>
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