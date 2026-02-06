import { useEffect } from "react";
import ShareButton from "./ShareButton";
import { TripPlan } from "../types";
import { MapPin, Clock, DollarSign, Navigation } from "lucide-react";
import TypewriterText from "./TypewriterText";
import AdSense from "./AdSense";

interface TripResultProps {
    plan: TripPlan;
}

export default function TripResult({ plan }: TripResultProps) {
    useEffect(() => {
        if (plan.destination) {
            document.title = `Trip to ${plan.destination} | Weekend Travellers`;

            // Update meta description safely
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.setAttribute('name', 'description');
                document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute("content", `Plan your perfect weekend trip to ${plan.destination}. Complete itinerary, budget estimate: ${plan.estimated_budget}, best time: ${plan.best_time_to_visit}. AI-powered travel planning.`);
        }
    }, [plan]);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        "name": `Weekend Trip to ${plan.destination}`,
        "description": `Comprehensive trip plan to ${plan.destination}. Includes itinerary, hotels, and budget estimates.`,
        "provider": {
            "@type": "Organization",
            "name": "Weekend Travellers",
            "url": "https://weekendtravellers.com"
        },
        "itinerary": plan.itinerary.map(day => ({
            "@type": "ItemList",
            "name": `Day ${day.day}`,
            "itemListElement": day.activities.map((act, idx) => ({
                "@type": "TouristAttraction",
                "position": idx + 1,
                "name": act.activity,
                "description": act.description
            }))
        }))
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-gray-200">

                {/* Header Image / Map Placeholder */}
                <div className="h-64 bg-slate-100 relative flex items-center justify-center overflow-hidden">
                    {plan.hero_video ? (
                        <video
                            src={plan.hero_video}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover opacity-90"
                        />
                    ) : (
                        <img
                            src={plan.hero_image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80"}
                            alt={plan.destination}
                            className="absolute inset-0 w-full h-full object-cover opacity-90"
                        />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />

                    <div className="z-10 text-center">
                        <h2 className="text-5xl font-bold text-white mb-2 tracking-tight drop-shadow-md">{plan.destination}</h2>
                        <div className="flex items-center justify-center gap-2 text-white/90">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm font-medium tracking-wide uppercase">Explore</span>
                        </div>
                    </div>

                    {/* Share Button */}
                    <div className="absolute top-4 right-4 z-20">
                        <ShareButton
                            title={`Trip to ${plan.destination}`}
                            text={`Check out this weekend trip plan to ${plan.destination}!\n\nBest Time: ${plan.best_time_to_visit}\nBudget: ${plan.estimated_budget}\nDuration: ${plan.route_info.duration}`}
                        />
                    </div>
                </div>

                <div className="p-8">
                    {/* Key Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-500 rounded-lg text-white">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-blue-900">Best Time</h3>
                            </div>
                            <p className="text-sm text-blue-800">{plan.best_time_to_visit}</p>
                        </div>

                        <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-500 rounded-lg text-white font-bold text-lg w-10 h-10 flex items-center justify-center">
                                    {trip.plan.currency_symbol || '$'}
                                </div>
                                <h3 className="font-semibold text-green-900">Budget</h3>
                            </div>
                            <p className="text-sm text-green-800">{plan.estimated_budget.replace('$', '').replace('USD', '')}</p>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-purple-500 rounded-lg text-white">
                                    <Navigation className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-purple-900">Route</h3>
                            </div>
                            <p className="text-sm text-purple-800">
                                {plan.route_info.distance} • {plan.route_info.duration}
                            </p>
                        </div>
                    </div>

                    {plan.destination_info && plan.destination_info.top_attractions && plan.destination_info.top_attractions.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold mb-6 text-gray-900">Don't Miss</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {plan.destination_info.top_attractions.map((attraction, idx) => (
                                    <div key={idx} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                                        {attraction.image_url && (
                                            <div className="h-48 overflow-hidden bg-gray-100 relative">
                                                <img
                                                    src={attraction.image_url}
                                                    alt={attraction.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                                {attraction.media_credit && (
                                                    <div className="absolute bottom-0 right-0 bg-black/50 text-white text-[10px] px-2 py-1 truncate max-w-full">
                                                        {attraction.media_credit}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className="p-5">
                                            <h4 className="font-bold text-gray-800 mb-2 text-lg">{attraction.name}</h4>
                                            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{attraction.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {plan.hotels && plan.hotels.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold mb-6 text-gray-900">Where to Stay</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {plan.hotels.map((hotel, idx) => (
                                    <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                        <h4 className="font-bold text-gray-800 mb-2">{hotel.name}</h4>
                                        <p className="text-xs font-bold text-green-600 bg-green-50 inline-block px-2 py-1 rounded-md mb-3">
                                            {hotel.price_range}
                                        </p>
                                        <p className="text-sm text-gray-600 line-clamp-3">{hotel.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <hr className="border-gray-200 my-8" />

                    {/* Itinerary */}
                    <h3 className="text-2xl font-bold mb-6 text-gray-900">Itinerary</h3>
                    <div className="space-y-8">
                        {plan.itinerary.map((day) => (
                            <div key={day.day} className="relative pl-8 border-l-2 border-purple-200">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-600 border-4 border-white" />
                                <h4 className="text-xl font-semibold mb-4 text-purple-700">Day {day.day}</h4>
                                <div className="space-y-4">
                                    {day.activities.map((activity, idx) => {
                                        const globalIndex = (day.day - 1) * 3 + idx;
                                        return (
                                            <div key={idx} className="bg-gray-50 p-5 rounded-2xl hover:bg-gray-100 transition-all duration-300 group border border-transparent hover:border-gray-200 shadow-sm border-gray-100">
                                                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                                                    {/* Time & Image Column */}
                                                    <div className="flex flex-row sm:flex-col items-center sm:items-start gap-3 shrink-0">
                                                        <span className="inline-flex items-center justify-center px-3 py-1.5 bg-purple-100 text-purple-800 rounded-lg text-sm font-extrabold tracking-wide border border-purple-200 shadow-sm min-w-[6rem]">
                                                            {activity.time}
                                                        </span>

                                                        {activity.image_url && (
                                                            <div className="w-24 h-24 sm:w-24 sm:h-24 rounded-xl overflow-hidden shadow-md bg-gray-200 mt-0 sm:mt-2">
                                                                <img
                                                                    src={activity.image_url}
                                                                    alt={activity.activity}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Content Column */}
                                                    <div className="flex-1 min-w-0 pt-1">
                                                        <h5 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-purple-700 transition-colors">
                                                            {activity.activity}
                                                        </h5>
                                                        <TypewriterText
                                                            text={activity.description}
                                                            className="text-base text-gray-600 leading-relaxed"
                                                            speed={15}
                                                            delay={globalIndex * 1200}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>))}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Sponsored</h3>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <AdSense className="w-full min-h-[100px]" />
                    </div>
                </div>
            </div>
        </div>
    );
}
