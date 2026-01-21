import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const STEPS = [
    "Analyzing your request...",
    "Scanning global destinations...",
    "Checking weather & best times...",
    "Curating itinerary...",
    "Finalizing details..."
];

export default function ThinkingIndicator() {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % STEPS.length);
        }, 1500); // Change step every 1.5s

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl rounded-tl-none border border-zinc-100 dark:border-zinc-800 animate-in fade-in slide-in-from-left-2">
            <div className="relative">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                </span>
            </div>

            <div className="flex flex-col">
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-0.5">
                    AI Thinking
                </span>
                <span key={currentStep} className="text-sm text-gray-600 dark:text-gray-300 animate-in fade-in slide-in-from-bottom-1 duration-300">
                    {STEPS[currentStep]}
                </span>
            </div>
        </div>
    );
}
