// components/layout/RenderOverlays.tsx
'use client';

import React from 'react';
import { useUIStore } from '@/store'; // Adjust path if your store is elsewhere
import { shallow } from 'zustand/shallow'; // Ensure zustand is installed

// Import your overlay components
import AuthOverlay from '@/components/overlays/AuthOverlay';
import CreditsOverlay from '@/components/overlays/CreditsOverlay';
// Uncomment these as you create them and ensure they accept open/onOpenChange props:
// import SettingsOverlay from '@/components/overlays/SettingsOverlay';
import HistoryOverlay from '@/components/overlays/HistoryOverlay';



export function RenderOverlays() {
    // Read all necessary states and actions from the Zustand store using shallow comparison
    // This prevents re-renders if unrelated state changes, but the object reference changes
    const isAuthOverlayOpen = useUIStore((state) => state.isAuthOverlayOpen);
    const isCreditsOpen = useUIStore((state) => state.isCreditsOpen);
    const isSettingsOpen = useUIStore((state) => state.isSettingsOpen);
    const isHistoryOpen = useUIStore((state) => state.isHistoryOpen); 

    const toggleAuthOverlay = useUIStore((state) => state.toggleAuthOverlay);
    const toggleCreditsOverlay = useUIStore((state) => state.toggleCreditsOverlay);
    const toggleSettingsOverlay = useUIStore((state) => state.toggleSettingsOverlay);
    const toggleHistoryOverlay = useUIStore((state) => state.toggleHistoryOverlay); 

    // Optional: Keep this log for debugging state changes
    // console.log(
    //    `--- DEBUG: RenderOverlays reading state: Credits=${isCreditsOpen}, Settings=${isSettingsOpen}, History=${isHistoryOpen}, Auth=${isAuthOverlayOpen} ---`
    // );

    return (
        <>
            {/* Pass props to AuthOverlay */}
            {/* Ensure AuthOverlay component accepts and uses these props */}
            {/* <AuthOverlay open={isAuthOverlayOpen} onOpenChange={toggleAuthOverlay} /> */}

            {/* Pass props to CreditsOverlay */}
            {/* Ensure CreditsOverlay component accepts and uses these props */}
            <CreditsOverlay open={isCreditsOpen} onOpenChange={toggleCreditsOverlay} />

            {/* Render Settings and History overlays here once created */}
            {/* Ensure they also accept 'open' and 'onOpenChange' props */}
            {/* <SettingsOverlay open={isSettingsOpen} onOpenChange={toggleSettingsOverlay} /> */}
            <HistoryOverlay open={isHistoryOpen} onOpenChange={toggleHistoryOverlay} />
        </>
    );
}