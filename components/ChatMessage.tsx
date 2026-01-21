"use client";

import { useState } from "react";

import { TripPlan } from "../types";
import { Bot, User, MapPin, Clock, IndianRupee, Navigation } from "lucide-react";
import clsx from "clsx";

interface ChatMessageProps {
    role: "user" | "ai";
    content: string;
    data?: TripPlan;
}

export default function ChatMessage({ role, content, data }: ChatMessageProps) {
    const isAi = role === "ai";
    const [expanded, setExpanded] = useState(true); // Start expanded by default

    return (
        <div className={clsx("flex gap-4 w-full max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-500", isAi ? "flex-row" : "flex-row-reverse ml-auto")}>

            {/* Avatar */}
            <div className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg",
                isAi
                    ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white ring-2 ring-purple-500/20"
                    : "bg-zinc-800 text-zinc-400 ring-2 ring-zinc-700"
            )}>
                {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>

            {/* Content Bubble */}
            <div className={clsx(
                "flex flex-col gap-2",
                isAi && data ? "w-full max-w-4xl" : "max-w-[85%]", // Wider for Trip Plans
                isAi ? "items-start" : "items-end"
            )}>
                <div className={clsx(
                    "px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-md backdrop-blur-md",
                    isAi
                        ? "bg-white/5 border border-white/10 text-zinc-100 rounded-tl-none"
                        : "bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-tr-none font-medium"
                )}>
                    {content}
                </div>

                {/* Rich Content (Trip Plan Card) */}
                {isAi && data && (
                    <div className="w-full mt-2 bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-5 ring-1 ring-white/5">
                        {/* Header Image */}
                        <div className="h-48 relative flex items-end p-6 overflow-hidden group">
                            {data.hero_image ? (
                                <img
                                    src={data.hero_image}
                                    alt={data.destination}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <h3 className="relative z-10 text-3xl font-bold text-white shadow-sm font-display tracking-tight">{data.destination}</h3>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-zinc-800 border-b border-gray-100 dark:border-zinc-800 bg-white/5">
                            <div className="p-4 flex flex-col items-center text-center gap-1">
                                <Clock className="w-5 h-5 text-blue-400" />
                                <span className="text-xs font-medium text-zinc-300 leading-tight">{data.best_time_to_visit}</span>
                            </div>
                            <div className="p-4 flex flex-col items-center text-center gap-1">
                                <IndianRupee className="w-5 h-5 text-green-400" />
                                <span className="text-xs font-medium text-zinc-300 leading-tight">{data.estimated_budget}</span>
                            </div>
                            <div className="p-4 flex flex-col items-center text-center gap-1">
                                <Navigation className="w-5 h-5 text-purple-400" />
                                <span className="text-xs font-medium text-zinc-300 leading-tight">{data.route_info.distance}</span>
                            </div>
                        </div>

                        {/* Itinerary Snippet */}
                        {/* Itinerary Snippet */}
                        <div className="p-6 bg-zinc-950/30">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Itinerary</p>
                                {data.itinerary.length > 2 && (
                                    <button
                                        onClick={() => setExpanded(!expanded)}
                                        className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
                                    >
                                        {expanded ? "Collapse" : "View Full Plan"}
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                {(expanded ? data.itinerary : data.itinerary.slice(0, 2)).map((day) => (
                                    <div key={day.day} className="flex gap-4 group/day animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <div className="flex-col items-center hidden sm:flex pt-1">
                                            <div className="w-3 h-3 rounded-full bg-purple-500 ring-4 ring-purple-500/20 group-hover/day:bg-purple-400 transition-colors" />
                                            <div className="w-0.5 h-full bg-zinc-800 -mb-6 mt-2" />
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <p className="text-base font-bold text-zinc-200 mb-3 flex items-center gap-3">
                                                Day {day.day}
                                                <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-400 font-normal">
                                                    {day.activities.length} Activities
                                                </span>
                                            </p>
                                            <div className="grid gap-3">
                                                {day.activities.map((a, i) => (
                                                    <ActivityItem key={i} activity={a} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {!expanded && data.itinerary.length > 2 && (
                                <div className="text-center mt-6 pt-4 border-t border-white/5">
                                    <button
                                        onClick={() => setExpanded(true)}
                                        className="text-sm font-medium text-purple-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full"
                                    >
                                        +{data.itinerary.length - 2} more days
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Hotels Section */}
                        {data.hotels && data.hotels.length > 0 && (
                            <div className="p-6 bg-zinc-950/30 border-t border-white/5">
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Recommended Hotels</p>
                                <div className="grid gap-3">
                                    {data.hotels.map((hotel, idx) => (
                                        <div key={idx} className="bg-white/5 p-4 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="text-sm font-bold text-zinc-200">{hotel.name}</h4>
                                                <span className={clsx(
                                                    "text-xs px-2 py-0.5 rounded-full font-medium",
                                                    hotel.price_range === "Budget" && "bg-green-500/20 text-green-300",
                                                    hotel.price_range === "Mid-Range" && "bg-blue-500/20 text-blue-300",
                                                    hotel.price_range === "Luxury" && "bg-purple-500/20 text-purple-300"
                                                )}>{hotel.price_range}</span>
                                            </div>
                                            <p className="text-xs text-zinc-400 leading-relaxed">{hotel.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Origin City Info */}
                        {data.origin_info && (
                            <div className="p-6 bg-zinc-950/30 border-t border-white/5">
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">About {data.origin_info.city_name}</p>
                                <p className="text-xs text-zinc-400 leading-relaxed mb-4">{data.origin_info.description}</p>

                                {data.origin_info.top_attractions && data.origin_info.top_attractions.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs font-semibold text-zinc-300 mb-2">Top Attractions:</p>
                                        <div className="grid gap-2">
                                            {data.origin_info.top_attractions.map((attr, idx) => (
                                                <div key={idx} className="bg-white/5 p-3 rounded-lg border border-white/5">
                                                    <h5 className="text-xs font-bold text-zinc-200 mb-1">{attr.name}</h5>
                                                    <p className="text-xs text-zinc-400 leading-relaxed">{attr.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {data.origin_info.hotels && data.origin_info.hotels.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-zinc-300 mb-2">Hotels in {data.origin_info.city_name}:</p>
                                        <div className="grid gap-2">
                                            {data.origin_info.hotels.map((hotel, idx) => (
                                                <div key={idx} className="bg-white/5 p-3 rounded-lg border border-white/5">
                                                    <div className="flex items-start justify-between mb-1">
                                                        <h5 className="text-xs font-bold text-zinc-200">{hotel.name}</h5>
                                                        <span className={clsx(
                                                            "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                                                            hotel.price_range === "Budget" && "bg-green-500/20 text-green-300",
                                                            hotel.price_range === "Mid-Range" && "bg-blue-500/20 text-blue-300",
                                                            hotel.price_range === "Luxury" && "bg-purple-500/20 text-purple-300"
                                                        )}>{hotel.price_range}</span>
                                                    </div>
                                                    <p className="text-xs text-zinc-400 leading-relaxed">{hotel.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function ActivityItem({ activity }: { activity: any }) {
    const [showFullDesc, setShowFullDesc] = useState(false);
    const descPreview = activity.description ? activity.description.substring(0, 150) + '...' : '';
    const shouldTruncate = activity.description && activity.description.length > 150;

    return (
        <div className="bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors border border-white/5">
            {/* Activity Image */}
            {activity.image_url && (
                <div className="w-full h-40 rounded-md overflow-hidden bg-zinc-800 mb-3">
                    <img src={activity.image_url} alt={activity.activity} className="w-full h-full object-cover" />
                </div>
            )}
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-zinc-200 mb-1">{activity.activity}</span>
                <span className="text-xs text-zinc-500 flex items-center gap-1 mb-2">
                    <Clock className="w-3 h-3" /> {activity.time}
                </span>
                {activity.description && (
                    <div>
                        <p className="text-xs text-zinc-400 leading-relaxed mb-2">
                            {showFullDesc ? activity.description : descPreview}
                        </p>
                        {shouldTruncate && (
                            <button
                                onClick={() => setShowFullDesc(!showFullDesc)}
                                className="text-xs text-purple-400 hover:text-purple-300 font-medium mb-2"
                            >
                                {showFullDesc ? 'Show less' : 'Read more'}
                            </button>
                        )}
                    </div>
                )}
                {activity.nearby_attractions && activity.nearby_attractions.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                        <p className="text-xs font-semibold text-zinc-300 mb-1">Nearby:</p>
                        <ul className="text-xs text-zinc-500 space-y-0.5">
                            {activity.nearby_attractions.map((attr: string, idx: number) => (
                                <li key={idx} className="flex items-start">
                                    <span className="mr-1">•</span>
                                    <span>{attr}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {activity.media_credit && (
                    <p className="text-[9px] text-zinc-600 mt-2 italic">{activity.media_credit}</p>
                )}
            </div>
        </div>
    );
}
