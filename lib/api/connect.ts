import { getSession } from 'next-auth/react';

interface SexualPreferences {
  orientation: string;
  looking_for: string;
}

export interface UserConnectProfile {
  name: string;
  age: number;
  bio: string;
  relationship_goals: string;
  personality_tags: string[];
  sexual_preferences: SexualPreferences;
  location: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


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

/**
 * Generate a new Connect user profile
 * @returns The generated user profile
 */
export async function generateUserConnectProfile(): Promise<UserConnectProfile> {
  const headers = await getAuthHeaders();
  const url = `${BACKEND_URL}/connect/generate_profile`;
  console.log('Request URL:', url);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
  });
  
  console.log('Response status:', response.status);
  
  if (response.ok) {
    return await response.json();
  }
  
  throw new Error(`Failed with status: ${response.status}`);
}

/**
 * Submit a user profile to the server
 * @param profile The user profile to submit
 * @returns Success status
 */
export async function submitUserConnectProfile(profile: UserConnectProfile): Promise<{ success: boolean }> {
  try {
    const session = await getSession();

    if (!session?.user) {
        throw new Error('User not authenticated');
    }

    const headers = await getAuthHeaders();
    const url = `${BACKEND_URL}/connect/create_profile`;

    console.log('Request URL:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(profile)
    });

    console.log('Response:', response);

    if (!response.ok) {
      throw new Error(`Failed to submit profile: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting user profile:', error);
    throw new Error('Failed to submit user profile');
  }
}

/**
 * Delete a user's Connect profile
 * @returns Success status
 */
export async function deleteUserConnectProfile(): Promise<{ success: boolean }> {
  try {
    const session = await getSession();

    if (!session?.user) {   
        throw new Error('User not authenticated');
    }

    const headers = await getAuthHeaders();
    const url = `${BACKEND_URL}/connect/remove_profile`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete profile: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting user profile:', error);
    throw new Error('Failed to delete user profile');
  }
}
