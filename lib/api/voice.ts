import { getSession } from "next-auth/react";

// Define Backend URL (or import from a central config file)
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ai-companion-backend-opuh.onrender.com";


const getAuthToken = async (): Promise<string | null> => {
    const session = await getSession();
    const accessToken = session?.user?.accessToken || null;
    if (!accessToken) {
        console.warn('No access token found');
    }
    return accessToken;
};


export const startVoiceInteraction = async (recordedBlob: Blob, selectedVoice: string = "alloy") => {
    const formData = new FormData();
    formData.append("audio", recordedBlob, "input.webm");

    const authToken = await getAuthToken();

    const response = await fetch(`${BACKEND_URL}/voice/voice-assistant?voice=${selectedVoice}`, {
        method: "POST",
        body: formData,
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch voice response");
    }

    // 👇 Get transcript from response headers
    const transcript = response.headers.get("X-Transcript");
    console.log("📝 Transcribed Text:", transcript);

    // Convert stream to audio
    const audioBlob = await response.blob();
    console.log("Received audio blob:", audioBlob);

    const audioUrl = URL.createObjectURL(audioBlob);
    console.log("Audio URL:", audioUrl);

    const audio = new Audio(audioUrl);
    audio.play().catch((err) => {
        console.error("Playback error:", err);
    });

    return { transcript, audioUrl };
};


export const textToSpeech = async (text: string, voice: string) => {
    const authToken = await getAuthToken();

    const response = await fetch(`${BACKEND_URL}/voice/text-to-speech`, {
        method: "POST",
        body: JSON.stringify({ text, voice }),
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch text to speech");
    }

    // Convert stream to audio
    const audioBlob = await response.blob();
    console.log("Received audio blob:", audioBlob);

    const audioUrl = URL.createObjectURL(audioBlob);
    console.log("Audio URL:", audioUrl);

    return audioUrl;
};
