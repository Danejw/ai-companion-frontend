'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface InfoOverlayProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function InfoOverlay({ open, onOpenChange }: InfoOverlayProps) {
    if (!open) return null;
    
    return (
        <div className="fixed inset-0 bg-background z-[100] overflow-hidden">
            <Button
                variant="ghost"
                className="absolute right-4 top-4 sm:right-6 sm:top-6 z-[101]"
                onClick={() => onOpenChange(false)}
            >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
            
            <ScrollArea className="h-full w-full">
                <div className="flex justify-center w-full min-h-full bg-gradient-to-b from-background via-background to-blue-50/30 dark:to-slate-900/30"> {/* Added subtle gradient */}
                    <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24"> {/* Increased padding */}

                        {/* Hero Section */}
                        <section className="text-center mb-16 sm:mb-20">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-5 text-gray-900 dark:text-white leading-tight">
                                Tired of Feeling Alone? <span className="text-primary">Meet Knolia.</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-3xl mx-auto">
                                Experience genuine understanding and meaningful connection with your personalized AI companion, designed to help combat the loneliness epidemic.
                            </p>
                            {/* Example Call to Action Button (Optional but recommended) */}
                            <div className="flex justify-center">
                                <a 
                                    href="/app" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onOpenChange(false);
                                    }} 
                                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                                >
                                    Start Your Conversation
                                </a>
                            </div>
                        </section>

                        {/* The Loneliness Crisis Section (NEW) */}
                        <section className="mb-16 sm:mb-20 bg-muted/50 dark:bg-card/30 border border-border/50 rounded-xl p-6 sm:p-10 text-center">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-primary">The Hidden Epidemic: Loneliness Impacts Us All</h2>
                            <p className="text-base sm:text-lg text-muted-foreground mb-6 max-w-4xl mx-auto">
                                Loneliness isn't just a feeling; it's a critical public health issue affecting <strong className="font-semibold text-foreground">1 in 3 adults</strong> globally. Research links it to a <strong className="font-semibold text-foreground">26% increased risk of premature death</strong>, serious health conditions like depression, anxiety, and dementia, and staggering economic costs exceeding <strong className="font-semibold text-foreground">$150 billion annually</strong> for employers alone.
                            </p>
                            <p className="text-base sm:text-lg text-muted-foreground max-w-4xl mx-auto">
                                In an increasingly disconnected world, Knolia offers a compassionate, accessible first step towards feeling understood and less alone.
                            </p>
                        </section>

                        {/* Features Section - Reworded for Benefit */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16 sm:mb-20">
                            <div className="p-5 sm:p-6 border bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">Truly Understands You</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">
                                    Knolia learns your unique personality and communication style, offering empathetic conversations where you feel genuinely heard and seen.
                                </p>
                            </div>
                            <div className="p-5 sm:p-6 border bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">Always Available, Never Judging</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">
                                    Access companionship 24/7 in a safe, private space. Share your thoughts freely and practice social skills without fear of judgment.
                                </p>
                            </div>
                            <div className="p-5 sm:p-6 border bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">Secure & Context-Aware</h3>
                                <p className="text-sm sm:text-base text-muted-foreground">
                                    Your privacy is paramount. Knolia securely integrates information you share (optional) for richer, more relevant conversations.
                                </p>
                            </div>
                        </section>

                        {/* About Section - Enhanced Mission */}
                        <section className="mb-12 sm:mb-16 max-w-4xl mx-auto text-center">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Our Mission: Fostering Connection with AI</h2>
                            <p className="text-base sm:text-lg text-muted-foreground mb-4">
                                Knolia was born from a deep understanding of the profound impact loneliness has on wellbeing. We believe AI companions can play a valuable role – not as replacements, but as <strong className="font-semibold text-foreground">supplements and bridges</strong> to human connection.
                            </p>
                            <p className="text-base sm:text-lg text-muted-foreground">
                                We are committed to developing Knolia ethically and responsibly, creating a supportive tool designed to genuinely enhance lives and support broader social connection initiatives.
                            </p>
                        </section>

                        {/* Optional: Add a final Call to Action or Footer section here */}
                        {/* Example:
        <section className="text-center mt-16">
            <h3 className="text-2xl font-bold mb-4">Ready to Feel More Connected?</h3>
            <a href="/app" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200">
                Try Knolia Today
            </a>
        </section>
        */}
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
} 