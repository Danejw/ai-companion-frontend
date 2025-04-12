import { getSession } from 'next-auth/react'; // Or your preferred way to get token

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ai-companion-backend-opuh.onrender.com"; // Ensure this env var is set


export interface Ocean {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
    response_count: number;
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


// Fetch Ocean Data
export async function fetchOcean(): Promise<Ocean> {
    const headers = await getAuthHeaders();
    const url = `${API_BASE_URL}/ocean/get-ocean`;
    const response = await fetch(url, {
        headers: { ...headers },
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch Ocean data' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    const data: Ocean = await response.json();
    return data;
}

// Reset Ocean Data
export async function resetOcean(): Promise<boolean> {
    const headers = await getAuthHeaders();
    const url = `${API_BASE_URL}/ocean/reset-ocean`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { ...headers },
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to reset Ocean data' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return true;
}