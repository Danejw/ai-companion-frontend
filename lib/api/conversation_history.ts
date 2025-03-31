import { getSession } from 'next-auth/react'; // Or however you get the auth token

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ai-companion-backend-opuh.onrender.com"; // Use env var




export interface ConversationMessage {
    role: string;
    content: string;
}



async function getAuthHeaders(): Promise<Record<string, string>> {
    const session = await getSession();
    // Adjust based on how your backend expects the token (e.g., Bearer)
    // Use type assertion (as any) for accessToken - Augment Session type for a better fix
    if (session && (session as any).accessToken) {
        return {
            'Authorization': `Bearer ${(session as any).accessToken}`,
            'Content-Type': 'application/json',
        };
    }
    return { 'Content-Type': 'application/json' };
}


export async function fetchConversationHistory(): Promise<ConversationMessage[]> {
    // Get session within this function to access user ID
    const session = await getSession();
    if (!session?.user) {
        throw new Error('User not authenticated');
    }
    // --- IMPORTANT: Adjust how you get the user ID ---
    // Check your NextAuth session/jwt/database callbacks to see where the ID is stored.
    // Common possibilities: session.user.id, session.userId, session.user.sub, session.user.Id
    // Using 'as any' for now, but augmenting the Session type is better long-term.
    const userId = (session.user as any).id || (session as any).userId || (session.user as any).Id;
    // ------------------------------------------------

    if (!userId) {
        throw new Error('User ID not found in session');
    }

    const headers = await getAuthHeaders(); // Get auth headers if needed
    // Construct the URL using the retrieved userId
    const response = await fetch(`${BACKEND_URL}/conversations/${userId}/history`, {
        method: 'GET',
        headers: headers,
    });

    if (!response.ok) {
        // Try to get more specific error from backend if possible
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch conversation history' }));
        throw new Error(errorData.message || 'Failed to fetch conversation history');
    }

    // Expecting an array of messages
    const data = await response.json();
    if (!Array.isArray(data)) {
        console.error("API did not return an array for history:", data);
        throw new Error("Invalid format received for conversation history.");
    }
    return data as ConversationMessage[];
}