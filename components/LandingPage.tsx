"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ArrowRight, Menu, X, Home, History, Settings, Info, Instagram, Youtube } from "lucide-react";
import { useRouter } from "next/navigation";
import Logo from "./Logo";

interface LandingPageProps {
    onSearch: (query: string) => void;
}

const DESTINATIONS = [
    { name: "Paris", image: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&h=400", desc: "City of Light" },
    { name: "New York", image: "https://images.pexels.com/photos/2224861/pexels-photo-2224861.jpeg?auto=compress&cs=tinysrgb&h=400", desc: "The Big Apple" },
    { name: "Tokyo", image: "https://images.pexels.com/photos/3532553/pexels-photo-3532553.jpeg?auto=compress&cs=tinysrgb&h=400", desc: "Neon & Tradition" },
    { name: "Dubai", image: "https://images.pexels.com/photos/162031/dubai-tower-arab-khalifa-162031.jpeg?auto=compress&cs=tinysrgb&h=400", desc: "Desert Luxury" },
    { name: "London", image: "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&h=400", desc: "Historic Charm" },
];

export default function LandingPage({ onSearch }: LandingPageProps) {

    const [videoData, setVideoData] = useState<{ url: string, credit: string, source: string } | null>(null);
    const [query, setQuery] = useState("");
    const [loaded, setLoaded] = useState(false);
    const router = useRouter();

    // Dynamic Recommendations State
    const [destinations, setDestinations] = useState(DESTINATIONS);
    const [loadingRecs, setLoadingRecs] = useState(false);

    // Menu State
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

        // Fallback video in case API fails
        const fallbackVideo = {
            url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            credit: "Google Sample",
            source: "Google"
        };

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
                } else {
                    // No videos returned, use fallback
                    setVideoData(fallbackVideo);
                }
            })
            .catch(err => {
                console.error("Failed to fetch background videos:", err);
                // Use fallback video on error
                setVideoData(fallbackVideo);
            });

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



    return (
        <div className="relative h-screen w-screen max-w-[100vw] overflow-x-hidden overflow-hidden bg-black text-zinc-100 font-sans transition-colors duration-500">
            {/* Background Video (Only visible in Dark Mode or reduced opacity in Light) */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
                {videoData && (
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        disablePictureInPicture
                        disableRemotePlayback
                        className="w-full h-full object-cover opacity-30 transition-opacity duration-500"
                    >
                        <source src={videoData.url} type="video/mp4" />
                    </video>
                )}
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90 transition-colors duration-500" />

                {/* Video Credit */}
                {videoData && videoData.credit && (
                    <div className="absolute bottom-4 right-4 z-20 text-[10px] text-zinc-400 uppercase tracking-widest pointer-events-none">
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
            <div className={`absolute top-0 left-0 bottom-0 z-50 w-72 bg-zinc-900/90 backdrop-blur-xl border-r border-zinc-800 shadow-2xl transition-transform duration-300 ease-in-out transform ${showMenu ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold tracking-tight text-white">Menu</h2>
                        <button onClick={() => setShowMenu(false)} className="p-3 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <nav className="flex-1 space-y-2">
                        <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-white/10 text-white font-medium">
                            <Home className="w-5 h-5" />
                            Home
                        </button>
                        <Link href="/my-trips" className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors">
                            <History className="w-5 h-5" />
                            My Trips
                        </Link>
                        <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors">
                            <Settings className="w-5 h-5" />
                            Settings
                        </button>
                        <Link href="/about" className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors">
                            <Info className="w-5 h-5" />
                            About
                        </Link>
                    </nav>

                    <div className="mt-6 pt-6 border-t border-zinc-800">

                    </div>

                    <div className="mt-auto pt-6 border-t border-zinc-800">
                        <div className="flex items-center gap-4 mb-4">
                            <a
                                href="https://www.instagram.com/weekendtravellers.official"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-400 hover:text-pink-500 transition-colors"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://www.youtube.com/@weekendtravellers.official"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-400 hover:text-red-500 transition-colors"
                            >
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                        <p className="text-xs text-zinc-500">WeekendTraveller v1.0</p>
                    </div>
                </div>
            </div>

            {/* Top Left Menu */}
            <button
                onClick={() => setShowMenu(true)}
                className={`absolute top-6 left-6 z-30 p-3 bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white transition-all hover:scale-105 ${showMenu ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Top Right Theme Toggle Removed */}

            {/* Content Centered */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">

                {/* Logo */}
                <div className="mb-6">
                    <Logo width={120} height={120} className="drop-shadow-2xl brightness-110" />
                </div>

                {/* Hero Text */}
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-2 drop-shadow-2xl text-white px-2 transition-colors duration-500">
                    Global Weekend Trip Planner
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-zinc-300 mb-6 md:mb-12 font-light tracking-wide drop-shadow-md px-4 transition-colors duration-500">
                    Discover the world&apos;s best weekend getaways with AI.
                </p>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="w-full max-w-2xl px-4 md:px-0 mb-12 md:mb-16 group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full opacity-30 group-hover:opacity-60 transition duration-500 blur-lg"></div>
                    <div className="relative flex items-center bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50 rounded-full p-2 transition-all group-focus-within:bg-zinc-900 group-focus-within:border-purple-500/50 shadow-2xl">
                        <Search className="w-6 h-6 text-zinc-400 ml-4 flex-shrink-0" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Where do you want to start?"
                            autoComplete="off"
                            className="flex-1 min-w-0 bg-transparent border-none text-white text-base md:text-lg px-4 py-3 focus:ring-0 focus:outline-none placeholder-zinc-500 font-light"
                        />
                        <button
                            type="submit"
                            className="bg-white text-black p-3 rounded-full hover:bg-zinc-200 transition-colors shadow-lg flex-shrink-0"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </form>

                {/* Top Destinations Cards - HIDDEN ON MOBILE */}
                <div className="hidden md:block w-full max-w-5xl px-4">
                    {loadingRecs ? (
                        <div className="text-zinc-500 animate-pulse">Finding hidden gems near you...</div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {destinations.map((dest) => (
                                <div
                                    key={dest.name}
                                    onClick={() => router.push(`/trip?id=new&query=${encodeURIComponent(dest.name)}`)}
                                    className="group relative h-48 md:h-64 rounded-2xl overflow-hidden cursor-pointer border border-zinc-800 hover:border-purple-500/50 transition-all shadow-lg hover:-translate-y-1"
                                >
                                    <img
                                        src={dest.image}
                                        alt={dest.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 p-4 text-left">
                                        <h3 className="text-xl font-bold text-white">{dest.name}</h3>
                                        <p className="text-sm text-gray-400 line-clamp-2 italic">&quot;{dest.desc}&quot;</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Social Media Links (Bottom Right) */}
            <div className="absolute bottom-6 left-6 z-30 flex gap-4">
                <a
                    href="https://www.instagram.com/weekendtravellers.official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-zinc-400 hover:text-pink-500 transition-all hover:scale-110 shadow-lg"
                    aria-label="Instagram"
                >
                    <Instagram className="w-5 h-5" />
                </a>
                <a
                    href="https://www.youtube.com/@weekendtravellers.official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-zinc-400 hover:text-red-500 transition-all hover:scale-110 shadow-lg"
                    aria-label="YouTube"
                >
                    <Youtube className="w-5 h-5" />
                </a>
            </div>
        </div>
    );
}
