"use client";

/**
 * Track a custom event to the backend analytics.
 * @param eventName Name of the event (e.g., 'share_trip', 'book_hotel')
 * @param eventData Additional data object (optional)
 */
export const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
    try {
        const url = window.location.href;

        // Use sendBeacon if available for critical events, otherwise fetch
        // For custom events we prefer fetch to ensure JSON body is handled correctly by simple backends,
        // but keepalive helps it survive navigation.

        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analytics/event`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                event_name: eventName,
                event_data: eventData,
                url: url
            }),
            keepalive: true
        }).catch(err => console.error("Event tracking error:", err));

    } catch (e) {
        console.error("Failed to track event", e);
    }
};
