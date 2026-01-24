"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChatLayout from "../components/ChatLayout";
import LandingPage from "../components/LandingPage";

function HomeContent() {
  const searchParams = useSearchParams();
  const tripId = searchParams.get('tripId');
  const [view, setView] = useState<'landing' | 'chat'>(tripId ? 'chat' : 'landing');
  const [initialQuery, setInitialQuery] = useState("");

  const handleSearch = (query: string) => {
    setInitialQuery(query);
    setView('chat');
  };

  const handleBack = () => {
    // Remove query param without reload
    window.history.replaceState(null, '', '/');
    setView('landing');
    setInitialQuery("");
  };

  if (view === 'landing') {
    return <LandingPage onSearch={handleSearch} />;
  }

  // Pass tripId to ChatLayout
  return <ChatLayout initialQuery={initialQuery} initialTripId={tripId || undefined} onBack={handleBack} />;
}

export default function Home() {
  return (
    <Suspense fallback={<div className="h-screen bg-black text-white flex items-center justify-center">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
