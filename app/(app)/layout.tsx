// app/(app)/layout.tsx
'use client'; // Needed for Zustand hooks and onClick handlers

import React from 'react';
import { History, Settings, CreditCard, LogOut } from 'lucide-react'; // Example Icons
import { Button } from '@/components/ui/button';
// import { useUIStore } from '@/store'; // Assuming store setup (Step 12)
import { signOut } from 'next-auth/react'; // Import signOut

export default function AuthenticatedAppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Example: Get actions from Zustand store later (Step 12/13)
    // const { toggleHistoryOverlay, toggleCreditsOverlay, toggleSettingsOverlay } = useUIStore();

    const handleSignOut = () => {
        signOut({ callbackUrl: '/login' }); // Redirect to login after sign out
    };

    return (
        <div className="relative min-h-screen bg-background text-foreground">
            {/* Corner Icons - Positioned Absolutely */}
            <div className="absolute top-4 left-4 z-10">
                <Button
                    variant="ghost"
                    size="icon"
                    // onClick={toggleHistoryOverlay} // Connect to Zustand later
                    aria-label="Show History"
                >
                    <History className="h-5 w-5" />
                </Button>
            </div>
            <div className="absolute top-4 right-4 z-10 flex gap-2">
                {/* Credits Display & Trigger - Placeholder */}
                <Button
                    variant="ghost"
                    size="icon"
                    //   onClick={toggleCreditsOverlay} // Connect to Zustand later
                    aria-label="Show Credits"
                >
                    <CreditCard className="h-5 w-5" />
                    {/* Add actual credit display later */}
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    //   onClick={toggleSettingsOverlay} // Connect to Zustand later
                    aria-label="Show Settings"
                >
                    <Settings className="h-5 w-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSignOut}
                    aria-label="Sign Out"
                >
                    <LogOut className="h-5 w-5" />
                </Button>
            </div>

            {/* Main Content Area */}
            <main className="min-h-screen">{children}</main>

            {/* Overlay Components will likely be rendered here later, */}
            {/* controlled by Zustand state */}
            {/* <HistoryOverlay /> */}
            {/* <CreditsOverlay /> */}
            {/* <SettingsOverlay /> */}
        </div>
    );
}