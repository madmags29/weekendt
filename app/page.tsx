"use client";

import { useState } from "react";
import ChatLayout from "../components/ChatLayout";
import LandingPage from "../components/LandingPage";

export default function Home() {
  const [view, setView] = useState<'landing' | 'chat'>('landing');
  const [initialQuery, setInitialQuery] = useState("");

  const handleSearch = (query: string) => {
    setInitialQuery(query);
    setView('chat');
  };

  const handleBack = () => {
    setView('landing');
    setInitialQuery("");
  };

  if (view === 'landing') {
    return <LandingPage onSearch={handleSearch} />;
  }

  return <ChatLayout initialQuery={initialQuery} onBack={handleBack} />;
}

