self.addEventListener("push", async event => {
    //console.log("[SW] Push Received:", event);

    if (!event.data) {
        console.warn("[SW] No push data received!");
        return;
    }

    let rawText = "";
    try {
        rawText = await event.data.text();
        console.log("[SW] Raw push data:", rawText);
    } catch (err) {
        console.error("[SW] Could not read event.data.text()", err);
    }

    let data = {};
    try {
        data = JSON.parse(rawText);
        console.log("[SW] Parsed push data:", data);
    } catch (err) {
        console.warn("[SW] Failed to parse push data as JSON. Falling back.", err);
        data = { title: "Fallback Title", body: rawText || "No body" };
    }

    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(clients => {
        clients.forEach(client => {
            client.postMessage({
                type: "PUSH_RECEIVED",
                data,
            });
        
        console.log("[SW] Posting message to client:", data);
        });
    });

    const title = data.title || "🧪 Notification";
    const options = {
        body: data.body || "No message provided",
        icon: "/images/logo_256x256.png"
    };

    console.log("[SW] Showing notification:", title, options);

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});
