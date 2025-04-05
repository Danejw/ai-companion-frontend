// lib/api/feedback.ts

import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ai-companion-backend-opuh.onrender.com"; // Ensure this env var is set

export interface Feedback {
    feedback: string;
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


// --- Submit Feedback ---
export async function submitFeedback(feedback: string): Promise<void> {
    console.log('--- Submitting Feedback ---', feedback);
    const headers = await getAuthHeaders();
    const url = `${API_BASE_URL}/orchestration/create-user-feedback`;
    
    // Send properly formatted JSON matching the FeedbackRequest model
    const response = await fetch(url, {
        method: 'POST',
        headers: { ...headers },
        body: JSON.stringify({ feedback })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to submit feedback' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`); 
    }
}

