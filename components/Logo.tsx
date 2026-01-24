import React from 'react';

interface LogoProps {
    className?: string;
    width?: number;
    height?: number;
}

export default function Logo({ className = '', width = 40, height = 40 }: LogoProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#f4d4a0', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#e8b870', stopOpacity: 1 }} />
                </linearGradient>

                <radialGradient id="lightGradient">
                    <stop offset="0%" style={{ stopColor: '#fff8dc', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#f4d4a0', stopOpacity: 0 }} />
                </radialGradient>
            </defs>

            {/* Outer circle */}
            <circle cx="100" cy="100" r="95" stroke="#2c3e50" strokeWidth="3" fill="none" opacity="0.8">
                <animate attributeName="stroke-width" values="3;4;3" dur="3s" repeatCount="indefinite" />
            </circle>

            {/* Background circle */}
            <circle cx="100" cy="100" r="92" fill="#1a2332" />

            {/* Mountains */}
            <g id="mountains">
                <path d="M 30 110 L 60 60 L 90 110 Z" fill="#2c3e50" opacity="0.9" />
                <path d="M 70 110 L 100 50 L 130 110 Z" fill="#34495e" opacity="0.9" />
                <path d="M 110 110 L 140 70 L 170 110 Z" fill="#2c3e50" opacity="0.9" />
            </g>

            {/* Moon */}
            <g id="moon">
                <circle cx="85" cy="45" r="12" fill="url(#moonGradient)">
                    <animate attributeName="opacity" values="0.8;1;0.8" dur="4s" repeatCount="indefinite" />
                </circle>
                <circle cx="90" cy="43" r="10" fill="#1a2332" opacity="0.3" />
            </g>

            {/* Stars */}
            <g id="stars">
                <circle cx="60" cy="55" r="2" fill="#f4d4a0">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="120" cy="40" r="2.5" fill="#f4d4a0">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
                </circle>
                <circle cx="140" cy="50" r="2" fill="#f4d4a0">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" begin="1s" />
                </circle>
                <circle cx="50" cy="65" r="1.5" fill="#f4d4a0">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2.2s" repeatCount="indefinite" begin="0.3s" />
                </circle>
            </g>

            {/* Road */}
            <rect x="30" y="110" width="140" height="30" fill="#4a5568" opacity="0.6" />
            <line x1="30" y1="125" x2="170" y2="125" stroke="#7f8c8d" strokeWidth="1" strokeDasharray="10,5" opacity="0.5" />

            {/* Car */}
            <g id="car">
                <rect x="75" y="115" width="50" height="20" rx="2" fill="#5a6c7d" />
                <rect x="85" y="105" width="12" height="12" rx="1" fill="#8b7355" />
                <rect x="100" y="107" width="15" height="10" rx="1" fill="#6b5d4f" />
                <rect x="80" y="118" width="15" height="12" fill="#34495e" opacity="0.6" />
                <rect x="105" y="118" width="15" height="12" fill="#34495e" opacity="0.6" />

                {/* Headlights */}
                <ellipse cx="78" cy="125" rx="3" ry="2" fill="#fff8dc">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
                </ellipse>
                <ellipse cx="122" cy="125" rx="3" ry="2" fill="#fff8dc">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
                </ellipse>

                {/* Headlight beams */}
                <line x1="78" y1="125" x2="55" y2="125" stroke="url(#lightGradient)" strokeWidth="8" opacity="0.3">
                    <animate attributeName="opacity" values="0.2;0.4;0.2" dur="1.5s" repeatCount="indefinite" />
                </line>
                <line x1="122" y1="125" x2="145" y2="125" stroke="url(#lightGradient)" strokeWidth="8" opacity="0.3">
                    <animate attributeName="opacity" values="0.2;0.4;0.2" dur="1.5s" repeatCount="indefinite" />
                </line>

                {/* Light rays */}
                <line x1="75" y1="120" x2="50" y2="115" stroke="#f4d4a0" strokeWidth="1.5" opacity="0.4">
                    <animate attributeName="opacity" values="0.2;0.5;0.2" dur="1.5s" repeatCount="indefinite" />
                </line>
                <line x1="75" y1="130" x2="50" y2="135" stroke="#f4d4a0" strokeWidth="1.5" opacity="0.4">
                    <animate attributeName="opacity" values="0.2;0.5;0.2" dur="1.5s" repeatCount="indefinite" begin="0.3s" />
                </line>
                <line x1="125" y1="120" x2="150" y2="115" stroke="#f4d4a0" strokeWidth="1.5" opacity="0.4">
                    <animate attributeName="opacity" values="0.2;0.5;0.2" dur="1.5s" repeatCount="indefinite" begin="0.2s" />
                </line>
                <line x1="125" y1="130" x2="150" y2="135" stroke="#f4d4a0" strokeWidth="1.5" opacity="0.4">
                    <animate attributeName="opacity" values="0.2;0.5;0.2" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
                </line>
            </g>

            {/* Road marks */}
            <g id="roadMarks" opacity="0.6">
                <rect x="85" y="140" width="8" height="2" fill="#2c3e50" />
                <rect x="107" y="140" width="8" height="2" fill="#2c3e50" />
            </g>
        </svg>
    );
}
