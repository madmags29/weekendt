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

// ============================================
// Google Analytics (GA4) Tracking Functions
// ============================================

declare global {
    interface Window {
        gtag?: (
            command: 'config' | 'event' | 'js' | 'set',
            targetId: string | Date,
            config?: Record<string, any>
        ) => void;
        dataLayer?: any[];
    }
}

/**
 * Track a custom event in Google Analytics
 * @param eventName - Name of the event
 * @param params - Event parameters
 */
export const trackGAEvent = (eventName: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, params);
    }
};

/**
 * Track a search query in Google Analytics
 * @param query - The search query string
 */
export const trackSearch = (query: string) => {
    trackGAEvent('search', {
        search_term: query,
    });
};

/**
 * Track trip generation in Google Analytics
 * @param destination - The destination for the trip
 */
export const trackTripGeneration = (destination: string) => {
    trackGAEvent('generate_trip', {
        destination: destination,
    });
};

/**
 * Track page view in Google Analytics (automatically handled by GA, but can be called manually)
 * @param url - The page URL
 */
export const trackPageView = (url: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
            page_path: url,
        });
    }
};
