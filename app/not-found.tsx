"use client";

import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-zinc-950 px-4 text-center">
            <div className="mb-8 p-4 rounded-full bg-zinc-100 dark:bg-zinc-900">
                <Compass className="h-16 w-16 text-zinc-900 dark:text-white animate-pulse" />
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
                404 - Weekend Not Found
            </h1>
            <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400 max-w-md">
                Looks like this destination is off our map. Let&apos;s get you back to planning your next adventure.
            </p>
            <Link
                href="/"
                className="rounded-full bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
                Back to Home
            </Link>
        </div>
    );
}
