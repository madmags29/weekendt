"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChatLayout from "../components/ChatLayout";
import LandingPage from "../components/LandingPage";

function HomeContent() {
  const handleSearch = (query: string) => {
    // This will be handled by LandingPage navigation, 
    // but just in case we need a fallback or side effect.
    console.log("Searching for:", query);
  };

  return <LandingPage onSearch={handleSearch} />;
}

export default function Home() {
  return (
    <Suspense fallback={<div className="h-screen bg-black text-white flex items-center justify-center">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
