// lib/api/knowledge.ts
import { getSession } from 'next-auth/react'; // Or your preferred way to get token

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ai-companion-backend-opuh.onrender.com"; // Ensure this env var is set


export interface KnowledgeVector {
    id: string;
    text: string; // Assuming backend sends 'text' now
    last_updated: string; // ISO date string ideally
    mentions: number; 
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

// --- Fetch Knowledge Vectors ---
export async function fetchKnowledgeVectors(limit: number = 10): Promise<KnowledgeVector[]> {
    const headers = await getAuthHeaders();
    const url = `${API_BASE_URL}/vectors/get-knowledge-vectors?limit=${limit}`;
    const response = await fetch(url, {
        headers: { ...headers },
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch knowledge vectors' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
}

// --- Fetch Slang Vectors ---
export async function fetchSlangVectors(limit: number = 10): Promise<KnowledgeVector[]> {
    const headers = await getAuthHeaders();
    const url = `${API_BASE_URL}/vectors/get-slang-vectors?limit=${limit}`;
    const response = await fetch(url, {
        headers: { ...headers },
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch slang vectors' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
}

// --- Remove Knowledge Vector ---
export async function removeKnowledgeVector(knowledge_id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const url = `${API_BASE_URL}/vectors/remove-knowledge-vector/?knowledge_id=${knowledge_id}`;
    const response = await fetch(url, { 
        method: 'DELETE',
        headers: { ...headers },
    });

    if (!response.ok) {
        // Try to parse error message from backend
        const errorData = await response.json().catch(() => ({ message: 'Failed to remove knowledge vector' }));
        throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
    }
}

// --- Remove Slang Vector ---
export async function removeSlangVector(slang_id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const url = `${API_BASE_URL}/vectors/remove-slang-vector/?slang_id=${slang_id}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: { ...headers },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to remove slang vector' }));
        throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
    }
}