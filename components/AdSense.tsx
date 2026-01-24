"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

interface AdSenseProps {
    className?: string;
    style?: React.CSSProperties;
    format?: "auto" | "fluid" | "rectangle";
    responsive?: boolean;
}

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        adsbygoogle: any[];
    }
}

export default function AdSense({
    className = "",
    style = { display: "block" },
    format = "auto",
    responsive = true
}: AdSenseProps) {
    const start = useRef(false);

    useEffect(() => {
        if (start.current) return;
        start.current = true;
        try {
            window.adsbygoogle = window.adsbygoogle || [];
            window.adsbygoogle.push({});
        } catch (error) {
            console.error("AdSense error:", error);
        }
    }, []);

    const publisherId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

    if (!publisherId || publisherId === "ca-pub-XXXXXXXXXXXXXXXX") {
        return (
            <div className={`w-full bg-zinc-800/50 p-4 text-center rounded-lg border border-dashed border-zinc-700 ${className}`}>
                <span className="text-xs text-zinc-500 font-mono">AdSense Placeholder (Config Required)</span>
            </div>
        );
    }

    return (
        <div className={`overflow-hidden ${className}`}>
            <Script
                async
                src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
                strategy="afterInteractive"
                crossOrigin="anonymous"
            />
            <ins
                className="adsbygoogle"
                style={style}
                data-ad-client={publisherId}
                data-ad-format={format}
                data-full-width-responsive={responsive ? "true" : "false"}
            />
        </div>
    );
}
