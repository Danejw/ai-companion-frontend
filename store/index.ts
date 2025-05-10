// store/index.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateUserConnectProfile, deleteUserConnectProfile, UserConnectProfile } from '@/lib/api/connect';
import { optInToPilot, getUserCreditsUsed, getPilotStatus, getUserUnlockCare, getUserUnlockConnect } from "@/lib/api/account";
import { toast } from 'sonner';
import { getPhq4History } from "@/lib/api/pqh4";

export type QuestionnaireStage = "pre" | "post";

interface UIState {
    isHistoryOpen: boolean;
    isCreditsOpen: boolean;
    isSettingsOpen: boolean;
    isAuthOpen: boolean;
    isKnowledgeOpen: boolean;
    // isInfoOpen: boolean;
    isCaptureOpen: boolean;
    isPushNotificationsOpen: boolean;
    isInfoNotificationOpen: boolean;
    isConnectFormOpen: boolean;
    useLocalLingo: boolean;


    // PHQ-4
    isPhq4Open: boolean;
    phq4Stage: QuestionnaireStage;
    lastCreditsUsed: number | null;

    // MCP
    didUnlockCare: boolean;
    didUnlockConnect: boolean;
    isOptedInToCare: boolean;
    isOptedInToConnect: boolean;
    userConnectProfile: UserConnectProfile | null;


    // pilot
    isOptedInToPilot: boolean;

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
    togglePushNotificationsOverlay: (isOpen: boolean) => void;
    toggleInfoNotificationOverlay: (isOpen: boolean) => void;
    toggleConnectFormOverlay: (isOpen: boolean) => void;
    toggleLocalLingo: (isOn: boolean) => void;

    setDidUnlockCare: (didUnlockCare: boolean) => void;
    setDidUnlockConnect: (didUnlockConnect: boolean) => void;
    toggleOptedInToCare: (isOptedInToCare: boolean) => void;
    toggleOptedInToConnect: (isOptedInToConnect: boolean) => void;
    setUserConnectProfile: (profile: UserConnectProfile | null) => void;

    toggleOptedInToPilot: (isOptedInToPilot: boolean) => void;

    togglePhq4Overlay: (isOpen: boolean) => void;

    // NEW: Settings for message processing
    extractKnowledge: boolean;
    summarizeFrequency: number; // 0 = never, 1 = always, higher numbers for less frequency
    
    // NEW: Functions to update settings
    toggleExtractKnowledge: () => void;
    setSummarizeFrequency: (value: number) => void;

    // Voice settings
    selectedVoice: string;
    setSelectedVoice: (voice: string) => void;

    checkPhq4Overlay: (creditInterval: number) => Promise<void>;

    syncLastCreditsUsed: () => Promise<number>;
    syncCareUnlock: () => Promise<boolean>;
    syncConnectUnlock: () => Promise<boolean>;
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
            isPushNotificationsOpen: false,
            isInfoNotificationOpen: false,
            isConnectFormOpen: false,
            useLocalLingo: false,

            // PHQ-4
            isOptedInToPilot: false,
            isPhq4Open: false,
            phq4Stage: "pre",
            lastCreditsUsed: null,

            // Personality settings
            empathy: 0,
            directness: 0,
            warmth: 0,
            challenge: 0,

            // MCP
            didUnlockCare: false,
            didUnlockConnect: false,
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

            togglePushNotificationsOverlay: (isOpen) => set((state) => ({
                isPushNotificationsOpen: isOpen !== undefined ? isOpen : !state.isPushNotificationsOpen
            })),

            toggleInfoNotificationOverlay: (isOpen) => set((state) => ({
                isInfoNotificationOpen: isOpen !== undefined ? isOpen : !state.isInfoNotificationOpen
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
            setDidUnlockCare: (didUnlockCare: boolean) => set({ didUnlockCare }),
            setDidUnlockConnect: (didUnlockConnect: boolean) => set({ didUnlockConnect }),

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

            toggleOptedInToPilot: async (isOptedInToPilot?: boolean) => {
                const newValue = isOptedInToPilot !== undefined ? isOptedInToPilot : !get().isOptedInToPilot;
                set({ isOptedInToPilot: newValue });
                try {
                    await optInToPilot(newValue);
                } catch (error) {
                    // Optionally revert state or show a toast
                    set({ isOptedInToPilot: !newValue });
                    toast.error("Failed to update pilot program status");
                }
            },

            // PHQ-4
            togglePhq4Overlay: (isOpen) => set((state) => ({
                isPhq4Open: isOpen !== undefined ? isOpen : !state.isPhq4Open
            })),

            checkPhq4Overlay: async (creditInterval: number) => {
                const [creditsUsedData, phq4History, isPilot] = await Promise.all([
                    getUserCreditsUsed(),
                    getPhq4History(),
                    getPilotStatus(),
                ]);
                
                if (!isPilot) {
                    set({ isPhq4Open: false });
                    return;
                }
                const creditsUsed = creditsUsedData.credits_used;
                const lastCreditsUsed = get().lastCreditsUsed;

                if (
                    creditsUsed > 0 &&
                    creditsUsed % creditInterval === 0 &&
                    creditsUsed !== lastCreditsUsed
                ) {
                    let nextStage: QuestionnaireStage = "pre";
                    if (phq4History.length > 0 && phq4History[phq4History.length - 1].stage === "pre") {
                        nextStage = "post";
                    }
                    set({
                        phq4Stage: nextStage,
                        isPhq4Open: true,
                        lastCreditsUsed: creditsUsed,
                    });
                }
            },

            syncLastCreditsUsed: async () => {
                try {
                    const { credits_used } = await getUserCreditsUsed();
                    set({ lastCreditsUsed: credits_used });
                    return credits_used;
                } catch (error) {
                    console.error('Failed to sync credits used:', error);
                    return 0;
                }
            },

            syncCareUnlock: async () => {
                try {
                    // Care
                    const didUnlockCare = await getUserUnlockCare();
                    console.log('didUnlockCare', didUnlockCare);
                    set({ didUnlockCare });
                    return didUnlockCare;

                } catch (error) {
                    console.error('Failed to check care feature unlocks:', error);
                    return false;
                }
            },

            syncConnectUnlock: async () => {
                try {
                    // Connect
                    const didUnlockConnect = await getUserUnlockConnect();
                    console.log('didUnlockConnect', didUnlockConnect);
                    set({ didUnlockConnect });
                    return didUnlockConnect;
                } catch (error) {
                    console.error('Failed to check connect feature unlocks:', error);
                    return false;
                }
            },
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
                didUnlockCare: state.didUnlockCare,
                didUnlockConnect: state.didUnlockConnect,
                isOptedInToCare: state.isOptedInToCare,
                isOptedInToConnect: state.isOptedInToConnect,
                userConnectProfile: state.userConnectProfile,

                // pilot
                isOptedInToPilot: state.isOptedInToPilot,

                lastCreditsUsed: state.lastCreditsUsed,
            }),
        }
    )
);