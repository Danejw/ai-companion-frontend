// store/index.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateUserConnectProfile, deleteUserConnectProfile, UserConnectProfile } from '@/lib/api/connect';

interface UIState {
    isHistoryOpen: boolean;
    isCreditsOpen: boolean;
    isSettingsOpen: boolean;
    isAuthOpen: boolean;
    isKnowledgeOpen: boolean;
    // isInfoOpen: boolean;
    isCaptureOpen: boolean;
    isNotificationsOpen: boolean;
    isConnectFormOpen: boolean;
    useLocalLingo: boolean;

    // MCP
    isOptedInToCare: boolean;
    isOptedInToConnect: boolean;
    userConnectProfile: UserConnectProfile | null;

    // Personality settings
    empathy: number;
    directness: number;
    warmth: number;
    challenge: number;

    setEmpathy: (value: number) => void;
    setDirectness: (value: number) => void;
    setWarmth: (value: number) => void;
    setChallenge: (value: number) => void;


    toggleHistoryOverlay: (isOpen?: boolean) => void;
    toggleCreditsOverlay: (isOpen?: boolean) => void;
    toggleSettingsOverlay: (isOpen?: boolean) => void;
    toggleAuthOverlay: (isOpen: boolean) => void;
    toggleKnowledgeOverlay: (isOpen: boolean) => void;
    // toggleInfoOverlay: (isOpen: boolean) => void;
    toggleCaptureOverlay: (isOpen: boolean) => void;
    toggleNotificationsOverlay: (isOpen: boolean) => void;
    toggleConnectFormOverlay: (isOpen: boolean) => void;
    toggleLocalLingo: (isOn: boolean) => void;

    toggleOptedInToCare: (isOptedInToCare: boolean) => void;
    toggleOptedInToConnect: (isOptedInToConnect: boolean) => void;
    setUserConnectProfile: (profile: UserConnectProfile | null) => void;

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
            // isInfoOpen: false,
            isCaptureOpen: false,
            isNotificationsOpen: false,
            isConnectFormOpen: false,
            useLocalLingo: false,

            // Personality settings
            empathy: 0,
            directness: 0,
            warmth: 0,
            challenge: 0,

            // MCP
            isOptedInToCare: false,
            isOptedInToConnect: false,
            userConnectProfile: null,

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

            // toggleInfoOverlay: (isOpen) => set((state) => ({ 
            //     isInfoOpen: isOpen !== undefined ? isOpen : !state.isInfoOpen 
            // })),

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

            toggleNotificationsOverlay: (isOpen) => set((state) => ({
                isNotificationsOpen: isOpen !== undefined ? isOpen : !state.isNotificationsOpen
            })),

            toggleConnectFormOverlay: (isOpen) => set((state) => ({
                isConnectFormOpen: isOpen !== undefined ? isOpen : !state.isConnectFormOpen
            })),

            toggleLocalLingo: (useLocalLingo) => set((state) => ({
                useLocalLingo: useLocalLingo !== undefined ? useLocalLingo : !state.useLocalLingo
            })),

            setEmpathy: (value) => set({ empathy: value }),
            setDirectness: (value) => set({ directness: value }),
            setWarmth: (value) => set({ warmth: value }),
            setChallenge: (value) => set({ challenge: value }),
            
            // MCP
            toggleOptedInToCare: (isOptedIn?: boolean) => set((state) => ({
                isOptedInToCare: isOptedIn !== undefined ? isOptedIn : !state.isOptedInToCare
            })),

            toggleOptedInToConnect: async (isOptedIn?: boolean) => {
                const newValue = isOptedIn !== undefined ? isOptedIn : !get().isOptedInToConnect;
                
                // Print out the toggle value
                console.log('Connect toggle value changed to:', newValue);
                
                set({ isOptedInToConnect: newValue });
                
                if (newValue) {
                    try {
                        console.log('Generating profile...');
                        //const profile = await generateUserConnectProfile();
                        //console.log('Generated profile:', profile);
                        set({ 
                            //userConnectProfile: profile,
                            isConnectFormOpen: true,
                        });
                    } catch (error) {
                        console.error('Failed to generate profile:', error);
                    }
                } else {
                    try {
                        await deleteUserConnectProfile();
                        console.log('Profile deleted successfully');
                        set({ userConnectProfile: null });
                    } catch (error) {
                        console.error('Failed to delete profile:', error);
                    }
                }
            },
            
            setUserConnectProfile: (profile) => set({ userConnectProfile: profile }),
        }),
        {
            name: 'ui-settings', // Storage key
            partialize: (state) => ({ 
                // Only persist these settings in localStorage
                extractKnowledge: state.extractKnowledge,
                summarizeFrequency: state.summarizeFrequency,
                selectedVoice: state.selectedVoice, // Add voice to persisted settings
                useLocalLingo: state.useLocalLingo,

                // Personality settings
                empathy: state.empathy,
                directness: state.directness,
                warmth: state.warmth,
                challenge: state.challenge,

                // MCP
                isOptedInToCare: state.isOptedInToCare,
                isOptedInToConnect: state.isOptedInToConnect,
                userConnectProfile: state.userConnectProfile,
            }),
        }
    )
);