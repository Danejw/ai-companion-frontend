// store/index.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
    isHistoryOpen: boolean;
    isCreditsOpen: boolean;
    isSettingsOpen: boolean;
    isAuthOpen: boolean;
    isKnowledgeOpen: boolean;
    isInfoOpen: boolean;
    isCaptureOpen: boolean;

    // Add state for confirmation modal later
    // confirmationAction: null | object;

    toggleHistoryOverlay: (isOpen?: boolean) => void;
    toggleCreditsOverlay: (isOpen?: boolean) => void;
    toggleSettingsOverlay: (isOpen?: boolean) => void;
    toggleAuthOverlay: (isOpen: boolean) => void;
    toggleKnowledgeOverlay: (isOpen: boolean) => void;
    toggleInfoOverlay: (isOpen: boolean) => void;
    toggleCaptureOverlay: (isOpen: boolean) => void;

    // setConfirmationAction: (action: object | null) => void;

    // NEW: Settings for message processing
    extractKnowledge: boolean;
    summarizeFrequency: number; // 0 = never, 1 = always, higher numbers for less frequency
    
    // NEW: Functions to update settings
    toggleExtractKnowledge: () => void;
    setSummarizeFrequency: (value: number) => void;

    // Voice settings
    selectedVoice: string;
    setSelectedVoice: (voice: string) => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set, get) => ({
            // Initial State
            isHistoryOpen: false,
            isCreditsOpen: false,
            isSettingsOpen: false,
            isAuthOpen: false,
            isKnowledgeOpen: false,
            isInfoOpen: false,
            isCaptureOpen: false,
            // confirmationAction: null,

            // Settings values
            extractKnowledge: true,
            summarizeFrequency: 10,

            // Voice settings
            selectedVoice: 'alloy',

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
            })),

            toggleInfoOverlay: (isOpen) => set((state) => ({ 
                isInfoOpen: isOpen !== undefined ? isOpen : !state.isInfoOpen 
            })),

            // setConfirmationAction: (action) => set({ confirmationAction: action }),

            // NEW: Settings toggle functions
            toggleExtractKnowledge: () => set((state) => ({
                extractKnowledge: !state.extractKnowledge
            })),
            
            setSummarizeFrequency: (value) => set({
                summarizeFrequency: value
            }),

            // Set voice
            setSelectedVoice: (voice) => set({
                selectedVoice: voice
            }),

            toggleCaptureOverlay: (isOpen) => set((state) => ({
                isCaptureOpen: isOpen !== undefined ? isOpen : !state.isCaptureOpen
            })),
        }),
        {
            name: 'ui-settings', // Storage key
            partialize: (state) => ({ 
                // Only persist these settings in localStorage
                extractKnowledge: state.extractKnowledge,
                summarizeFrequency: state.summarizeFrequency,
                selectedVoice: state.selectedVoice, // Add voice to persisted settings
            }),
        }
    )
);