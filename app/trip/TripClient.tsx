"use client";

import { useParams, useSearchParams } from "next/navigation";
import ChatLayout from "../../components/ChatLayout";

export default function TripClient() {
    const searchParams = useSearchParams();

    // Valid query params: ?id=... & ?query=...
    const idParam = searchParams.get("id");
    const queryParam = searchParams.get("query");

    const tripId = (idParam && idParam !== "new") ? idParam : undefined;
    const initialQuery = queryParam || undefined;

    return (
        <ChatLayout
            initialTripId={tripId}
            initialQuery={initialQuery}
        />
    );
}
