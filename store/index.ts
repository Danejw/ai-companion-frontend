// store/index.ts
import { create } from 'zustand';

interface UIState {
    isHistoryOpen: boolean;
    isCreditsOpen: boolean;
    isSettingsOpen: boolean;
    isAuthOverlayOpen: boolean;
    // Add state for confirmation modal later
    // confirmationAction: null | object;

    toggleHistoryOverlay: () => void;
    toggleCreditsOverlay: () => void;
    toggleSettingsOverlay: () => void;
    toggleAuthOverlay: (isOpen: boolean) => void;

    // setConfirmationAction: (action: object | null) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
    // Initial State
    isHistoryOpen: false,
    isCreditsOpen: false,
    isSettingsOpen: false,
    isAuthOverlayOpen: false,
    // confirmationAction: null,

    // Actions
    toggleHistoryOverlay: () => {
        set((state) => { 
            const newState = !state.isHistoryOpen;
            set({isHistoryOpen: newState});
            console.log(`--- DEBUG: Setting isHistoryOpen to: ${newState} ---`);
            return { isHistoryOpen: newState };
        });
    },    
    
    toggleCreditsOverlay: () => {
        set((state) => {
            const newState = !state.isCreditsOpen;
            set({isCreditsOpen: newState});
            console.log(`--- DEBUG: Setting isCreditsOpen to: ${newState} ---`);
            return { isCreditsOpen: newState };
        });
    },    
        
    toggleSettingsOverlay: () => {
        set((state) => {
            const newState = !state.isSettingsOpen;
            set({isSettingsOpen: newState});
            console.log(`--- DEBUG: Setting isSettingsOpen to: ${newState} ---`);
            return { isSettingsOpen: newState };
        });
    },

    toggleAuthOverlay: (isOpen) => {
        set((state) => {
            const newState = !state.isAuthOverlayOpen;
            set({isAuthOverlayOpen: newState});
            console.log(`--- DEBUG: Setting isAuthOverlayOpen to: ${newState} ---`);
            return { isAuthOverlayOpen: newState };
        });
    },

    // setConfirmationAction: (action) => set({ confirmationAction: action }),
}));