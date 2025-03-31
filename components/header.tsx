'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/store';
import { History, Settings, CreditCard, LogIn, LogOut, Loader2 } from 'lucide-react';






export default function Header() {
    const { data: session, status } = useSession();
    const toggleAuthOverlay = useUIStore((state) => state.toggleAuthOverlay);
    const toggleCreditsOverlay = useUIStore((state) => state.toggleCreditsOverlay);
    const toggleSettingsOverlay = useUIStore((state) => state.toggleSettingsOverlay);
    const toggleHistoryOverlay = useUIStore((state) => state.toggleHistoryOverlay);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 flex"> {/* Changed md:flex to flex */}
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        {/* <YourLogoIcon /> */}
                        <span className="font-bold">AI Companion</span>
                    </Link>
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
                            {/* Optional: Welcome message hidden on small screens */}
                            {/* <span className="text-sm text-muted-foreground hidden sm:inline-block mr-2">
                                {session?.user?.name || session?.user?.email}
                            </span> */}

                            {/* --- Overlay Trigger Buttons (Icon only) --- */}
                            <Button variant="ghost" size="icon" onClick={toggleHistoryOverlay} title="Conversation History">
                                <History className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    console.log('--- DEBUG: Credits Button Clicked ---'); // <-- ADD THIS LINE
                                    toggleCreditsOverlay();
                                }}
                                title="Credits"
                            >
                                <CreditCard className="h-4 w-4" />
                            </Button>
                            
                            <Button variant="ghost" size="icon" onClick={toggleSettingsOverlay} title="Settings">
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