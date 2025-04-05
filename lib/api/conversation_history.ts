import { getSession } from 'next-auth/react'; // Or however you get the auth token

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ai-companion-backend-opuh.onrender.com"; // Use env var


export interface ConversationMessage {
    role: string;
    content: string;
    created_at?: string;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
    const session = await getSession();
    const accessToken = session?.user?.accessToken; // Adjust path if necessary
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
        console.warn('--- WARN: getAuthHeaders - No Access Token Found for request ---');
    }
    return headers;
}

export async function fetchConversationHistory(): Promise<ConversationMessage[]> {
    // Get session within this function to access user ID
    const session = await getSession();

    if (!session?.user) {
        throw new Error('User not authenticated');
    }

    const headers = await getAuthHeaders();
    const url = `${BACKEND_URL}/conversations/history`;

    const response = await fetch(url, {
        method: 'GET',
        headers: headers,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch history: ${response.status}`);
    }

    // Expecting an array of messages
    const data = await response.json();
    return data;
}