"use client";

import { useState } from "react";

import { TripPlan, Sightseeing } from "../types";
import { Bot, User, Clock, DollarSign, Navigation } from "lucide-react";
import clsx from "clsx";
import AdSense from "./AdSense";

interface ChatMessageProps {
    role: "user" | "ai";
    content: string;
    data?: TripPlan;
    onSave?: (plan: TripPlan) => void;
}



export default function ChatMessage({ role, content, data, onSave }: ChatMessageProps) {
    const isAi = role === "ai";
    const [expanded, setExpanded] = useState(true); // Start expanded by default

    return (
        <div className={clsx("flex gap-4 w-full max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-500", isAi ? "flex-row" : "flex-row-reverse ml-auto")}>

            {/* Avatar */}
            <div className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg transition-colors",
                isAi
                    ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white ring-2 ring-purple-500/20"
                    : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 ring-2 ring-gray-200 dark:ring-zinc-700"
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
                    "px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-md backdrop-blur-md transition-colors",
                    isAi
                        ? "bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm"
                        : "bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-tr-none font-medium"
                )}>
                    {content}
                </div>

                {/* AdSense temporarily disabled for debugging */}
                {/* {isAi && (
                    <div className="w-full max-w-2xl mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                        <AdSense className="w-full min-h-[90px]" format="fluid" />
                    </div>
                )} */}

                {/* Rich Content (Trip Plan Card) */}
                {isAi && data && (
                    <div className="w-full mt-2 bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-5 ring-1 ring-black/5 transition-colors">
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
                        <div className="grid grid-cols-3 divide-x divide-gray-200 border-b border-gray-200 bg-gray-50/50">
                            <div className="p-4 flex flex-col items-center text-center gap-1">
                                <Clock className="w-5 h-5 text-blue-500" />
                                <span className="text-xs font-medium text-gray-600 leading-tight">{data.best_time_to_visit || 'N/A'}</span>
                            </div>
                            <div className="p-4 flex flex-col items-center text-center gap-1">
                                <span className="text-2xl font-bold text-green-600">{data.currency_symbol || '$'}</span>
                                <span className="text-xs font-medium text-gray-600 leading-tight">{(data.estimated_budget || '').replace('$', '').replace('USD', '') || 'N/A'}</span>
                            </div>
                            <div className="p-4 flex flex-col items-center text-center gap-1">
                                <Navigation className="w-5 h-5 text-purple-500" />
                                <span className="text-xs font-medium text-gray-600 leading-tight">{data.route_info?.distance || 'N/A'}</span>
                            </div>
                        </div>

                        {/* AdSense Banner - Disabled */}
                        {/* AdSense Banner */}
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Sponsored</span>
                            <AdSense className="min-h-[100px] w-full" />
                        </div>

                        {/* Itinerary Snippet */}
                        <div className="p-6 bg-white">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Itinerary</p>
                                {data.itinerary.length > 2 && (
                                    <button
                                        onClick={() => setExpanded(!expanded)}
                                        className="text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors"
                                    >
                                        {expanded ? "Collapse" : "View Full Plan"}
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                {(expanded ? (data.itinerary || []) : (data.itinerary || []).slice(0, 2)).map((day, i) => (
                                    <div key={`${day.day}-${i}`} className="flex gap-4 group/day animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <div className="flex-col items-center hidden sm:flex pt-1">
                                            <div className="w-3 h-3 rounded-full bg-purple-500 ring-4 ring-purple-100 group-hover/day:bg-purple-600 transition-colors" />
                                            <div className="w-0.5 h-full bg-gray-200 -mb-6 mt-2" />
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <p className="text-base font-bold text-gray-800 mb-3 flex items-center gap-3">
                                                Day {day.day}
                                                <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-500 font-normal">
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

                            {!expanded && (data.itinerary?.length || 0) > 2 && (
                                <div className="text-center mt-6 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => setExpanded(true)}
                                        className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-full"
                                    >
                                        +{data.itinerary.length - 2} more days
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Hotels Section */}
                        {data.hotels && data.hotels.length > 0 && (
                            <div className="p-6 bg-gray-50 border-t border-gray-200">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Recommended Hotels</p>
                                <div className="grid gap-3">
                                    {data.hotels.map((hotel, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all shadow-sm">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="text-sm font-bold text-gray-800">{hotel.name}</h4>
                                                <span className={clsx(
                                                    "text-xs px-2 py-0.5 rounded-full font-medium",
                                                    hotel.price_range === "Budget" && "bg-green-100 text-green-700",
                                                    hotel.price_range === "Mid-Range" && "bg-blue-100 text-blue-700",
                                                    hotel.price_range === "Luxury" && "bg-purple-100 text-purple-700"
                                                )}>{hotel.price_range}</span>
                                            </div>
                                            <p className="text-xs text-gray-600 leading-relaxed">{hotel.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* City Detail Info (Destination Only) */}
                        {data.destination_info && (
                            <div className="p-6 bg-white border-t border-gray-200">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                                    About {data.destination_info.city_name}
                                </p>
                                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                                    {data.destination_info.description}
                                </p>

                                {data.destination_info.top_attractions && data.destination_info.top_attractions.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs font-semibold text-gray-800 mb-2">Top Attractions:</p>
                                        <div className="grid gap-2">
                                            {data.destination_info.top_attractions.map((attr, idx) => (
                                                <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100 shadow-sm">
                                                    <h5 className="text-xs font-bold text-gray-800 mb-1">{attr.name}</h5>
                                                    <p className="text-xs text-gray-600 leading-relaxed">{attr.description}</p>
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

function ActivityItem({ activity }: { activity: Sightseeing }) {
    const [showFullDesc, setShowFullDesc] = useState(false);
    const descPreview = activity.description ? activity.description.substring(0, 150) + '...' : '';
    const shouldTruncate = activity.description && activity.description.length > 150;

    return (
        <div className="bg-white p-3 rounded-lg hover:shadow-md transition-all border border-gray-200 shadow-sm">
            {/* Activity Image */}
            {activity.image_url && (
                <div className="w-full h-40 rounded-md overflow-hidden bg-gray-100 mb-3">
                    <img src={activity.image_url} alt={activity.activity} className="w-full h-full object-cover" />
                </div>
            )}
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800 mb-1">{activity.activity}</span>
                <span className="text-xs text-gray-500 flex items-center gap-2 mb-2 bg-gray-100 px-2 py-1 rounded w-fit">
                    <Clock className="w-3 h-3 text-purple-500" />
                    <span className="font-bold text-gray-700">{activity.time}</span>
                </span>
                {activity.description && (
                    <div>
                        <p className="text-xs text-gray-600 leading-relaxed mb-2">
                            {showFullDesc ? activity.description : descPreview}
                        </p>
                        {shouldTruncate && (
                            <button
                                onClick={() => setShowFullDesc(!showFullDesc)}
                                className="text-xs text-purple-600 hover:text-purple-500 font-medium mb-2"
                            >
                                {showFullDesc ? 'Show less' : 'Read more'}
                            </button>
                        )}
                    </div>
                )}
                {activity.nearby_attractions && activity.nearby_attractions.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 mb-1">Nearby:</p>
                        <ul className="text-xs text-gray-500 space-y-0.5">
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
                    <p className="text-[9px] text-gray-400 mt-2 italic">{activity.media_credit}</p>
                )}
            </div>
        </div>
    );
}
