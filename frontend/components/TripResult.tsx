import { TripPlan } from "../types";
import { MapPin, Clock, IndianRupee, Navigation } from "lucide-react";
import TypewriterText from "./TypewriterText";

interface TripResultProps {
    plan: TripPlan;
}

export default function TripResult({ plan }: TripResultProps) {
    return (
        <div className="w-full max-w-4xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="glass-panel backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl">

                {/* Header Image / Map Placeholder */}
                <div className="h-64 bg-slate-900 relative flex items-center justify-center overflow-hidden">
                    {plan.hero_video ? (
                        <video
                            src={plan.hero_video}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                        />
                    ) : (
                        <img
                            src={plan.hero_image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80"}
                            alt={plan.destination}
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                        />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    <div className="z-10 text-center">
                        <h2 className="text-5xl font-bold text-white mb-2 tracking-tight">{plan.destination}</h2>
                        <div className="flex items-center justify-center gap-2 text-white/80">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm font-medium tracking-wide uppercase">Explore</span>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {/* Key Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-500 rounded-lg text-white">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Best Time</h3>
                            </div>
                            <p className="text-sm text-blue-800 dark:text-blue-200">{plan.best_time_to_visit}</p>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-500 rounded-lg text-white">
                                    <IndianRupee className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-green-900 dark:text-green-100">Budget</h3>
                            </div>
                            <p className="text-sm text-green-800 dark:text-green-200">{plan.estimated_budget}</p>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-purple-500 rounded-lg text-white">
                                    <Navigation className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-purple-900 dark:text-purple-100">Route</h3>
                            </div>
                            <p className="text-sm text-purple-800 dark:text-purple-200">
                                {plan.route_info.distance} • {plan.route_info.duration}
                            </p>
                        </div>
                    </div>

                    <hr className="border-gray-200 dark:border-gray-800 my-8" />

                    {/* Itinerary */}
                    <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Itinerary</h3>
                    <div className="space-y-8">
                        {plan.itinerary.map((day) => (
                            <div key={day.day} className="relative pl-8 border-l-2 border-purple-200 dark:border-purple-800">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-600 border-4 border-white dark:border-zinc-900" />
                                <h4 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-400">Day {day.day}</h4>
                                <div className="space-y-4">
                                    {day.activities.map((activity, idx) => {
                                        // Calculate a staggered delay: (Day Index * 3 + Activity Index) * 1000
                                        // But we don't have day index here nicely without prop drilling or mapping index
                                        // Let's use a simpler heuristics or just map index
                                        const globalIndex = (day.day - 1) * 3 + idx;
                                        return (
                                            <div key={idx} className="bg-zinc-50 dark:bg-zinc-800/50 p-5 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300 group border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700">
                                                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                                                    {/* Time & Image Column */}
                                                    <div className="flex flex-row sm:flex-col items-center sm:items-start gap-3 shrink-0">
                                                        <span className="inline-flex items-center justify-center px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-bold tracking-wide border border-purple-200 dark:border-purple-800 shadow-sm w-24">
                                                            {activity.time}
                                                        </span>

                                                        {activity.image_url && (
                                                            <div className="w-24 h-24 sm:w-24 sm:h-24 rounded-xl overflow-hidden shadow-md bg-zinc-200 dark:bg-zinc-700 mt-0 sm:mt-2">
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
                                                        <h5 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                                                            {activity.activity}
                                                        </h5>
                                                        <TypewriterText
                                                            text={activity.description}
                                                            className="text-base text-gray-600 dark:text-gray-400 leading-relaxed"
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
            </div>
        </div>
    );
}
