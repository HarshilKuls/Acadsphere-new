"use client";

import React from "react";
import Navbar from "@/components/homepage/Navbar";
import { useAcadsphere } from "@/context/AcadsphereContext";
import { useRouter } from "next/navigation";

export default function PublicNavbar() {
  const router = useRouter();
  const { handleContinueAsGuest, setIsLoginView } = useAcadsphere();

  const handleGetStarted = () => {
    setIsLoginView(false);
    const el = document.getElementById('auth');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('/#auth');
    }
  };

  return (
    <Navbar 
      onGetStarted={handleGetStarted} 
      onContinueAsGuest={handleContinueAsGuest} 
    />
  );
}
