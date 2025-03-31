// store/index.ts
import { create } from 'zustand';

interface UIState {
    isHistoryOpen: boolean;
    isCreditsOpen: boolean;
    isSettingsOpen: boolean;
    isAuthOverlayOpen: boolean;
    isKnowledgeOpen: boolean;

    // Add state for confirmation modal later
    // confirmationAction: null | object;

    toggleHistoryOverlay: () => void;
    toggleCreditsOverlay: () => void;
    toggleSettingsOverlay: () => void;
    toggleAuthOverlay: (isOpen: boolean) => void;
    toggleKnowledgeOverlay: (isOpen: boolean) => void;

    // setConfirmationAction: (action: object | null) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
    // Initial State
    isHistoryOpen: false,
    isCreditsOpen: false,
    isSettingsOpen: false,
    isAuthOverlayOpen: false,
    isKnowledgeOpen: false,
    // confirmationAction: null,

    // Actions
    toggleHistoryOverlay: () => {
        set((state) => { 
            const newState = !state.isHistoryOpen;
            set({isHistoryOpen: newState});
            return { isHistoryOpen: newState };
        });
    },    
    
    toggleCreditsOverlay: () => {
        set((state) => {
            const newState = !state.isCreditsOpen;
            set({isCreditsOpen: newState});
            return { isCreditsOpen: newState };
        });
    },    
        
    toggleSettingsOverlay: () => {
        set((state) => {
            const newState = !state.isSettingsOpen;
            set({isSettingsOpen: newState});
            return { isSettingsOpen: newState };
        });
    },

    toggleAuthOverlay: (isOpen) => {
        set((state) => {
            const newState = !state.isAuthOverlayOpen;
            set({isAuthOverlayOpen: newState});
            return { isAuthOverlayOpen: newState };
        });
    },

    toggleKnowledgeOverlay: (isOpen) => set((state) => ({ isKnowledgeOpen: isOpen !== undefined ? isOpen : !state.isKnowledgeOpen }))

    // setConfirmationAction: (action) => set({ confirmationAction: action }),
}));