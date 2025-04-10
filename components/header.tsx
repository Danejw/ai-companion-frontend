'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/store';
import { History, CreditCard, LogIn, LogOut, Loader2, Brain, Info, Settings } from 'lucide-react';
import AnimatedBlobLogo from '@/components/Logo';

export default function Header() {
    const { data: session, status } = useSession();
    const toggleAuthOverlay = useUIStore((state) => state.toggleAuthOverlay);
    const toggleCreditsOverlay = useUIStore((state) => state.toggleCreditsOverlay);
    const toggleSettingsOverlay = useUIStore((state) => state.toggleSettingsOverlay);
    const toggleHistoryOverlay = useUIStore((state) => state.toggleHistoryOverlay);
    const toggleKnowledgeOverlay = useUIStore((state) => state.toggleKnowledgeOverlay);
    const toggleInfoOverlay = useUIStore((state) => state.toggleInfoOverlay);

    return (
        <header className="sticky top-0 z-10 w-screenf border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center pl-6 pr-6">
                <div className="mr-4 flex ">
                    <Link href="/" className="mr-2 flex items-center space-x-2">
                        <AnimatedBlobLogo />
                        <span className="font-bold text-xl text-gray-700">Knolia</span>
                    </Link>

                    {/*Info button with environment-specific colors*/}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleInfoOverlay(true)}
                        title="About & Information"
                    >
                        <Info 
                            className={`h-4 w-4 ${
                                process.env.NEXT_PUBLIC_ENV === 'production' 
                                ? "text-[#f472b6]" 
                                : "text-[#818cf8]"
                            }`} 
                        />
                    </Button>

                </div>
                <div className="flex flex-1 items-center justify-end space-x-1 sm:space-x-2"> {/* Added space-x-1 for mobile */}


                    {/* --- Loading State --- */}
                    {status === 'loading' && (
                        <Button variant="ghost" size="sm" disabled>
                            <Loader2 className="h-4 w-4 animate-spin" />
                        </Button>
                    )}

                    {/* --- Unauthenticated State --- */}
                    {status === 'unauthenticated' && (
                        // Single button to open the Auth Overlay
                        <Button variant="outline" size="sm" onClick={() => toggleAuthOverlay(true)}>
                            <LogIn className="mr-1 h-4 w-4 sm:mr-2" /> {/* Adjusted margin for mobile */}
                            <span className="hidden sm:inline">Login / Sign Up</span> {/* Hide text on mobile */}
                            <span className="sm:hidden">Login</span> {/* Show shorter text on mobile */}
                        </Button>
                    )}

                    {/* --- Authenticated State --- */}
                    {status === 'authenticated' && (
                        <>
                            {/*Welcome message hidden on small screens */}
                            <span className="text-sm text-muted-foreground hidden sm:inline-block mr-2">
                                {session?.user?.name || session?.user?.email}
                            </span>

                            {/* --- Overlay Trigger Buttons (Icon only) --- */}
                            <Button variant="ghost" size="icon" onClick={() => toggleHistoryOverlay(true)} title="Conversation History">
                                <History className="h-4 w-4" />
                            </Button>

                            <Button variant="ghost" size="icon" onClick={() => toggleKnowledgeOverlay(true)} title="Learned Knowledge">
                                <Brain className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    console.log('--- DEBUG: Credits Button Clicked ---');
                                    toggleCreditsOverlay(true);
                                }}
                                title="Credits"
                            >
                                <CreditCard className="h-4 w-4" />
                            </Button>
                            
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleSettingsOverlay(true)}
                                title="Settings"
                            >
                                <Settings className="h-4 w-4" />
                            </Button>

                            {/* --- Logout Button (Icon only) --- */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => signOut({ callbackUrl: '/' })} // Redirect home
                                title="Logout"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}