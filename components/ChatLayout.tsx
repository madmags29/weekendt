"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Send, Map as MapIcon, Compass, ArrowLeft } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ThinkingIndicator from "./ThinkingIndicator";
import { TripPlan, SearchRequest } from "../types";
import { useTheme } from "./ThemeProvider";
import Logo from "./Logo";

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

interface SavedTrip {
    id: string;
    plan: TripPlan;
    date: string;
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
                    const trip = trips.find((t: SavedTrip) => t.id === initialTripId);
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

        } catch {
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



    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans selection:bg-purple-500/30 transition-colors duration-500">
            {/* LEFT PANEL - CHAT */}
            <div
                style={{ "--sidebar-width": `${sidebarWidth}px` } as React.CSSProperties}
                className="flex flex-col bg-white/80 border-r border-gray-200 relative z-10 shadow-2xl backdrop-blur-3xl transition-all duration-300 ease-linear shrink-0 w-full md:w-[var(--sidebar-width)]"
            >
                {/* Drag Handle */}
                <div
                    onMouseDown={(e) => { e.preventDefault(); setIsResizing(true); }}
                    className="absolute -right-1 top-0 bottom-0 w-2 cursor-col-resize z-50 hover:bg-purple-500/50 transition-colors group hidden md:flex items-center justify-center translate-x-1/2"
                >
                    <div className="w-0.5 h-8 bg-zinc-300 dark:bg-zinc-600 rounded-full group-hover:bg-purple-500 dark:group-hover:bg-white transition-colors" />
                </div>

                {/* Header */}
                <header className="px-6 py-5 border-b border-gray-200 flex items-center justify-between sticky top-0 z-20 bg-white/90 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        {onBack && (
                            <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900 group" title="Back to Home">
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            </button>
                        )}
                        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-xl shadow-lg shadow-purple-500/20">
                            <Compass className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg tracking-tight text-gray-900">WeekendTraveller</h1>
                            <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">AI Assistant</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">

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
                <div className="p-6 pt-2 pb-8 bg-gradient-to-t from-white to-transparent">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-20 group-focus-within:opacity-100 transition duration-500 blur"></div>
                        <div className="relative flex items-end bg-white backdrop-blur-xl rounded-2xl border border-gray-200 focus-within:border-purple-200 transition-all shadow-xl">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Where is your next adventure?"
                                rows={2}
                                className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none px-6 py-5 text-sm text-gray-900 placeholder-gray-400 resize-none min-h-[80px]"
                            />
                            <div className="p-3 pb-4">
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || loading}
                                    className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="text-[10px] text-center text-gray-400 mt-4 font-medium tracking-wide space-y-1">
                        <p>WeekendTravellers can make mistakes. Check important info.</p>
                        <p>Powered by Weekend Travellers</p>
                    </div>
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


