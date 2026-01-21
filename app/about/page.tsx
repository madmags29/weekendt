"use client";

import Link from "next/link";
import { ArrowLeft, Compass, Heart, Zap, Globe } from "lucide-react";

export default function About() {
    return (
        <div className="min-h-screen bg-black text-white font-sans aurora-bg selection:bg-purple-500/30 p-6 md:p-12">
            {/* Header */}
            <div className="max-w-4xl mx-auto mb-16">
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-purple-200">
                    About Weekend Traveller
                </h1>
                <p className="text-xl text-zinc-300 font-light leading-relaxed max-w-2xl">
                    We believe the best adventures are just a short drive away. Discover India's hidden gems with the power of Artificial Intelligence.
                </p>
            </div>

            {/* Mission Section */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-6 text-purple-300">
                        <Compass className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">Our Mission</h3>
                    <p className="text-zinc-400 leading-relaxed">
                        To simplify weekend travel planning for everyone. We eliminate the stress of research by instantly generating personalized, end-to-end itineraries tailored to your budget and interests.
                    </p>
                </div>
                <div className="p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm">
                    <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mb-6 text-pink-300">
                        <Heart className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">Why We Built This</h3>
                    <p className="text-zinc-400 leading-relaxed">
                        We realized that people spend more time planning trips than actually enjoying them. Weekend Traveller gives you back that time, turning hours of Googling into seconds of discovery.
                    </p>
                </div>
            </div>

            {/* Technology Section */}
            <div className="max-w-4xl mx-auto mb-20">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <Zap className="w-6 h-6 text-yellow-400" />
                    Powered by Modern Tech
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <TechCard title="Next.js 14" desc="Fast, responsive, and modern frontend framework." />
                    <TechCard title="FastAPI" desc="High-performance Python backend for AI processing." />
                    <TechCard title="OpenAI GPT-4" desc="Advanced reasoning for personalized travel plans." />
                    <TechCard title="Vercel" desc="Seamless global deployment and scaling." />
                </div>
            </div>

            {/* Footer */}
            <div className="max-w-4xl mx-auto border-t border-white/10 pt-12 flex flex-col md:flex-row items-center justify-between text-zinc-500 text-sm">
                <p>&copy; 2024 Weekend Traveller. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                </div>
            </div>
        </div>
    );
}

function TechCard({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-purple-500/30 transition-colors">
            <h4 className="font-bold text-white mb-2">{title}</h4>
            <p className="text-xs text-zinc-500">{desc}</p>
        </div>
    );
}
