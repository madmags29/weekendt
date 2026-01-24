"use client";

import { useEffect, useState } from 'react';
import Logo from './Logo';

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Minimum loading time of 2 seconds for smooth experience
        const timer = setTimeout(() => {
            setFadeOut(true);
            // Remove preloader after fade out animation
            setTimeout(() => setIsLoading(false), 500);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (!isLoading) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'
                }`}
        >
            <div className="flex flex-col items-center gap-6">
                {/* Animated Logo */}
                <div className="animate-pulse-slow">
                    <Logo width={150} height={150} />
                </div>

                {/* Loading Text */}
                <div className="flex flex-col items-center gap-3">
                    <h2 className="text-2xl font-bold text-white animate-fade-in">
                        Weekend Travellers
                    </h2>

                    {/* Loading Dots */}
                    <div className="flex gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>

                    {/* Loading Bar */}
                    <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden mt-2">
                        <div className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 animate-loading-bar"></div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-loading-bar {
          animation: loading-bar 1.5s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
}
