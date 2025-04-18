'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/store';
import { History, CreditCard, LogIn, LogOut, Loader2, Brain, Info, Settings, Bell, Menu } from 'lucide-react';
import AnimatedBlobLogo from '@/components/Logo';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useEffect, useState } from 'react';

export default function Header() {
    const { data: session, status } = useSession();
    const toggleAuthOverlay = useUIStore((state) => state.toggleAuthOverlay);
    const toggleCreditsOverlay = useUIStore((state) => state.toggleCreditsOverlay);
    const toggleSettingsOverlay = useUIStore((state) => state.toggleSettingsOverlay);
    const toggleHistoryOverlay = useUIStore((state) => state.toggleHistoryOverlay);
    const toggleKnowledgeOverlay = useUIStore((state) => state.toggleKnowledgeOverlay);
    const toggleInfoOverlay = useUIStore((state) => state.toggleInfoOverlay);
    const toggleNotificationsOverlay = useUIStore((state) => state.toggleNotificationsOverlay);
    
    // Add state for mobile detection
    const [isMounted, setIsMounted] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    
    // Handle hydration mismatch
    useEffect(() => {
        setIsMounted(true);
    }, []);

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
                <div className="flex flex-1 items-center justify-end space-x-1 sm:space-x-2">

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
                                <span className=" text-sm text-muted-foreground mr-2">
                                    {session?.user?.name || session?.user?.email}
                                </span>

                            {/* Desktop navigation */}
                            {isMounted && isDesktop ? (
                                <>
                                    {/* --- Overlay Trigger Buttons (Icon only) --- */}
                                    <Button variant="ghost" size="icon" onClick={() => toggleHistoryOverlay(true)} title="Conversation History">
                                        <History className="h-4 w-4" />
                                    </Button>

                                    <Button variant="ghost" size="icon" onClick={() => toggleKnowledgeOverlay(true)} title="Learned Knowledge">
                                        <Brain className="h-4 w-4" />
                                    </Button>

                                    {/* --- Credits Button (Icon only) --- */}
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
                                    
                                    {/* --- Settings Button (Icon only) --- */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => toggleSettingsOverlay(true)}
                                        title="Settings"
                                    >
                                        <Settings className="h-4 w-4" />
                                    </Button>

                                    {/* --- Notifications Button (Icon only) --- */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => toggleNotificationsOverlay(true)}
                                        title="Notifications"
                                    >
                                        <Bell className="h-4 w-4" />
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
                            ) : (
                                /* Mobile hamburger menu */
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon" title="Menu">
                                            <Menu className="h-4 w-4" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-72">
                                        <div className="flex flex-col space-y-3 py-4">
                                            <div className="px-1 py-3 mb-2 border-b">
                                                <h3 className="text-sm pl-8 font-medium text-muted-foreground break-all">
                                                    {session?.user?.name || session?.user?.email}
                                                </h3>
                                            </div>
                                            
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="justify-start" 
                                                onClick={() => {
                                                    toggleHistoryOverlay(true);
                                                }}
                                            >
                                                <History className="h-4 w-4 mr-2" />
                                                Conversation History
                                            </Button>

                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="justify-start" 
                                                onClick={() => {
                                                    toggleKnowledgeOverlay(true);
                                                }}
                                            >
                                                <Brain className="h-4 w-4 mr-2" />
                                                Learned Knowledge
                                            </Button>

                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="justify-start" 
                                                onClick={() => {
                                                    console.log('--- DEBUG: Credits Button Clicked ---');
                                                    toggleCreditsOverlay(true);
                                                }}
                                            >
                                                <CreditCard className="h-4 w-4 mr-2" />
                                                Credits
                                            </Button>

                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="justify-start" 
                                                onClick={() => {
                                                    toggleSettingsOverlay(true);
                                                }}
                                            >
                                                <Settings className="h-4 w-4 mr-2" />
                                                Settings
                                            </Button>

                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="justify-start" 
                                                onClick={() => {
                                                    toggleNotificationsOverlay(true);
                                                }}
                                            >
                                                <Bell className="h-4 w-4 mr-2" />
                                                Notifications
                                            </Button>

                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="justify-start" 
                                                onClick={() => signOut({ callbackUrl: '/' })}
                                            >
                                                <LogOut className="h-4 w-4 mr-2" />
                                                Logout
                                            </Button>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}