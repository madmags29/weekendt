"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ChatLayout from "../components/ChatLayout";
import LandingPage from "../components/LandingPage";
import { trackSearch } from "@/lib/analytics";

function HomeContent() {
  const router = useRouter();

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    trackSearch(query); // Track search in Google Analytics
    router.push(`/trip?id=new&query=${encodeURIComponent(query)}`);
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
