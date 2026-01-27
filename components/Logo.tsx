import React from 'react';
import Image from 'next/image';

interface LogoProps {
    className?: string;
    width?: number;
    height?: number;
}

export default function Logo({ className = '', width = 40, height = 40 }: LogoProps) {
    return (
        <div className={`relative transition-transform duration-300 hover:scale-110 animate-float ${className}`}>
            <Image
                src="/logo.svg"
                alt="Weekend Travellers Logo"
                width={width}
                height={height}
                priority
            />
        </div>
    );
}
