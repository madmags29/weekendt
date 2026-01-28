"use client";

import { Share2, Check, Copy } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
    title: string;
    text: string;
    url?: string;
    className?: string;
}

export default function ShareButton({ title, text, url, className = "" }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const shareUrl = url || window.location.href;
        const shareData = {
            title: title,
            text: text,
            url: shareUrl,
        };

        // Try native share
        if (navigator.share) {
            try {
                await navigator.share(shareData);
                return;
            } catch (err) {
                console.log("Error sharing:", err);
            }
        }

        // Fallback to clipboard
        try {
            await navigator.clipboard.writeText(`${title}\n${text}\n${shareUrl}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <button
            onClick={handleShare}
            className={`flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white transition-all hover:scale-105 active:scale-95 ${className}`}
            aria-label="Share itinerary"
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">Copied</span>
                </>
            ) : (
                <>
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Share</span>
                </>
            )}
        </button>
    );
}
