"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAcadsphere } from "@/context/AcadsphereContext";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import OnboardingView from "@/components/Onboarding/OnboardingView";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const {
    currentUser,
    isDarkMode,
    toggleTheme,
    handleOnboardingComplete,
    handleOnboardingSkip,
    isSidebarCollapsed,
    isSidebarOpen,
    setIsSidebarOpen,
    toastMessage
  } = useAcadsphere();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !currentUser) {
      router.push("/");
    }
  }, [currentUser, mounted, router]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090B] text-[#F4F4F5]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#7C3AED] border-t-transparent"></div>
          <span className="text-sm font-medium text-zinc-400">Loading Acadsphere...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  if (!currentUser.onboardingCompleted) {
    return (
      <OnboardingView
        currentUser={currentUser}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    );
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 bg-[var(--bg)] text-[var(--on-surface)] ${isDarkMode ? 'dark' : ''}`}>
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] rounded-xl border border-[#7C3AED]/40 px-5 py-3 text-xs font-semibold shadow-xl flex items-center gap-2 animate-bounce bg-[#1a1625] text-white shadow-black/30`}>
          <span className="material-symbols-outlined text-[#06B6D4] text-base select-none">sparkles</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* App Shell */}
      <div className={`app-shell ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        {isSidebarOpen && (
          <button
            type="button"
            className="sidebar-overlay"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          />
        )}

        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN WRAPPER */}
        <div className="main-wrapper">
          {/* TOP NAV */}
          <Header />

          {/* SCROLLABLE MAIN CONTENT */}
          <main className="dashboard-main flex-1 overflow-y-auto p-3 sm:p-5 relative">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
