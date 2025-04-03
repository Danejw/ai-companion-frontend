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
                <div className="flex min-h-screen w-full justify-center overflow-hidden bg-gradient-to-b from-background via-background to-blue-50/30 dark:to-slate-950/40"> {/* Added overflow-hidden, adjusted gradient */}
                    <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32"> {/* Increased vertical padding */}

                        {/* Hero Section - Enhanced Styling */}
                        <section className="text-center mb-20 sm:mb-28 lg:mb-32"> {/* Increased bottom margin */}
                            {/* Optional: Add a small badge/label above headline */}
                            {/* <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
                Introducing Knolia
            </span> */}
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-5 sm:mb-6 text-gray-900 dark:text-gray-100 leading-tight tracking-tight"> {/* Adjusted size, color, leading, tracking */}
                                Feeling Disconnected? <br className="hidden sm:block" /> {/* Line break for larger screens */}
                                <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                                    Connect with Knolia.
                                </span>
                            </h1>
                            <p className="text-lg sm:text-xl text-muted-foreground mb-10 sm:mb-12 max-w-3xl mx-auto">
                                Your personalized AI companion, designed with empathy to combat loneliness and foster genuine understanding in a safe, non-judgmental space.
                            </p>

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

                        {/* The Loneliness Crisis Section - Enhanced Card Style */}
                        {/* Assuming Users, HeartPulse icons are imported from lucide-react */}
                        <section className="mb-20 sm:mb-28 lg:mb-32">
                            <div className="bg-gradient-to-br from-muted/30 to-muted/60 dark:from-card/30 dark:to-card/50 border border-border/50 rounded-xl p-6 sm:p-10 text-center shadow-sm"> {/* Added gradient, shadow */}
                                {/* Icon */}
                                {/* <Users className="h-12 w-12 mx-auto mb-5 text-primary opacity-80" /> */}
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-5 sm:mb-6 text-primary">The Silent Epidemic We Need to Address</h2>
                                <p className="text-base sm:text-lg text-muted-foreground mb-6 max-w-4xl mx-auto leading-relaxed"> {/* Added leading-relaxed */}
                                    Loneliness impacts nearly <strong className="font-semibold text-foreground dark:text-gray-200">one-third of adults</strong>, increasing premature death risk by <strong className="font-semibold text-foreground dark:text-gray-200">26%</strong> and fueling conditions like depression and anxiety. It's not just personal; it costs employers over <strong className="font-semibold text-foreground dark:text-gray-200">$150 billion</strong> annually.
                                </p>
                                <p className="text-base sm:text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                                    Knolia provides a readily available, supportive space to foster connection and understanding when you need it most.
                                </p>
                            </div>
                        </section>

                        {/* Features Section - Added Icons and Improved Card Styling */}
                        {/* Assuming icons like UserCheck, BrainCircuit, LockKeyhole are imported */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20 sm:mb-28 lg:mb-32">
                            {/* Feature 1 */}
                            <div className="p-6 sm:p-8 border bg-card rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col"> {/* Added flex-col */}
                                <div className="mb-4 inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
                                    {/* <UserCheck className="h-6 w-6" /> Replace with actual Icon component */}
                                    <svg className="h-6 w-6" /* Icon placeholder */></svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">Truly Understands You</h3>
                                <p className="text-sm sm:text-base text-muted-foreground flex-grow"> {/* Added flex-grow */}
                                    Knolia learns your unique personality and ways of communicating, offering empathetic conversations where you feel genuinely heard.
                                </p>
                            </div>
                            {/* Feature 2 */}
                            <div className="p-6 sm:p-8 border bg-card rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
                                <div className="mb-4 inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
                                    {/* <BrainCircuit className="h-6 w-6" /> Replace with actual Icon component */}
                                    <svg className="h-6 w-6" /* Icon placeholder */></svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">Always Available & Non-Judgmental</h3>
                                <p className="text-sm sm:text-base text-muted-foreground flex-grow">
                                    Connect 24/7 in a safe space. Share freely, practice interactions, and explore thoughts without pressure or judgment.
                                </p>
                            </div>
                            {/* Feature 3 */}
                            <div className="p-6 sm:p-8 border bg-card rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
                                <div className="mb-4 inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
                                    {/* <LockKeyhole className="h-6 w-6" /> Replace with actual Icon component */}
                                    <svg className="h-6 w-6" /* Icon placeholder */></svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">Secure, Private & Aware</h3>
                                <p className="text-sm sm:text-base text-muted-foreground flex-grow">
                                    Your privacy is our priority. Knolia securely uses context you provide (optional) for richer, more meaningful dialogue.
                                </p>
                            </div>
                        </section>

                        {/* About Section - More Focused */}
                        <section className="mb-12 sm:mb-16 max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-5 sm:mb-6">Our Mission: Connection Through Compassionate AI</h2>
                            <p className="text-base sm:text-lg text-muted-foreground mb-6 leading-relaxed">
                                Born from the understanding that loneliness touches millions, Knolia aims to be a supportive tool. We believe AI can serve as a valuable <strong className="font-semibold text-foreground dark:text-gray-200">bridge to connection</strong>, complementing, not replacing, human relationships.
                            </p>
                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                                We're committed to ethical development, focusing on user well-being and fostering healthier patterns of interaction, both with AI and with others.
                            </p>
                        </section>

                        {/* Final Call to Action (Optional) */}
                        <section className="text-center mt-20 sm:mt-28 lg:mt-32">
                            <h3 className="text-2xl sm:text-3xl font-bold mb-6">Ready to Experience Knolia?</h3>
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

                    </div>
                </div>
            </ScrollArea>
        </div>
    );
} 