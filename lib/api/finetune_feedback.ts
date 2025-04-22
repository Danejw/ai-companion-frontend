import { getSession } from 'next-auth/react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ai-companion-backend-opuh.onrender.com";

export interface FinetuneFeedbackPayload {
  message_input: string;
  message_output: string;
  feedback_type: boolean;
}

// Helper to get auth token
async function getAuthHeaders(): Promise<Record<string, string>> {
  const session = await getSession();
  const accessToken = session?.user?.accessToken;
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

export async function submitFinetuneFeedback(payload: FinetuneFeedbackPayload) {

  const headers = await getAuthHeaders();
    const url = `${BACKEND_URL}/finetune/feedback`;

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response.json();
} 