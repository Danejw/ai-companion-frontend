import { getSession } from 'next-auth/react'; // Or your preferred way to get token

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ai-companion-backend-opuh.onrender.com"; // Ensure this env var is set


export interface MBTIData {
    type: string;
    extraversion_introversion: number;
    sensing_intuition: number;
    thinking_feeling: number;
    judging_perceiving: number;
    message_count: number;
}


// Helper to get auth token
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


// Fetch MBTI Type
export async function fetchMBTI(): Promise<MBTIData> {
    const headers = await getAuthHeaders();
    const url = `${API_BASE_URL}/mbti/get-mbti`;
    const response = await fetch(url, {
        headers: { ...headers },
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch MBTI type' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    const data: MBTIData = await response.json();
    return data;
}

// reset MBTI Type
export async function resetMBTI(): Promise<boolean> {
    const headers = await getAuthHeaders();
    const url = `${API_BASE_URL}/mbti/reset-mbti`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { ...headers },
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to reset MBTI type' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return true;
}