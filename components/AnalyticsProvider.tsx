"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function AnalyticsTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const url = `${pathname}?${searchParams.toString()}`;

        // Use sendBeacon if available for reliability during navigation, fallback to fetch
        const data = JSON.stringify({
            url: url,
            referrer: document.referrer
        });

        // We use fetch with keepalive: true effectively acting like sendBeacon
        // fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analytics/track`, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({
        //         url: url,
        //         referrer: document.referrer
        //     }),
        //     keepalive: true
        // }).catch(err => console.error("Analytics error:", err));

    }, [pathname, searchParams]);

    return null;
}

export default function AnalyticsProvider() {
    return (
        <Suspense fallback={null}>
            <AnalyticsTracker />
        </Suspense>
    );
}
