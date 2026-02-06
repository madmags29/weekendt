import { Suspense } from "react";
import TripClient from "./TripClient";

export default function TripPage() {
    return (
        <Suspense fallback={<div className="h-screen w-screen bg-black flex items-center justify-center text-white">Loading trip...</div>}>
            <TripClient />
        </Suspense>
    );
}
