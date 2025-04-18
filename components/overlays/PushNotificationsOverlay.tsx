'use client';

import { useEffect, useState } from "react";
import { subscribeToPush, ScheduledTask, unsubscribe } from "@/lib/api/push_notifications";
import { schedulePushNotification } from "@/lib/api/push_notifications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";


interface PushNotificationOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PushNotificationOverlay({ open, onOpenChange }: PushNotificationOverlayProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [title, setTitle] = useState("Reminder from your AI");
  const [body, setBody] = useState("Just checking in 💬");
  const [status, setStatus] = useState("Ready");
  const [messages, setMessages] = useState<{ title: string; body: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedHour, setSelectedHour] = useState<number>(12);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("AM");

  useEffect(() => {
    checkSubscription();

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "PUSH_RECEIVED") {
        const msg = event.data.data;
        setMessages((prev) => [...prev, msg]);
        setStatus(`📩 Message Received: ${msg.title}`);
      }
    };

    navigator.serviceWorker.ready.then(() => {
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
    if (!selectedDate) return;

    const scheduled = new Date(selectedDate);
    scheduled.setHours(selectedHour);
    scheduled.setMinutes(selectedMinute);
    scheduled.setSeconds(0);
    scheduled.setHours(selectedHour + (selectedPeriod === "PM" ? 12 : 0));

    const task: ScheduledTask = {
      title,
      body,
      send_at: scheduled.toISOString(),
    };

    setStatus(`📅 Scheduling for ${scheduled.toLocaleString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true, month: 'short', day: 'numeric' })}...`);
    await schedulePushNotification(task);
    setStatus(`✅ Scheduled for ${scheduled.toLocaleString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true, month: 'short', day: 'numeric' })}`);
  }

  async function handleUnsubscribe() {
    setStatus("🗑️ Unsubscribing...");
    await unsubscribe();
    await checkSubscription();
    setStatus("✅ Unsubscribed");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm sm:max-w-lg md:max-w-xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            📲 Push Notifications
          </DialogTitle>
        </DialogHeader>

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

            {/* --- Body --- */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">Body</label>
              <Input
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="mt-1 w-full"
                placeholder="Enter message"
              />
            </div>

            {/* --- When to send --- */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">When to send</label>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="default"
                      className="w-full justify-start text-left font-normal"
                    >
                      {selectedDate ? (
                        format(selectedDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                {/* --- Hour --- */}
                <div className="flex gap-2">
                  {/* Hour Picker */}
                  <select
                    value={selectedHour}
                    onChange={(e) => setSelectedHour(Number(e.target.value))}
                    className="w-1/3 border rounded-md px-2 py-1 text-sm"
                  >
                    {[...Array(12)].map((_, i) => {
                      const hour = i + 1;
                      return (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      );
                    })}
                  </select>

                  {/* Minute Picker */}
                  <select
                    value={selectedMinute}
                    onChange={(e) => setSelectedMinute(Number(e.target.value))}
                    className="w-1/3 border rounded-md px-2 py-1 text-sm"
                  >
                    {[...Array(60)].map((_, m) => (
                      <option key={m} value={m}>
                        {m.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>

                  {/* AM/PM Picker */}
                  <select
                    onChange={(e) => {
                      const isPM = e.target.value === "PM";
                      setSelectedPeriod(isPM ? "PM" : "AM");
                    }}
                    className="w-1/3 border rounded-md px-2 py-1 text-sm"
                    value={selectedPeriod}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>



            {/* --- Buttons --- */}
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

        {/* --- Status --- */}
        <p className="mt-4 text-sm italic text-gray-600">{status}</p>

        {/* --- Received Messages --- */}
        {messages.length > 0 && (
          <div className="pt-4 border-t border-gray-300 space-y-2 scrollbar-hide">
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
      </DialogContent>
    </Dialog>
  );
}
