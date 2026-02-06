"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Trash2 } from "lucide-react";
import { TripPlan } from "../../types";

interface SavedTrip {
    id: string;
    plan: TripPlan;
    date: string;
}

export default function MyTrips() {
    const [trips, setTrips] = useState<SavedTrip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTrips = () => {
            try {
                const stored = localStorage.getItem("weekend_trips_history");
                if (stored) {
                    // Sort by newest first
                    const parsed = JSON.parse(stored) as SavedTrip[];
                    setTrips(parsed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
                }
            } catch (e) {
                console.error("Failed to load trips", e);
            } finally {
                setLoading(false);
            }
        };
        loadTrips();
    }, []);

    const deleteTrip = (id: string, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation();

        if (confirm("Are you sure you want to delete this trip?")) {
            const newTrips = trips.filter(t => t.id !== id);
            setTrips(newTrips);
            localStorage.setItem("weekend_trips_history", JSON.stringify(newTrips));
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans aurora-bg selection:bg-purple-500/30 p-6 md:p-12">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-12 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors text-zinc-300 hover:text-white group">
                        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                        My Trips
                    </h1>
                </div>
                <div className="text-zinc-500 text-sm font-medium">
                    {trips.length} Adventure{trips.length !== 1 ? 's' : ''} Saved
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-6xl mx-auto">
                {loading ? (
                    <div className="text-zinc-500 animate-pulse">Loading your history...</div>
                ) : trips.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm">
                        <MapPin className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-zinc-300 mb-2">No trips saved yet</h3>
                        <p className="text-zinc-500 mb-8">Start your journey by searching for a destination.</p>
                        <Link href="/" className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-zinc-200 transition-colors">
                            Plan a Trip
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trips.map((trip) => (
                            <Link
                                key={trip.id}
                                href={`/trip?id=${trip.id}`}
                                className="group relative block bg-zinc-900/50 rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1"
                            >
                                {/* Image Area */}
                                <div className="h-48 relative overflow-hidden">
                                    {trip.plan.hero_image ? (
                                        <img
                                            src={trip.plan.hero_image}
                                            alt={trip.plan.destination}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                                        <Calendar className="w-3 h-3 text-zinc-300" />
                                        <span className="text-xs text-zinc-200 font-medium">
                                            {new Date(trip.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">{trip.plan.destination}</h3>
                                        <button
                                            onClick={(e) => deleteTrip(trip.id, e)}
                                            className="text-zinc-600 hover:text-red-400 p-1 rounded transition-colors z-20 relative"
                                            title="Delete Trip"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="space-y-2 mt-4">
                                        <div className="flex items-center justify-between text-sm text-zinc-400">
                                            <span>Duration</span>
                                            <span className="text-zinc-200 font-medium">{trip.plan.itinerary.length} Days</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-zinc-400">
                                            <span>Budget</span>
                                            <span className="text-zinc-200 font-medium">{trip.plan.estimated_budget}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
