// components/layout/RenderOverlays.tsx
'use client';

import React, { useEffect } from 'react'; // Import useEffect
import { useUIStore } from '@/store'; // Adjust path if needed
import { useSession } from 'next-auth/react'; // Import useSession

// --- Use individual selectors for state/actions ---
// import { shallow } from 'zustand/shallow'; // Not needed with individual selectors

// Import your overlay components
import AuthOverlay from '@/components/overlays/AuthOverlay';
import CreditsOverlay from '@/components/overlays/CreditsOverlay';
import HistoryOverlay from '@/components/overlays/HistoryOverlay';
// import SettingsOverlay from '@/components/overlays/SettingsOverlay'; // Uncomment when ready

export function RenderOverlays() {
    // --- Select state and actions individually ---
    const isAuthOverlayOpen = useUIStore((state) => state.isAuthOverlayOpen);
    const isCreditsOpen = useUIStore((state) => state.isCreditsOpen);
    const isSettingsOpen = useUIStore((state) => state.isSettingsOpen);
    const isHistoryOpen = useUIStore((state) => state.isHistoryOpen);

    const toggleAuthOverlay = useUIStore((state) => state.toggleAuthOverlay);
    const toggleCreditsOverlay = useUIStore((state) => state.toggleCreditsOverlay);
    const toggleSettingsOverlay = useUIStore((state) => state.toggleSettingsOverlay);
    const toggleHistoryOverlay = useUIStore((state) => state.toggleHistoryOverlay);
    // --- ---

    // Get session status
    const { status } = useSession(); // Only need status here

    // --- Effect to automatically open AuthOverlay if unauthenticated ---
    useEffect(() => {
        // Check status: 'unauthenticated' means loading is finished and user is not logged in
        // Check status !== 'loading' to prevent brief flash while session is checked
        if (status !== 'loading' && status === 'unauthenticated') {
            // Open the overlay if it's not already marked as open
            if (!isAuthOverlayOpen) {
                console.log("--- DEBUG: Auto-opening Auth Overlay (unauthenticated) ---");
                // Use the specific 'true' toggle since we know we want it open
                toggleAuthOverlay(true);
            }
        }
        // If the user becomes authenticated while the overlay is somehow still open, close it
        // (This handles edge cases like successful OAuth returning to the page)
        if (status === 'authenticated' && isAuthOverlayOpen) {
            console.log("--- DEBUG: Auto-closing Auth Overlay (authenticated) ---");
            toggleAuthOverlay(false);
        }

        // Rerun effect if session status changes OR if the overlay's open state changes externally
    }, [status, toggleAuthOverlay, isAuthOverlayOpen]);

    return (
        <>
            {/* --- Pass props to AuthOverlay --- */}
            <AuthOverlay open={isAuthOverlayOpen} onOpenChange={toggleAuthOverlay} />

            <CreditsOverlay open={isCreditsOpen} onOpenChange={toggleCreditsOverlay} />
            <HistoryOverlay open={isHistoryOpen} onOpenChange={toggleHistoryOverlay} />
            {/* <SettingsOverlay open={isSettingsOpen} onOpenChange={toggleSettingsOverlay} /> */}
        </>
    );
}