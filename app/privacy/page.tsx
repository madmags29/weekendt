import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Weekend Travellers privacy policy - Learn how we protect your data and respect your privacy.",
    robots: {
        index: true,
        follow: true,
    },
};

export default function Privacy() {
    return (
        <div className="min-h-screen bg-black text-white font-sans aurora-bg selection:bg-purple-500/30 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="mb-12">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-6 text-blue-300">
                        <Shield className="w-6 h-6" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-blue-200">
                        Privacy Policy
                    </h1>
                    <p className="text-zinc-400">Last Updated: January 21, 2026</p>
                </div>

                <div className="space-y-12 text-zinc-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Data Collection</h2>
                        <p>
                            Weekend Traveller collects minimal data to function. We process your search queries (destinations, budget, interests) solely to generate travel itineraries. We do not store your personal search history on our servers permanently; it is saved locally on your device for your convenience.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Location Data</h2>
                        <p>
                            If you enable location services, we use your current coordinates to suggest nearby destinations. This location data is processed instantly and is not stored or shared with third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Third-Party Services</h2>
                        <p>
                            We use OpenAI (for itinerary generation) and third-party image providers (Unsplash, Pexels, Pixabay). Your search queries are sent to these providers to generate content. Please refer to their respective privacy policies for more details.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
