"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, ArrowRight, Menu, X, Home, History, Settings, Info, Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface LandingPageProps {
    onSearch: (query: string) => void;
}

const DESTINATIONS = [
    { name: "Goa", image: "https://images.pexels.com/photos/4429334/pexels-photo-4429334.jpeg?auto=compress&cs=tinysrgb&h=400", desc: "Beaches & Sun" },
    { name: "Jaipur", image: "https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&h=400", desc: "The Pink City" },
    { name: "Kerala", image: "https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&h=400", desc: "Backwaters" },
    { name: "Manali", image: "https://images.pexels.com/photos/2583852/pexels-photo-2583852.jpeg?auto=compress&cs=tinysrgb&h=400", desc: "Mountain Calm" },
    { name: "Ladakh", image: "https://images.pexels.com/photos/10046279/pexels-photo-10046279.jpeg?auto=compress&cs=tinysrgb&h=400", desc: "High Passes" },
];

export default function LandingPage({ onSearch }: LandingPageProps) {
    const { theme, setTheme } = useTheme();
    const [videoData, setVideoData] = useState<{ url: string, credit: string, source: string } | null>(null);
    const [query, setQuery] = useState("");
    const [loaded, setLoaded] = useState(false);

    // Dynamic Recommendations State
    const [destinations, setDestinations] = useState(DESTINATIONS);
    const [loadingRecs, setLoadingRecs] = useState(false);

    // Menu State
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

        // 1. Fetch background videos
        fetch(`${API_URL}/background-videos`)
            .then(res => {
                if (!res.ok) throw new Error(`Status ${res.status}`);
                return res.json();
            })
            .then(videos => {
                if (videos && videos.length > 0) {
                    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
                    if (typeof randomVideo === 'string') {
                        setVideoData({ url: randomVideo, credit: "", source: "" });
                    } else {
                        setVideoData(randomVideo);
                    }
                }
            })
            .catch(err => console.error("Failed to fetch background videos:", err));

        // 2. Fetch User Location & Recommendations
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLoadingRecs(true);
                    fetch(`${API_URL}/recommendations?lat=${latitude}&lng=${longitude}`)
                        .then(res => res.json())
                        .then(data => {
                            if (data.destinations && data.destinations.length > 0) {
                                // Map to UI format
                                const newDestinations = data.destinations.map((d: { name: string; image_url?: string; description: string }) => ({
                                    name: d.name,
                                    image: d.image_url || "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg", // Fallback
                                    desc: d.description
                                }));
                                setDestinations(newDestinations);
                            }
                        })
                        .catch(err => console.error("Failed to fetch recommendations", err))
                        .finally(() => setLoadingRecs(false));
                },
                (error) => {
                    console.log("Location denied or error:", error);
                    // Keep default DESTINATIONS
                }
            );
        }

        // Appear flush
        setTimeout(() => setLoaded(true), 100);
    }, []);

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-gray-50 dark:bg-black text-zinc-900 dark:text-white font-sans transition-colors duration-500">
            {/* Background Video (Only visible in Dark Mode or reduced opacity in Light) */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
                {videoData && (
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover opacity-20 dark:opacity-60 transition-opacity duration-500"
                    >
                        <source src={videoData.url} type="video/mp4" />
                    </video>
                )}
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 dark:from-black/30 via-white/10 dark:via-black/10 to-white/80 dark:to-black/80 transition-colors duration-500" />

                {/* Video Credit */}
                {videoData && videoData.credit && (
                    <div className="absolute bottom-4 right-4 z-20 text-[10px] text-zinc-400 dark:text-zinc-500/50 uppercase tracking-widest pointer-events-none">
                        Video by {videoData.credit} on {videoData.source}
                    </div>
                )}
            </div>

            {/* LEFT SIDEBAR MENU */}
            {/* Overlay */}
            <div
                className={`absolute inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${showMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setShowMenu(false)}
            />

            {/* Sidebar Panel */}
            <div className={`absolute top-0 left-0 bottom-0 z-50 w-72 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-r border-gray-200 dark:border-white/10 shadow-2xl transition-transform duration-300 ease-in-out transform ${showMenu ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Menu</h2>
                        <button onClick={() => setShowMenu(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-zinc-600 dark:text-zinc-300">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <nav className="flex-1 space-y-2">
                        <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-black/5 dark:bg-white/10 text-zinc-900 dark:text-white font-medium">
                            <Home className="w-5 h-5" />
                            Home
                        </button>
                        <Link href="/my-trips" className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                            <History className="w-5 h-5" />
                            My Trips
                        </Link>
                        <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                            <Settings className="w-5 h-5" />
                            Settings
                        </button>
                        <Link href="/about" className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                            <Info className="w-5 h-5" />
                            About
                        </Link>
                    </nav>

                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
                        <button
                            onClick={toggleTheme}
                            className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                        >
                            <span className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white">
                                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                            </span>
                            <div className={`w-10 h-5 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-purple-600' : 'bg-zinc-300'}`}>
                                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-transform ${theme === 'dark' ? 'left-6' : 'left-1'}`} />
                            </div>
                        </button>
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-200 dark:border-white/5">
                        <p className="text-xs text-zinc-500">WeekendTraveller v1.0</p>
                    </div>
                </div>
            </div>

            {/* Menu Toggle Button (Visible when menu is closed) */}
            <button
                onClick={() => setShowMenu(true)}
                className={`absolute top-6 left-6 z-30 p-2.5 bg-white/20 dark:bg-black/20 hover:bg-white/40 dark:hover:bg-black/40 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-full text-zinc-900 dark:text-white transition-all hover:scale-105 ${showMenu ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Content Centered */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">

                {/* Hero Text */}
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-2 drop-shadow-2xl bg-clip-text text-transparent bg-gradient-to-b from-zinc-800 to-zinc-500 dark:from-white dark:to-white/70 px-2 transition-colors duration-500">
                    Weekend Traveller
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-100 mb-8 md:mb-12 font-light tracking-wide drop-shadow-md px-4 transition-colors duration-500">
                    Discover India's hidden gems with AI.
                </p>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="w-full max-w-2xl mb-12 md:mb-16 group relative px-4">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full opacity-30 group-hover:opacity-60 transition duration-500 blur-lg"></div>
                    <div className="relative flex items-center bg-white/50 dark:bg-white/10 backdrop-blur-xl border border-gray-200 dark:border-white/20 rounded-full p-2 transition-all group-focus-within:bg-white/80 dark:group-focus-within:bg-black/40 group-focus-within:border-purple-300 dark:group-focus-within:border-white/40 shadow-2xl">
                        <Search className="w-6 h-6 text-zinc-400 dark:text-zinc-300 ml-4" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Where do you want to start?"
                            autoComplete="off"
                            className="flex-1 bg-transparent border-none text-zinc-900 dark:text-white text-lg px-4 py-3 focus:ring-0 focus:outline-none placeholder-zinc-500 dark:placeholder-zinc-400 font-light"
                        />
                        <button
                            type="submit"
                            className="bg-zinc-900 dark:bg-white text-white dark:text-black p-3 rounded-full hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors shadow-lg"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </form>

                {/* Top Destinations Cards */}
                {loadingRecs ? (
                    <div className="text-zinc-500 dark:text-zinc-400 animate-pulse">Finding hidden gems near you...</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-5xl px-4">
                        {destinations.map((dest) => (
                            <div
                                key={dest.name}
                                onClick={() => onSearch(dest.name)}
                                className="group relative h-48 md:h-64 rounded-2xl overflow-hidden cursor-pointer border border-gray-200 dark:border-white/10 hover:border-purple-400 dark:hover:border-white/40 transition-all shadow-lg hover:-translate-y-1"
                            >
                                <img
                                    src={dest.image}
                                    alt={dest.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 dark:opacity-80 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-4 text-left">
                                    <h3 className="text-xl font-bold text-white">{dest.name}</h3>
                                    <p className="text-sm text-gray-300 line-clamp-2 italic">&quot;{dest.desc}&quot;</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
