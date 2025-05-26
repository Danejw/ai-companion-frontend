import { getSession } from 'next-auth/react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const session = await getSession();
  const accessToken = session?.user?.accessToken;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return headers;
}

export async function getMultistepFlows(): Promise<Record<string, any>> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${BACKEND_URL}/flows`, { headers });
  if (!res.ok) {
    throw new Error('Failed to fetch flows');
  }
  return res.json();
}
