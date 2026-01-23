"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Send, Map as MapIcon, Compass, ArrowLeft } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ThinkingIndicator from "./ThinkingIndicator";
import { TripPlan, SearchRequest } from "../types";
import { useTheme } from "./ThemeProvider";

// Dynamic import for MapArea to avoid SSR issues with Leaflet
const MapArea = dynamic(() => import("./MapArea"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            Loading Map...
        </div>
    ),
});

interface Message {
    role: "user" | "ai";
    content: string;
    data?: TripPlan;
}

interface ChatLayoutProps {
    initialQuery?: string;
    initialTripId?: string;
    onBack?: () => void;
}

export default function ChatLayout({ initialQuery, initialTripId, onBack }: ChatLayoutProps) {
    const { theme, setTheme } = useTheme();
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "ai",
            content: "Hi! I'm your Weekend Travel Assistant. Tell me where you want to go, or ask for suggestions like 'Beach trip near Mumbai for 5k'.",
        },
    ]);
    const [currentPlan, setCurrentPlan] = useState<TripPlan | null>(null);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [sidebarWidth, setSidebarWidth] = useState(500); // Fallback init
    const [isResizing, setIsResizing] = useState(false);

    // Initialize width to 40% of screen
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setSidebarWidth(window.innerWidth * 0.4);
        }
    }, []);

    // Resize handlers (Mouse)
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;
            // Limit width between 300px and 800px
            const newWidth = Math.max(300, Math.min(e.clientX, 800));
            setSidebarWidth(newWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.body.style.cursor = 'default';
        };

        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    // Auto-scroll logic
    useEffect(() => {
        if (loading) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            return;
        }

        const lastIdx = messages.length - 1;
        const lastMessage = messages[lastIdx];

        if (lastMessage && lastMessage.role === "ai" && lastMessage.data) {
            // Scroll to the TOP of the trip plan
            document.getElementById(`msg-${lastIdx}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
            // Default: Scroll to bottom
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, loading]);

    // Process initial query if provided
    const hasRunInitial = useRef(false);
    useEffect(() => {
        if (initialQuery && !hasRunInitial.current) {
            hasRunInitial.current = true;
            setInput(initialQuery);
            // Small delay to let UI mount
            setTimeout(() => {
                // Manually trigger the message flow to simulate user input
                setMessages(prev => [...prev, { role: "user", content: initialQuery }]);
                setLoading(true);
                processSearch(initialQuery);
            }, 500);
        }
    }, [initialQuery]);

    // Load saved trip if ID provided
    useEffect(() => {
        if (initialTripId) {
            try {
                const stored = localStorage.getItem("weekend_trips_history");
                if (stored) {
                    const trips = JSON.parse(stored);
                    const trip = trips.find((t: any) => t.id === initialTripId);
                    if (trip) {
                        setCurrentPlan(trip.plan);
                        setMessages([
                            { role: 'ai', content: `Welcome back! Opening your saved trip to ${trip.plan.destination}...` },
                            { role: 'ai', content: `Here is your plan for ${trip.plan.destination}!`, data: trip.plan }
                        ]);
                    }
                }
            } catch (e) {
                console.error("Failed to load saved trip", e);
            }
        }
    }, [initialTripId]);

    const processSearch = async (query: string) => {
        try {
            const request: SearchRequest = {
                query: query,
                origin: "Delhi",
                days: 2,
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/search`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(request),
            });

            if (!response.ok) throw new Error("Failed to fetch plan");

            const data: TripPlan = await response.json();
            setCurrentPlan(data);

            // Auto-save REMOVED. Now manual via button.

            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    content: `Here is a plan for ${data.destination}!`,
                    data: data
                }
            ]);

        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: "ai", content: "Sorry, I couldn't find a plan for that. Please try specifying a city like 'Jaipur' or 'Goa'." }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveTrip = (plan: TripPlan) => {
        try {
            const tripId = Date.now().toString();
            const newTrip = {
                id: tripId,
                plan: plan,
                date: new Date().toISOString()
            };

            const existing = localStorage.getItem("weekend_trips_history");
            const history = existing ? JSON.parse(existing) : [];
            const updated = [newTrip, ...history].slice(0, 50);
            localStorage.setItem("weekend_trips_history", JSON.stringify(updated));

            // Optional feedback? Could toast here if we had one.
            alert("Trip saved to My Trips!");
        } catch (e) {
            console.error("Failed to save trip", e);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setLoading(true);
        await processSearch(userMessage);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-black overflow-hidden font-sans aurora-bg selection:bg-purple-500/30 transition-colors duration-500">
            {/* LEFT PANEL - CHAT */}
            <div
                style={{ "--sidebar-width": `${sidebarWidth}px` } as React.CSSProperties}
                className="flex flex-col bg-white/80 dark:glass-panel border-r border-gray-200 dark:border-0 relative z-10 shadow-2xl backdrop-blur-3xl transition-all duration-300 ease-linear shrink-0 w-full md:w-[var(--sidebar-width)]"
            >
                {/* Drag Handle */}
                <div
                    onMouseDown={(e) => { e.preventDefault(); setIsResizing(true); }}
                    className="absolute -right-1 top-0 bottom-0 w-2 cursor-col-resize z-50 hover:bg-purple-500/50 transition-colors group hidden md:flex items-center justify-center translate-x-1/2"
                >
                    <div className="w-0.5 h-8 bg-zinc-300 dark:bg-zinc-600 rounded-full group-hover:bg-purple-500 dark:group-hover:bg-white transition-colors" />
                </div>

                {/* Header */}
                <header className="px-6 py-5 border-b border-gray-200 dark:border-white/5 flex items-center justify-between sticky top-0 z-20 bg-white/50 dark:bg-transparent backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        {onBack && (
                            <button onClick={onBack} className="p-2 -ml-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white group" title="Back to Home">
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            </button>
                        )}
                        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-xl shadow-lg shadow-purple-500/20">
                            <Compass className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white">WeekendTraveller</h1>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium tracking-wider uppercase">AI Assistant</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 transition-colors"
                            title="Toggle Theme"
                        >
                            {theme === "dark" ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                    <circle cx="12" cy="12" r="5" />
                                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            )}
                        </button>
                        <button className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors">
                            <MapIcon className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Message List */}
                <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <div className="space-y-8">
                        {messages.map((msg, idx) => (
                            <div key={idx} id={`msg-${idx}`}>
                                <ChatMessage {...msg} onSave={msg.role === 'ai' && msg.data ? handleSaveTrip : undefined} />
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start px-2">
                                <ThinkingIndicator />
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-6 pt-2 pb-8 bg-gradient-to-t from-white dark:from-black/20 to-transparent">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-20 group-focus-within:opacity-100 transition duration-500 blur"></div>
                        <div className="relative flex items-center bg-gray-50 dark:bg-zinc-900/90 backdrop-blur-xl rounded-full border border-gray-200 dark:border-white/10 focus-within:border-purple-200 dark:focus-within:border-white/20 transition-all shadow-xl">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Where is your next adventure?"
                                autoComplete="off"
                                className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none px-6 py-4 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                className="p-2 mr-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <p className="text-[10px] text-center text-zinc-400 dark:text-zinc-500 mt-4 font-medium tracking-wide">
                        Powered by Weekend Travellers
                    </p>
                </div>
            </div>

            {/* RIGHT PANEL - MAP */}
            <div className="hidden md:block flex-1 bg-gray-100 dark:bg-zinc-900 relative transition-colors duration-500">
                <div className="absolute inset-0 z-0 opacity-50">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-50 dark:from-black via-transparent to-transparent z-10 transition-colors duration-500" />
                </div>
                <MapArea plan={currentPlan} />
            </div>
        </div>
    );
}

function BotIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
        </svg>
    )
}
