"use client";

import { useEffect, useState } from "react";
import { subscribeToPush, ScheduledTask, unsubscribe } from "@/lib/api/push_notifications";
import { schedulePushNotification } from "@/lib/api/push_notifications";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function PushDebugger() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [title, setTitle] = useState("Reminder from your AI");
    const [body, setBody] = useState("Just checking in 💬");
    const [status, setStatus] = useState("Ready");
    const [messages, setMessages] = useState<{ title: string; body: string }[]>([]);


    useEffect(() => {
        checkSubscription();

        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "PUSH_RECEIVED") {
                console.log("[SW] Received message:", event.data);
                const msg = event.data.data;
                setMessages((prev) => [...prev, msg]);
                setStatus(`📩 Message Received: ${msg.title}`);
            }
        };

        navigator.serviceWorker.ready.then((reg) => {
            navigator.serviceWorker.addEventListener("message", handleMessage);
        });

        return () => {
            navigator.serviceWorker.removeEventListener("message", handleMessage);
        };
    }, []);


    async function checkSubscription() {
        const reg = await navigator.serviceWorker.getRegistration();
        const sub = await reg?.pushManager.getSubscription();
        setIsSubscribed(!!sub);
    }

    async function handleSubscribe() {
        setStatus("🔄 Subscribing...");
        await subscribeToPush();
        await checkSubscription();
        setStatus("✅ Subscribed!");
    }

    async function handleSchedule() {
        const task: ScheduledTask = {
            title,
            body,
            send_at: new Date(Date.now() + 10000).toISOString(),
        };
        setStatus("📅 Scheduling...");
        await schedulePushNotification(task);
        setStatus("✅ Scheduled for 10 seconds from now!");
    }

    async function handleUnsubscribe() {
        setStatus("🗑️ Unsubscribing...");
        await unsubscribe();
        await checkSubscription();
        setStatus("✅ Unsubscribed");
    }

    return (
        <div className="w-full max-w-md mx-auto p-4 sm:p-6 rounded-2xl shadow-xl bg-white/80 backdrop-blur-lg border border-gray-300">
            <h3 className="text-xl text-center font-bold mb-4 text-gray-700">📲 Push Notifications</h3>

            {!isSubscribed ? (
                <Button
                    onClick={handleSubscribe}
                    className="w-full px-4 py-2 rounded-xl bg-accent text-white font-medium hover:bg-accent/80"
                >
                    ✅ Subscribe to Push
                </Button>
            ) : (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Title</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 w-full"
                            placeholder="Enter a title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Body</label>
                        <Input
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="mt-1 w-full"
                            placeholder="Enter message"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                            onClick={handleSchedule}
                            className="w-full sm:w-auto px-4 py-2 bg-accent text-white rounded-xl hover:bg-accent/80"
                        >
                            ⏰ Schedule
                        </Button>

                        <Button
                            onClick={handleUnsubscribe}
                                className="w-full sm:w-auto px-4 py-2 bg-accent-foreground text-white rounded-xl hover:bg-accent-foreground/80"
                        >
                            ❌ Unsubscribe
                        </Button>
                    </div>
                </div>
            )}

            <p className="mt-4 ml-4 text-sm italic text-gray-600">{status}</p>

            {messages.length > 0 && (
                <div className="pt-4 ml-4 border-t border-gray-300 space-y-2 hide-scrollbar">
                    <h4 className="text-sm font-semibold text-gray-700">📁 Received Messages</h4>
                    <ul className="space-y-1 max-h-40 overflow-auto pr-1">
                        {messages.map((msg, i) => (
                            <li key={i} className="text-sm bg-white/50 backdrop-blur p-2 rounded-md shadow">
                                <strong>{msg.title}</strong>
                                <div>{msg.body}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
