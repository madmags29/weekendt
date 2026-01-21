"use client";

import { useState } from "react";
import { Search, MapPin, Calendar, Wallet, Plane, Car, Train } from "lucide-react";
import { SearchRequest } from "../types";

interface SearchFormProps {
    onSearch: (data: SearchRequest) => void;
    isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [budget, setBudget] = useState("");
    const [days, setDays] = useState(2);
    const [travelMode, setTravelMode] = useState<"flight" | "drive" | "train">("flight");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch({
            origin,
            destination: destination || undefined,
            budget: budget || undefined,
            days,
            travel_mode: travelMode,
        });
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Plan Your Weekend Getaway</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Origin */}
                        <div className="relative group">
                            <label className="block text-sm font-medium text-gray-300 mb-1">From</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3  text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={origin}
                                    onChange={(e) => setOrigin(e.target.value)}
                                    placeholder="e.g. Delhi"
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Destination */}
                        <div className="relative group">
                            <label className="block text-sm font-medium text-gray-300 mb-1">To (Optional)</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type="text"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="Anywhere"
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Budget */}
                        <div className="relative group">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Budget</label>
                            <div className="relative">
                                <Wallet className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    placeholder="e.g. 15000"
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Days */}
                        <div className="relative group">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Days</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <select
                                    value={days}
                                    onChange={(e) => setDays(Number(e.target.value))}
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all appearance-none"
                                >
                                    {[1, 2, 3, 4, 5, 7, 10].map((d) => (
                                        <option key={d} value={d} className="bg-zinc-800 text-white">
                                            {d} Days
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Travel Mode */}
                        <div className="relative group">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Travel Mode</label>
                            <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                                <button
                                    type="button"
                                    onClick={() => setTravelMode("flight")}
                                    className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-all ${travelMode === "flight"
                                            ? "bg-blue-600 text-white shadow-lg"
                                            : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    <Plane className="w-5 h-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTravelMode("drive")}
                                    className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-all ${travelMode === "drive"
                                            ? "bg-blue-600 text-white shadow-lg"
                                            : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    <Car className="w-5 h-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTravelMode("train")}
                                    className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-all ${travelMode === "train"
                                            ? "bg-blue-600 text-white shadow-lg"
                                            : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    <Train className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Generating Itinerary..." : "Plan My Trip"}
                    </button>
                </form>
            </div>
        </div>
    );
}
