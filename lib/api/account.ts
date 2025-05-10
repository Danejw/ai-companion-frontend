import { getSession } from "next-auth/react";

// Type for the delete account response
export interface DeleteAccountResponse {
  success: boolean;
  storage_cleared: boolean;
  sessions_revoked: boolean;
  auth_deleted: boolean;
  message: string;
}

// Add this interface for the reset password response
export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

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
 * Delete a user account
 * @returns Response indicating success and status of various deletion operations
 */
export async function deleteAccount(): Promise<DeleteAccountResponse> {
  const session = await getSession();
  
  if (!session?.user?.accessToken) {
    throw new Error("Not authenticated");
  }
  
  try {
      const response = await fetch(`${BACKEND_URL}/profiles/delete_account`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.user.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `Failed to delete account: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting account:", error);
    throw new Error("Failed to delete account");
  }
}

/**
 * Send a password reset email to the user
 * @param email User's email address
 * @returns Response indicating success or failure
 */
export async function sendPasswordReset(email: string): Promise<ResetPasswordResponse> {
  try {
    const response = await fetch(`${BACKEND_URL}/profiles/send_password_reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `Failed to send password reset: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending password reset:", error);
    throw new Error("Failed to send password reset");
  }
}


export async function changePassword(token: string, new_password: string): Promise<ResetPasswordResponse> {
    try {
        const response = await fetch(`${BACKEND_URL}/profiles/change_password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, new_password }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                errorData?.message || `Failed to change password: ${response.status}`
            );
        }
        return await response.json();
    } catch (error) {
        console.error("Error changing password:", error);
        throw new Error("Failed to change password");
    }
}
  
export async function optInToPilot(isOptedInToPilot: boolean)
{
  const headers = await getAuthHeaders();
  const url = `${BACKEND_URL}/profiles/set_user_pilot`;

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ is_pilot: isOptedInToPilot }),
  });
    
  if (response.ok) {
    return await response.json();
  }

  return response.json();
} 

export async function getPilotStatus() : Promise<boolean>
{
  const headers = await getAuthHeaders();
  const url = `${BACKEND_URL}/profiles/get_user_pilot`;

  const response = await fetch(url, {
    method: 'GET',
    headers: headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch pilot status");
  }

  return await response.json() as boolean;
} 


interface UserCreditsUsedResponse {
  user_id: string;
  credits_used: number;
}

export async function getUserCreditsUsed(): Promise<UserCreditsUsedResponse>
{
  const headers = await getAuthHeaders();
  const url = `${BACKEND_URL}/profiles/credits_used`;

  const response = await fetch(url, {
    method: 'GET',
    headers: headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return await response.json() as UserCreditsUsedResponse;
}
