'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { BrainCircuit, LockKeyhole, UserCheck, Users, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import Background from '../Background';

interface InfoOverlayProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function InfoOverlay({ open, onOpenChange }: InfoOverlayProps) {
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[25] flex items-end justify-center"
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
                    className="absolute right-6 top-6 z-[30] hover:bg-accent/20 transition-colors"
                    onClick={handleClose}
                >
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
                
                <ScrollArea className="h-full w-full">




                    <div className="flex min-h-full w-full justify-center bg-gradient-to-b from-background via-background to-blue-50/30 dark:to-slate-950/60">
                        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">

                            <Background/>

                            {/* Hero Section - Enhanced with more dynamic styling */}
                            <section className="relative text-center py-20 pt-24 mb-12 sm:mb-16 lg:mb-20 overflow-hidden rounded-b-3xl bg-gradient-to-b from-background to-blue-50/10 dark:to-slate-900/20">
                                {/* Decorative background elements */}
                                <div className="absolute inset-0 -z-10 overflow-hidden">
                                    <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl opacity-60 animate-drift1"></div>
                                    <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent/10 rounded-full filter blur-3xl opacity-50 animate-drift2"></div>
                                </div>
                                
                                <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider text-primary/90 uppercase bg-accent/30 rounded-full shadow-sm animate-float">
                                    Introducing Knolia
                                </span>
                                
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 text-gray-900 dark:text-gray-100 leading-tight tracking-tight">
                                    Feeling Disconnected? <br className="hidden sm:block" />
                                    <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent animate-bg-shine">
                                        Connect with Knolia.
                                    </span>
                                </h1>
                                
                                <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
                                    Your personalized AI companion, designed with empathy to combat loneliness and foster genuine understanding in a safe, non-judgmental space.
                                </p>

