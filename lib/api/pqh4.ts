// api/phq4.ts
import { getSession } from "next-auth/react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ai-companion-backend-opuh.onrender.com"; // Use env var



export interface Phq4Questionaire {
    stage: 'pre' | 'post';
    q1: number;            // 0–3
    q2: number;            // 0–3
    q3: number;            // 0–3
    q4: number;            // 0–3
    phq4_score: number;    // 0–12
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

export async function submitPhq4Response(response: Phq4Questionaire): Promise<Phq4Questionaire> {
    
    const headers = await getAuthHeaders();

    const res = await fetch(`${BACKEND_URL}/phq4/create_response`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(response)
    });
  
    if (!res.ok) {
      throw new Error("Failed to create PHQ-4 response");
    }
  
    return res.json();
  }

export async function getPhq4History(): Promise<Phq4Questionaire[]> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/phq4/get_responses`, {
        headers: headers,
    });

    if (!res.ok) {
        throw new Error("Failed to get PHQ-4 history");
    }

    return res.json();
}
