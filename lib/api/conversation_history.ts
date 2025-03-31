import { getSession } from 'next-auth/react'; // Or however you get the auth token

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ai-companion-backend-opuh.onrender.com"; // Use env var




export interface ConversationMessage {
    role: string;
    content: string;
}



async function getAuthHeaders(): Promise<Record<string, string>> {
    const session = await getSession();
    console.log('--- DEBUG: getAuthHeaders - Session:', session); // Keep this log

    // --- CORRECT WAY to access the token based on corrected callbacks/types ---
    const accessToken = (session as any)?.accessToken;

    // Check if accessToken exists directly on session
    if (accessToken) { // Check the variable directly
        console.log('--- DEBUG: getAuthHeaders - Sending Authorization Header ---');
        return {
            'Authorization': `Bearer ${accessToken}`, // Use the variable
            'Content-Type': 'application/json',
        };
    }
    return { 'Content-Type': 'application/json' };
}


export async function fetchConversationHistory(): Promise<ConversationMessage[]> {
    // Get session within this function to access user ID
    const session = await getSession();
    console.log('--- DEBUG: getAuthHeaders - Session:', session); // Log the whole session

    if (!session?.user) {
        throw new Error('User not authenticated');
    }

    const userId = (session.user as any).id;

    if (!userId || typeof userId !== 'string') { // Add a type check for safety
        console.error('--- ERROR: User ID not found or not a string in session:', session.user);
        throw new Error('User ID not found or invalid in session');
    }

    console.log('--- DEBUG: fetchConversationHistory - User ID:', userId); // Log the userId variable directly

    const headers = await getAuthHeaders();
    const url = `${BACKEND_URL}/conversations/${userId}/history`; // <-- Use the userId variable DIRECTLY

    // Add this log right before fetch to be 100% sure
    console.log('--- DEBUG: fetchConversationHistory - FINAL Fetch URL:', url);

    const response = await fetch(url, {
        method: 'GET',
        headers: headers,
    });

    console.log('--- DEBUG: fetchConversationHistory - Response:', response);

    // Expecting an array of messages
    const data = await response.json();
    if (!Array.isArray(data)) {
        console.error("API did not return an array for history:", data);
        throw new Error("Invalid format received for conversation history.");
    }
    return data as ConversationMessage[];
}