                                <div className="flex justify-center">
                                    <a
                                        href="/app"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleClose();
                                        }}
                                        className="relative inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-xl shadow-md text-white bg-accent hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 overflow-hidden group"
                                    >
                                        <span className="relative z-10">Start Your Conversation</span>
                                        <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                    </a>
                                </div>
                            </section>

                            {/* The Loneliness Crisis Section - More modern card style with distinctive background */}
                            <section className="py-16 sm:py-24 mb-12 sm:mb-16 lg:mb-20 relative bg-gradient-to-b from-blue-50/30 to-purple-50/20 dark:from-slate-900/40 dark:to-slate-900/20 rounded-3xl px-4 sm:px-8">
                                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl transform -rotate-1 scale-105"></div>
                                <div className="bg-gradient-to-br from-card/80 to-background/90 dark:from-card/40 dark:to-background/60 border border-border/50 rounded-xl p-8 sm:p-12 text-center shadow-lg backdrop-blur-sm">
                                    {/* Icon with enhanced styling */}
                                    <div className="flex justify-center mb-6">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl transform scale-150 animate-pulse-glow"></div>
                                            <div className="relative bg-gradient-to-br from-primary/20 to-accent/20 p-4 rounded-full">
                                                <Users className="h-12 w-12 text-primary" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                        The Silent Epidemic We Need to Address
                                    </h2>
                                    
                                    <p className="text-base sm:text-lg text-muted-foreground mb-6 max-w-4xl mx-auto leading-relaxed"> 
                                        Loneliness impacts nearly <strong className="font-semibold text-foreground dark:text-gray-200">one-third of adults</strong>, increasing premature death risk by <strong className="font-semibold text-foreground dark:text-gray-200">26%</strong> and fueling conditions like depression and anxiety. It&apos;s not just personal; it costs employers over <strong className="font-semibold text-foreground dark:text-gray-200">$150 billion</strong> annually.
                                    </p>
                                    
                                    <p className="text-base sm:text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                                        Knolia provides a readily available, supportive space to foster connection and understanding when you need it most.
                                    </p>
                                </div>
                            </section>

                            {/* Features Section - Enhanced with distinct background and hover effects */}
                            <section className="py-16 sm:py-24 mb-12 sm:mb-16 lg:mb-20 bg-gradient-to-b from-purple-50/20 to-blue-50/30 dark:from-slate-900/20 dark:to-slate-900/40 rounded-3xl px-4 sm:px-8">
                                <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent animate-bg-shine">
                                    Key Benefits
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                                    {/* Feature 1 */}
                                    <div className="p-6 sm:p-8 border bg-card/60 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-1 group">
                                        <div className="mb-5 inline-flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-primary group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300 animate-float">
                                            <UserCheck className="h-7 w-7" />
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">Truly Understands You</h3>
                                        <p className="text-sm sm:text-base text-muted-foreground flex-grow">
                                            Knolia learns your unique personality and ways of communicating, offering empathetic conversations where you feel genuinely heard.
                                        </p>
                                    </div>
                                    
                                    {/* Feature 2 */}
                                    <div className="p-6 sm:p-8 border bg-card/60 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-1 group">
                                        <div className="mb-5 inline-flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-primary group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300 animate-float" style={{ animationDelay: "0.5s" }}>
                                            <BrainCircuit className="h-7 w-7" />
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">Always Available & Non-Judgmental</h3>
                                        <p className="text-sm sm:text-base text-muted-foreground flex-grow">
                                            Connect 24/7 in a safe space. Share freely, practice interactions, and explore thoughts without pressure or judgment.
                                        </p>
                                    </div>
                                    
                                    {/* Feature 3 */}
                                    <div className="p-6 sm:p-8 border bg-card/60 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col transform hover:-translate-y-1 group">
                                        <div className="mb-5 inline-flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-primary group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300 animate-float" style={{ animationDelay: "1s" }}>
                                            <LockKeyhole className="h-7 w-7" />
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-semibold mb-3 text-foreground">Secure, Private & Aware</h3>
                                        <p className="text-sm sm:text-base text-muted-foreground flex-grow">
                                            Your privacy is our priority. Knolia securely uses context you provide (optional) for richer, more meaningful dialogue.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* About Section - Enhanced with distinct background styling */}
                            <section className="py-16 sm:py-24 mb-12 sm:mb-16 lg:mb-20 bg-gradient-to-b from-blue-50/30 to-blue-50/10 dark:from-slate-900/40 dark:to-slate-900/20 rounded-3xl px-4 sm:px-8 relative">
                                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-accent/5 to-primary/5 rounded-3xl transform rotate-1 scale-105"></div>
                                <div className="bg-gradient-to-br from-card/70 to-background/80 backdrop-blur-sm border border-border/40 rounded-xl p-8 sm:p-12 max-w-4xl mx-auto text-center shadow-lg">
                                    <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent animate-bg-shine">
                                        Our Mission: Connection Through Compassionate AI
                                    </h2>
                                    <p className="text-base sm:text-lg text-muted-foreground mb-6 leading-relaxed">
                                        Born from the understanding that loneliness touches millions, Knolia aims to be a supportive tool. We believe AI can serve as a valuable <strong className="font-semibold text-foreground dark:text-gray-200">bridge to connection</strong>, complementing, not replacing, human relationships.
                                    </p>
                                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                                        We&apos;re committed to ethical development, focusing on user well-being and fostering healthier patterns of interaction, both with AI and with others.
                                    </p>
                                </div>
                            </section>

                            {/* Final Call to Action - Enhanced with animation and gradient */}
                            <section className="py-16 sm:py-20 mb-10 relative bg-gradient-to-b from-purple-50/10 to-blue-50/30 dark:from-slate-900/20 dark:to-slate-900/40 rounded-t-3xl px-4 sm:px-8 text-center">
                                <div className="absolute inset-0 -z-10 overflow-hidden">
                                    <div className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 bg-accent/10 rounded-full filter blur-3xl opacity-60"></div>
                                </div>
                                
                                <h3 className="text-2xl sm:text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-bg-shine">
                                    Ready to Experience Knolia?
                                </h3>
                                
                                <div className="flex justify-center">
                                    <a
                                        href="/app"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleClose();
                                        }}
                                        className="relative inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-xl shadow-md text-white bg-accent hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 overflow-hidden group"
                                    >
                                        <span className="relative z-10">Start Your Conversation</span>
                                        <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                    </a>
                                </div>
                            </section>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
} 