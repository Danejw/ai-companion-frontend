'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Brain, Users, Eye, Heart, Calendar } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Background from '@/components/Background';

interface InfoMBTIOverlayProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function InfoMBTIOverlay({ open, onOpenChange }: InfoMBTIOverlayProps) {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        if (open) {
            // Small delay for animation to work properly
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
        }
    }, [open]);
    
    // Handle closing with animation
    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onOpenChange(false), 300); // Match transition duration
    };
    
    if (!open) return null;
    
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[25] flex items-end justify-center"
             onClick={handleClose}>
            <div 
                className={cn(
                    "w-full max-w-7xl h-[90vh] bg-background rounded-t-2xl overflow-hidden shadow-lg transition-all duration-300 ease-out",
                    isVisible ? "translate-y-0" : "translate-y-full"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <Button
                    variant="ghost"
                    className="absolute right-6 top-6 z-[30]"
                    onClick={handleClose}
                >
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
                
                <ScrollArea className="h-full w-full">
                    <div className="flex min-h-full w-full justify-center">
                        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 pt-20">

                            <Background/>

                            
                            {/* Hero Section - Enhanced with more MBTI information */}
                            <section className="text-center mb-12">
                                <div className="mb-6 flex justify-center">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Brain className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                                    </div>
                                </div>
                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-gray-100 leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500 dark:from-primary dark:to-blue-400">
                                    Understanding MBTI Personality Types
                                </h1>
                                <p className="text-lg sm:text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">
                                    The Myers-Briggs Type Indicator (MBTI) is one of the most widely used personality assessment tools in the world, 
                                    with approximately two million people completing the assessment annually.
                                </p>
                                <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                                    Based on Carl Jung's theory of psychological types, the MBTI helps you understand your natural preferences 
                                    for how you interact with the world, process information, make decisions, and structure your life.
                                </p>
                                <div className="flex flex-wrap justify-center gap-2 mb-2">
                                    <Badge variant="outline" className="text-sm py-1 px-3">Self-Discovery</Badge>
                                    <Badge variant="outline" className="text-sm py-1 px-3">Personality Psychology</Badge>
                                    <Badge variant="outline" className="text-sm py-1 px-3">Human Behavior</Badge>
                                </div>
                            </section>
                            
                            {/* New History Section */}
                            <section className="mb-16 px-6">
                                <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2">
                                    <span className="w-8 h-1 bg-primary rounded-full"></span>
                                    History & Background
                                    <span className="w-8 h-1 bg-primary rounded-full"></span>
                                </h2>
                                
                                <Card className="mb-8 pb-8">
                                    <CardContent className="pt-6">
                                        <div className="space-y-4">
                                            <p>
                                                The MBTI was developed by Katharine Cook Briggs and her daughter Isabel Briggs Myers during and after World War II. 
                                                They were inspired by Carl Jung's work on psychological types published in his 1921 book "Psychological Types."
                                            </p>
                                            <p>
                                                Katharine Briggs began her research into personality in 1917, and upon reading Jung's work in 1923, 
                                                recognized the alignment with her own theories. Together with her daughter Isabel, they spent decades 
                                                developing and refining the type indicator to make Jung's theories accessible and practical for everyday use.
                                            </p>
                                            <p>
                                                The MBTI is not designed to measure ability, achievement, or mental health. Instead, it focuses on identifying 
                                                natural preferences in how people perceive the world and make decisions, with the understanding that every 
                                                individual uses all eight cognitive functions to varying degrees.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>

                            {/* Four Dichotomies Section - Enhanced with more detailed information */}
                            <section className="mb-16">
                                <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2">
                                    <span className="w-8 h-1 bg-primary rounded-full"></span>
                                    The Four MBTI Dimensions
                                    <span className="w-8 h-1 bg-primary rounded-full"></span>
                                </h2>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <Card className="overflow-hidden border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all pt-6 pb-6">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="flex items-center gap-2">
                                                <Users className="w-5 h-5 text-blue-500" />
                                                Energy Source
                                            </CardTitle>
                                            <CardDescription>How you gain energy and focus attention</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex justify-between items-center">
                                                <div className="flex-1 pr-4">
                                                    <h3 className="font-semibold text-blue-600 dark:text-blue-400">Extraversion (E)</h3>
                                                    <ul className="text-sm mt-1 space-y-1">
                                                        <li>• Energized by social interaction</li>
                                                        <li>• Think out loud and process externally</li>
                                                        <li>• Broad interests, action-oriented</li>
                                                        <li>• Seek stimulation from the outer world</li>
                                                        <li>• Learn best through doing or discussing</li>
                                                    </ul>
                                                </div>
                                                <div className="w-px h-32 bg-muted"></div>
                                                <div className="flex-1 pl-4">
                                                    <h3 className="font-semibold text-blue-600 dark:text-blue-400 text-right">Introversion (I)</h3>
                                                    <ul className="text-sm mt-1 space-y-1 text-right">
                                                        <li>Energized by quiet reflection •</li>
                                                        <li>Think internally first •</li>
                                                        <li>Deep focused interests •</li>
                                                        <li>Seek stimulation from inner world •</li>
                                                        <li>Learn best through reflection •</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="overflow-hidden border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-all pt-6 pb-6">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="flex items-center gap-2">
                                                <Eye className="w-5 h-5 text-amber-500" />
                                                Information Gathering
                                            </CardTitle>
                                            <CardDescription>How you prefer to take in information</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex justify-between items-center">
                                                <div className="flex-1 pr-4">
                                                    <h3 className="font-semibold text-amber-600 dark:text-amber-400">Sensing (S)</h3>
                                                    <ul className="text-sm mt-1 space-y-1">
                                                        <li>• Focus on concrete details & facts</li>
                                                        <li>• Trust information from direct experience</li>
                                                        <li>• Practical and realistic</li>
                                                        <li>• Present-oriented</li>
                                                        <li>• Values concrete applications</li>
                                                    </ul>
                                                </div>
                                                <div className="w-px h-32 bg-muted"></div>
                                                <div className="flex-1 pl-4">
                                                    <h3 className="font-semibold text-amber-600 dark:text-amber-400 text-right">Intuition (N)</h3>
                                                    <ul className="text-sm mt-1 space-y-1 text-right">
                                                        <li>Focus on patterns & possibilities •</li>
                                                        <li>Look for meaning and connections •</li>
                                                        <li>Innovative and theoretical •</li>
                                                        <li>Future-oriented •</li>
                                                        <li>Values creative insights •</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="overflow-hidden border-l-4 border-l-rose-500 shadow-sm hover:shadow-md transition-all pt-6 pb-6">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="flex items-center gap-2">
                                                <Heart className="w-5 h-5 text-rose-500" />
                                                Decision Making
                                            </CardTitle>
                                            <CardDescription>How you make decisions and judgments</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex justify-between items-center">
                                                <div className="flex-1 pr-4">
                                                    <h3 className="font-semibold text-rose-600 dark:text-rose-400">Thinking (T)</h3>
                                                    <ul className="text-sm mt-1 space-y-1">
                                                        <li>• Logic and objective analysis</li>
                                                        <li>• Focus on principles and fairness</li>
                                                        <li>• Truth-oriented</li>
                                                        <li>• Consider cause and effect</li>
                                                        <li>• May appear impersonal or detached</li>
                                                    </ul>
                                                </div>
                                                <div className="w-px h-32 bg-muted"></div>
                                                <div className="flex-1 pl-4">
                                                    <h3 className="font-semibold text-rose-600 dark:text-rose-400 text-right">Feeling (F)</h3>
                                                    <ul className="text-sm mt-1 space-y-1 text-right">
                                                        <li>Values and personal impact •</li>
                                                        <li>Focus on harmony and compassion •</li>
                                                        <li>People-oriented •</li>
                                                        <li>Consider circumstances •</li>
                                                        <li>Empathetic and personal •</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="overflow-hidden border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-all pt-6 pb-6">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="flex items-center gap-2">
                                                <Calendar className="w-5 h-5 text-green-500" />
                                                Lifestyle
                                            </CardTitle>
                                            <CardDescription>How you organize your world and time</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex justify-between items-center">
                                                <div className="flex-1 pr-4">
                                                    <h3 className="font-semibold text-green-600 dark:text-green-400">Judging (J)</h3>
                                                    <ul className="text-sm mt-1 space-y-1">
                                                        <li>• Structured and planned</li>
                                                        <li>• Decisive and organized</li>
                                                        <li>• Prefer closure and completion</li>
                                                        <li>• Work before play mentality</li>
                                                        <li>• Goal-oriented and systematic</li>
                                                    </ul>
                                                </div>
                                                <div className="w-px h-32 bg-muted"></div>
                                                <div className="flex-1 pl-4">
                                                    <h3 className="font-semibold text-green-600 dark:text-green-400 text-right">Perceiving (P)</h3>
                                                    <ul className="text-sm mt-1 space-y-1 text-right">
                                                        <li>Flexible and adaptable •</li>
                                                        <li>Spontaneous and curious •</li>
                                                        <li>Keep options open •</li>
                                                        <li>Mix work and play •</li>
                                                        <li>Process-oriented and exploratory •</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </section>
                            
                            {/* New Cognitive Functions Section */}
                            <section className="mb-16">
                                <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2">
                                    <span className="w-8 h-1 bg-primary rounded-full"></span>
                                    Cognitive Functions
                                    <span className="w-8 h-1 bg-primary rounded-full"></span>
                                </h2>
                                
                                <Card className="mb-6">
                                    <CardContent className="pt-6">
                                        <p className="mb-4">
                                            Each MBTI type uses eight cognitive functions in a specific order (function stack). 
                                            These functions represent the different ways our minds process information and make decisions.
                                        </p>
                                    </CardContent>
                                </Card>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="border-l-4 border-l-purple-500 pt-6 pb-6">
                                        <CardHeader>
                                            <CardTitle>Perceiving Functions</CardTitle>
                                            <CardDescription>How we gather information</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div>
                                                    <h3 className="font-semibold text-purple-600 dark:text-purple-400">Extraverted Sensing (Se)</h3>
                                                    <p className="text-sm">Experiencing and noticing the physical world, focusing on immediate experiences</p>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-purple-600 dark:text-purple-400">Introverted Sensing (Si)</h3>
                                                    <p className="text-sm">Recalling past experiences, focusing on detailed information and comparing it to what is known</p>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-purple-600 dark:text-purple-400">Extraverted Intuition (Ne)</h3>
                                                    <p className="text-sm">Seeing possibilities and connections in the external world, focusing on what could be</p>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-purple-600 dark:text-purple-400">Introverted Intuition (Ni)</h3>
                                                    <p className="text-sm">Developing insights and foreseeing implications, focusing on the underlying meaning of information</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    
                                    <Card className="border-l-4 border-l-teal-500 pt-6 pb-6">
                                        <CardHeader>
                                            <CardTitle>Judging Functions</CardTitle>
                                            <CardDescription>How we make decisions</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div>
                                                    <h3 className="font-semibold text-teal-600 dark:text-teal-400">Extraverted Thinking (Te)</h3>
                                                    <p className="text-sm">Organizing and structuring the external environment, focusing on logical organization</p>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-teal-600 dark:text-teal-400">Introverted Thinking (Ti)</h3>
                                                    <p className="text-sm">Analyzing and categorizing information, focusing on logical consistency</p>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-teal-600 dark:text-teal-400">Extraverted Feeling (Fe)</h3>
                                                    <p className="text-sm">Connecting with others and making decisions based on social values, focusing on harmony</p>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-teal-600 dark:text-teal-400">Introverted Feeling (Fi)</h3>
                                                    <p className="text-sm">Evaluating information based on personal values, focusing on authenticity</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    
                                    <Card className="md:col-span-2 border-l-4 border-l-indigo-500 pt-6 pb-6">
                                        <CardHeader>
                                            <CardTitle>Function Stack</CardTitle>
                                            <CardDescription>How cognitive functions work together in each type</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <h3 className="font-semibold text-indigo-600 dark:text-indigo-400">Dominant Function</h3>
                                                    <p className="text-sm">The primary aspect of personality, most conscious and developed function</p>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-indigo-600 dark:text-indigo-400">Auxiliary Function</h3>
                                                    <p className="text-sm">Supports the dominant function and provides balance</p>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-indigo-600 dark:text-indigo-400">Tertiary Function</h3>
                                                    <p className="text-sm">Less developed than the dominant and auxiliary, but still accessible</p>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-indigo-600 dark:text-indigo-400">Inferior Function</h3>
                                                    <p className="text-sm">The least developed function, often unconscious and a source of stress</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </section>

                            {/* The 16 Types - Organized in tabs by temperament */}
                            <section className="mb-16">
                                <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2">
                                    <span className="w-8 h-1 bg-primary rounded-full"></span>
                                    The 16 MBTI Personality Types
                                    <span className="w-8 h-1 bg-primary rounded-full"></span>
                                </h2>
                                
                                <Tabs defaultValue="analysts" className="w-full">
                                    <div className="flex justify-center w-full mb-6">
                                        <TabsList className="grid grid-cols-4 bg-gray-500/20">
                                            <TabsTrigger value="analysts" className="text-xs sm:text-sm">Analysts (NT)</TabsTrigger>
                                            <TabsTrigger value="diplomats" className="text-xs sm:text-sm">Diplomats (NF)</TabsTrigger>
                                            <TabsTrigger value="sentinels" className="text-xs sm:text-sm">Sentinels (SJ)</TabsTrigger>
                                            <TabsTrigger value="explorers" className="text-xs sm:text-sm">Explorers (SP)</TabsTrigger>
                                        </TabsList>
                                    </div>
                                    
                                    <TabsContent value="analysts" className="mt-0">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {[
                                                { type: "INTJ", name: "The Architect", traits: "Strategic, innovative, independent", color: "bg-indigo-100 dark:bg-indigo-950/20", accent: "border-indigo-500" },
                                                { type: "INTP", name: "The Logician", traits: "Logical, curious, analytical", color: "bg-indigo-100 dark:bg-indigo-950/20", accent: "border-indigo-500" },
                                                { type: "ENTJ", name: "The Commander", traits: "Decisive, efficient, strategic", color: "bg-indigo-100 dark:bg-indigo-950/20", accent: "border-indigo-500" },
                                                { type: "ENTP", name: "The Debater", traits: "Innovative, argumentative, curious", color: "bg-indigo-100 dark:bg-indigo-950/20", accent: "border-indigo-500" },
                                            ].map(personality => (
                                                <PersonalityCard key={personality.type} personality={personality} />
                                            ))}
                                        </div>
                                    </TabsContent>
                                    
                                    <TabsContent value="diplomats" className="mt-0">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {[
                                                { type: "INFJ", name: "The Advocate", traits: "Insightful, principled, inspiring", color: "bg-green-100 dark:bg-green-950/20", accent: "border-green-500" },
                                                { type: "INFP", name: "The Mediator", traits: "Idealistic, compassionate, creative", color: "bg-green-100 dark:bg-green-950/20", accent: "border-green-500" },
                                                { type: "ENFJ", name: "The Protagonist", traits: "Charismatic, empathetic, inspiring", color: "bg-green-100 dark:bg-green-950/20", accent: "border-green-500" },
                                                { type: "ENFP", name: "The Campaigner", traits: "Enthusiastic, creative, sociable", color: "bg-green-100 dark:bg-green-950/20", accent: "border-green-500" },
                                            ].map(personality => (
                                                <PersonalityCard key={personality.type} personality={personality} />
                                            ))}
                                        </div>
                                    </TabsContent>
                                    
                                    <TabsContent value="sentinels" className="mt-0">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {[
                                                { type: "ISTJ", name: "The Inspector", traits: "Practical, reliable, systematic", color: "bg-blue-100 dark:bg-blue-950/20", accent: "border-blue-500" },
                                                { type: "ISFJ", name: "The Protector", traits: "Nurturing, loyal, traditional", color: "bg-blue-100 dark:bg-blue-950/20", accent: "border-blue-500" },
                                                { type: "ESTJ", name: "The Director", traits: "Organized, practical, logical", color: "bg-blue-100 dark:bg-blue-950/20", accent: "border-blue-500" },
                                                { type: "ESFJ", name: "The Caregiver", traits: "Warm, responsible, cooperative", color: "bg-blue-100 dark:bg-blue-950/20", accent: "border-blue-500" },
                                            ].map(personality => (
                                                <PersonalityCard key={personality.type} personality={personality} />
                                            ))}
                                        </div>
                                    </TabsContent>
                                    
                                    <TabsContent value="explorers" className="mt-0">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {[
                                                { type: "ISTP", name: "The Virtuoso", traits: "Practical, logical, spontaneous", color: "bg-amber-100 dark:bg-amber-950/20", accent: "border-amber-500" },
                                                { type: "ISFP", name: "The Adventurer", traits: "Artistic, sensitive, experimental", color: "bg-amber-100 dark:bg-amber-950/20", accent: "border-amber-500" },
                                                { type: "ESTP", name: "The Entrepreneur", traits: "Energetic, analytical, perceptive", color: "bg-amber-100 dark:bg-amber-950/20", accent: "border-amber-500" },
                                                { type: "ESFP", name: "The Entertainer", traits: "Enthusiastic, friendly, spontaneous", color: "bg-amber-100 dark:bg-amber-950/20", accent: "border-amber-500" },
                                            ].map(personality => (
                                                <PersonalityCard key={personality.type} personality={personality} />
                                            ))}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </section>
                            
                            {/* New Applications Section */}
                            <section className="mb-16">
                                <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2">
                                    <span className="w-8 h-1 bg-primary rounded-full"></span>
                                    Applications of MBTI
                                    <span className="w-8 h-1 bg-primary rounded-full"></span>
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="hover:shadow-md transition-all pt-6 pb-6">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                                </svg>
                                                Career Development
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="mb-3">MBTI helps individuals identify potential career paths that align with their personality preferences:</p>
                                            <ul className="space-y-1 text-sm">
                                                <li>• Identifies natural strengths and work styles</li>
                                                <li>• Suggests compatible work environments</li>
                                                <li>• Helps understand workplace communication preferences</li>
                                                <li>• Provides insight into potential career satisfaction</li>
                                            </ul>
                                        </CardContent>
                                    </Card>
                                    
                                    <Card className="hover:shadow-md transition-all pt-6 pb-6">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                                    <circle cx="9" cy="7" r="4"></circle>
                                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                                </svg>
                                                Team Building
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="mb-3">Organizations use MBTI to improve team dynamics and collaboration:</p>
                                            <ul className="space-y-1 text-sm">
                                                <li>• Appreciating diverse perspectives</li>
                                                <li>• Recognizing complementary strengths</li>
                                                <li>• Improving communication between different types</li>
                                                <li>• Distributing tasks based on natural preferences</li>
                                            </ul>
                                        </CardContent>
                                    </Card>
                                    
                                    <Card className="hover:shadow-md transition-all pt-6 pb-6">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                    <circle cx="12" cy="7" r="4"></circle>
                                                </svg>
                                                Personal Growth
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="mb-3">MBTI serves as a tool for personal development by helping individuals:</p>
                                            <ul className="space-y-1 text-sm">
                                                <li>• Gain self-awareness about preferences</li>
                                                <li>• Recognize potential blind spots</li>
                                                <li>• Understand stress reactions</li>
                                                <li>• Develop strategies to adapt to different situations</li>
                                            </ul>
                                        </CardContent>
                                    </Card>
                                    
                                    <Card className="hover:shadow-md transition-all pt-6 pb-6">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M8 19v-6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v6"></path>
                                                    <path d="M11 13V5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v8"></path>
                                                    <path d="M4 15h4"></path>
                                                    <path d="M4 11h2"></path>
                                                    <path d="M4 7h4"></path>
                                                    <rect x="2" y="3" width="20" height="18" rx="2"></rect>
                                                </svg>
                                                Education
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="mb-3">MBTI can enhance educational experiences:</p>
                                            <ul className="space-y-1 text-sm">
                                                <li>• Understanding different learning styles</li>
                                                <li>• Adapting teaching methods to diverse preferences</li>
                                                <li>• Helping students recognize their natural learning patterns</li>
                                                <li>• Improving group project dynamics</li>
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </div>
                            </section>

                            {/* Important Notes */}
                            <section className="mb-12">
                                <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2">
                                    <span className="w-8 h-1 bg-primary rounded-full"></span>
                                    Important Considerations
                                    <span className="w-8 h-1 bg-primary rounded-full"></span>
                                </h2>
                                <div className="bg-white border rounded-lg p-6 max-w-3xl mx-auto pt-6 pb-6">
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 min-w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                                <span className="text-sm font-bold">1</span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">Preferences, Not Abilities</h3>
                                                <p className="text-muted-foreground">MBTI reveals natural preferences, not skills or capabilities. Every type can excel in any field.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 min-w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                                <span className="text-sm font-bold">2</span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">Equal Value</h3>
                                                <p className="text-muted-foreground">All types have unique strengths and contribute differently. No type is inherently better than others.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 min-w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                                <span className="text-sm font-bold">3</span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">Type Development</h3>
                                                <p className="text-muted-foreground">Type development is a lifelong process. While we naturally prefer certain functions, psychological health involves developing all functions to some degree.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 min-w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                                <span className="text-sm font-bold">4</span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">Educational Tool</h3>
                                                <p className="text-muted-foreground">This assessment is for educational purposes and should not replace professional psychological guidance.</p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 min-w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                                <span className="text-sm font-bold">5</span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">Dynamic Nature</h3>
                                                <p className="text-muted-foreground">While core preferences tend to remain stable, expression of type may evolve throughout life as people develop and grow.</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </section>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}

// Helper component for personality type cards
function PersonalityCard({ personality }: { personality: { type: string; name: string; traits: string; color: string; accent: string } }) {
    return (
        <div className={`p-4 border-l-4 ${personality.accent} rounded-lg ${personality.color} hover:shadow-md transition-all`}>
            <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold">{personality.type}</h3>
                <Badge variant="outline" className="text-xs">{personality.type.split('').join('-')}</Badge>
            </div>
            <h4 className="font-medium mb-2">{personality.name}</h4>
            <p className="text-sm text-muted-foreground">{personality.traits}</p>
        </div>
    );
} 