import { getSession } from "next-auth/react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ai-companion-backend-opuh.onrender.com";

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface ScheduledTask {
  title: string;
  body: string;
  send_at: string;
}

export function encodeKey(key: ArrayBuffer | null): string {
  if (!key) throw new Error("Push subscription key is missing");
  return btoa(String.fromCharCode(...new Uint8Array(key)));
}

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}

export async function getVapidKey(): Promise<Uint8Array> {
  const res = await fetch(`${BACKEND_URL}/push/vapid-public`);
  const { vapidPublicKey } = await res.json();
  return urlBase64ToUint8Array(vapidPublicKey);
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

export async function subscribeToPush() {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  const reg = await navigator.serviceWorker.register("/service-worker.js")
  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: await getVapidKey()
  });


  const subData: PushSubscriptionData = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: encodeKey(subscription.getKey("p256dh")),
      auth: encodeKey(subscription.getKey("auth")),
    }
  };

  const headers = await getAuthHeaders();
  console.log("--- INFO: subscribeToPush - Subscribing to push notifications ---");
  console.log(headers);

  await fetch(`${BACKEND_URL}/push/subscribe`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(subData)
  });
}

export async function schedulePushNotification(task: ScheduledTask) {
  const headers = await getAuthHeaders();
  //const sendTime = new Date(Date.now() + delaySeconds * 1000).toISOString();
  

  const res = await fetch(`${BACKEND_URL}/push/schedule`, {
    method: "POST",
    headers,
    body: JSON.stringify(task),
  });

  if (!res.ok) {
    console.error("❌ Failed to schedule push:", await res.text());
  } else {
    console.log("✅ Push scheduled.");
  }
}

export async function unsubscribe() {
  const headers = await getAuthHeaders();

  const response = await fetch(`${BACKEND_URL}/push/unsubscribe`, {
    method: "DELETE",
    headers,
  });

  if (response.ok) {
    // Backend confirmed deletion, now remove local subscription
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = await reg?.pushManager.getSubscription();
    if (sub) {
      await sub.unsubscribe();
      console.log("Local subscription removed");
    }
  } else {
    console.error("Failed to unsubscribe on backend", await response.text());
  }
}

