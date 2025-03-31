// lib/api/orchestration.ts
// Or keep in lib/api.ts

import { getSession } from 'next-auth/react'; // Needed for getAuthHeaders

// Define Backend URL (or import from a central config file)
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ai-companion-backend-opuh.onrender.com";

// --- Helper to get auth headers (ensure this is defined or imported) ---
// Make sure this function correctly retrieves your actual access token
async function getAuthHeaders(): Promise<Record<string, string>> {
    const session = await getSession();
    // console.log('--- DEBUG: getAuthHeaders - Session:', session); // Optional log

    // --- Access token retrieval based on your corrected NextAuth setup ---
    const accessToken = (session as any)?.accessToken; // Adjust path if necessary

    const headers: Record<string, string> = {
        'Content-Type': 'application/json' // Default Content-Type
    };

    if (accessToken) {
        // console.log('--- DEBUG: getAuthHeaders - Sending Authorization Header ---'); // Optional log
        headers['Authorization'] = `Bearer ${accessToken}`; // Add Bearer token
    } else {
        console.warn('--- WARN: getAuthHeaders - No Access Token Found for request ---');
        // Handle cases where token might be missing but request should proceed,
        // or let the backend handle the missing token error.
    }
    return headers;
}
// --- ---

// --- Define expected payload for sending a message ---
interface SendMessagePayload {
    message: string;
}

// --- Define expected response type ---
// Using 'any' as requested, defining a more specific type is better practice.
type SendMessageResponse = any; // Could be: string | { reply: string } | etc.

/**
 * Sends a text message to the backend orchestration endpoint.
 * @param payload - An object containing the message string: { message: string }
 * @returns The response from the backend (type defined by SendMessageResponse).
 * @throws Will throw an error if the network request fails or the server returns a non-ok status.
 */
export async function sendTextMessage(payload: SendMessagePayload): Promise<SendMessageResponse> {
    // Get necessary headers (including Authorization if available)
    const headers = await getAuthHeaders();

    const url = `${BACKEND_URL}/orchestration/convo-lead`;
    console.log(`--- DEBUG: Sending POST to ${url} with payload:`, payload);

    let response: Response; // Define response variable outside try block

    try {
        response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload), // Send message in correct format
        });
    } catch (networkError) {
        // Handle network errors (e.g., DNS resolution failure, server unreachable)
        console.error(`--- ERROR: sendTextMessage - Network error:`, networkError);
        throw new Error(`Network error while trying to send message.`);
    }


    // Check if the response status code indicates success (2xx range)
    if (!response.ok) {
        console.error(`--- ERROR: sendTextMessage - Status: ${response.status} ${response.statusText}, URL: ${url}`);
        // Try to parse error JSON for more details, provide fallback message
        let errorDetail = `Failed to send message (Status: ${response.status})`;
        try {
            const errorData = await response.json();
            console.error(`--- ERROR: sendTextMessage - Error Data:`, errorData);
            // Use 'detail' common in FastAPI errors, 'message' as fallback
            errorDetail = errorData.detail || errorData.message || errorDetail;
        } catch (e) {
            // If error response is not JSON or empty, keep the status-based message
            console.warn(`--- WARN: sendTextMessage - Could not parse error response as JSON.`);
        }
        throw new Error(errorDetail);
    }

    // Try to parse the successful response body
    try {
        // Assumption: Backend sends JSON, even if it's just wrapping a string
        const data = await response.json();
        console.log("--- DEBUG: sendTextMessage - Response JSON data:", data);
        return data; // Return the parsed data directly (could be string, object, etc.)

    } catch (jsonError) {
        // Fallback if JSON parsing fails (maybe plain text response?)
        console.warn("--- WARN: sendTextMessage - Response was not valid JSON, trying text() ---", jsonError);
        try {
            const textData = await response.text();
            console.log("--- DEBUG: sendTextMessage - Response text data:", textData);
            // If plain text was expected, return it. Otherwise, might still be an issue.
            if (response.headers.get("content-type")?.includes("text/plain")) {
                return textData;
            } else {
                // If it wasn't supposed to be plain text, re-throw or handle differently
                console.error("--- ERROR: sendTextMessage - Received non-JSON response when JSON was expected.");
                throw new Error("Received unexpected response format from server.");
            }
        } catch (textError) {
            console.error("--- ERROR: sendTextMessage - Failed to read response body as text ---", textError);
            throw new Error("Failed to read response from server.");
        }
    }
}

// You might add other orchestration-related API functions here later