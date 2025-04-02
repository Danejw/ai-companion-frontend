// store/index.ts
import { create } from 'zustand';

interface UIState {
    isHistoryOpen: boolean;
    isCreditsOpen: boolean;
    isSettingsOpen: boolean;
    isAuthOpen: boolean;
    isKnowledgeOpen: boolean;

    // Add state for confirmation modal later
    // confirmationAction: null | object;

    toggleHistoryOverlay: (isOpen?: boolean) => void;
    toggleCreditsOverlay: (isOpen?: boolean) => void;
    toggleSettingsOverlay: (isOpen?: boolean) => void;
    toggleAuthOverlay: (isOpen: boolean) => void;
    toggleKnowledgeOverlay: (isOpen: boolean) => void;

    // setConfirmationAction: (action: object | null) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
    // Initial State
    isHistoryOpen: false,
    isCreditsOpen: false,
    isSettingsOpen: false,
    isAuthOpen: false,
    isKnowledgeOpen: false,
    // confirmationAction: null,

    // Actions
    toggleHistoryOverlay: (isOpen) => set((state) => ({
        isHistoryOpen: isOpen !== undefined ? isOpen : !state.isHistoryOpen
    })),    
    
    toggleCreditsOverlay: (isOpen) => set((state) => ({
        isCreditsOpen: isOpen !== undefined ? isOpen : !state.isCreditsOpen
    })),    
        
    toggleSettingsOverlay: (isOpen) => set((state) => ({
        isSettingsOpen: isOpen !== undefined ? isOpen : !state.isSettingsOpen
    })),    

    toggleAuthOverlay: (isOpen) => set((state) => ({
        isAuthOpen: isOpen !== undefined ? isOpen : !state.isAuthOpen
    })),    

    toggleKnowledgeOverlay: (isOpen) => set((state) => ({ 
        isKnowledgeOpen: isOpen !== undefined ? isOpen : !state.isKnowledgeOpen 
    }))

    // setConfirmationAction: (action) => set({ confirmationAction: action }),
}));