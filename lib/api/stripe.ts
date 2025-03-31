// lib/api.ts (Example Structure)
import { getSession } from 'next-auth/react'; // Or however you get the auth token

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ai-companion-backend-opuh.onrender.com"; // Use env var




interface CheckoutSessionResponse {
    sessionId: string;
}


// --- Helper to get auth headers ---
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

// --- Fetch Credit Balance ---
export async function fetchCreditBalance(): Promise<{ credits: number }> {
    // Get session within this function to access user ID
    const session = await getSession();
    if (!session?.user) { // Check if user exists on session
        throw new Error('User not authenticated');
    }
    // Assuming user ID is on session.user.Id as per the original code
    // Adjust session.user.Id property name if needed (e.g., session.user.id)
    const userId = (session.user as any).Id; 
    if (!userId) {
        throw new Error('User ID not found in session');
    }

    const headers = await getAuthHeaders();
    // Use the retrieved userId in the URL
    const response = await fetch(`${BACKEND_URL}/users/${userId}/credits`, { // **ADJUST YOUR CREDITS ENDPOINT**
        method: 'GET',
        headers: headers,
    });
    if (!response.ok) {
        throw new Error('Failed to fetch credit balance');
    }
    return response.json();
}


export async function createCheckoutSession(tier: string): Promise<CheckoutSessionResponse> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BACKEND_URL}/app/stripe/create-one-time-checkout-session`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ tier }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to create checkout session' }));
        throw new Error(errorData.message || 'Failed to create checkout session');
    }
    return response.json();
}