'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AnimatedBlobLogo from '@/components/Logo';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useEffect, useState } from 'react';

export default function InfoHeader() {
    const [isMounted, setIsMounted] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center px-4 md:px-6">
                
                {/* Logo and Title */}
                <div className="mr-4 flex items-center">
                    <Link href="/welcome" className="mr-6 flex items-center space-x-2">
                        <AnimatedBlobLogo />
                        <span className="font-bold text-xl">Knolia</span>
                    </Link>

                    {/* --- Desktop Nav Links --- */}
                    {isMounted && isDesktop && (
                         <nav className="flex items-center text-sm font-medium">

                            <Button asChild variant="ghost" size="sm" className="justify-start">
                                <Link href="/welcome">Home</Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm" className="justify-start">    
                                <Link href="/contact">Contact</Link>
                            </Button>

                         </nav>
                    )}
                </div>

                {/* --- Right Side: App Button & Mobile Menu --- */}
                <div className="flex flex-1 items-center justify-end space-x-2">
                    {/* Go to App Button (always visible) */}
                    <Link href="/" passHref>
                         <Button variant="outline" size="sm">
                            <span className="hidden sm:inline">Go To App</span>
                            <span className="sm:hidden">App</span>
                         </Button>
                    </Link>

                    {/* --- Mobile Menu --- */}
                    {isMounted && !isDesktop && (
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" title="Menu">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-60">
                                <div className="flex flex-col space-y-3 py-4">
                                    <Button asChild variant="ghost" size="sm" className="justify-start">
                                        <Link href="/welcome">Home</Link>
                                    </Button>
                                     <Button asChild variant="ghost" size="sm" className="justify-start">
                                        <Link href="/privacy">Privacy</Link>
                                    </Button>
                                    <Button asChild variant="ghost" size="sm" className="justify-start">
                                        <Link href="/contact">Contact</Link>
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                    )}
                </div>
            </div>
        </header>
    );
} 