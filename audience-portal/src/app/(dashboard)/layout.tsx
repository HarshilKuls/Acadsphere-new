"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAcadsphere } from "@/context/AcadsphereContext";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import MobileMenu from "@/components/MobileMenu";
import OnboardingView from "@/components/Onboarding/OnboardingView";
import { Sparkles } from "lucide-react";

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
    toastMessage,
    activeTab,
    showGuestAuthModal,
    setShowGuestAuthModal,
    guestAuthMessage,
    isGuest,
  } = useAcadsphere();

  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!currentUser) {
        router.push("/");
        return;
      }

      // Guest routing logic
      if (isGuest && pathname === "/dashboard") {
        router.push("/dashboard-guestmode");
      } else if (!isGuest && pathname === "/dashboard-guestmode") {
        router.push("/dashboard");
      }
    }
  }, [currentUser, mounted, router, pathname, isGuest]);

  // Close mobile menu and reset scroll position whenever navigation occurs
  useEffect(() => {
    setIsMobileMenuOpen(false);
    
    // Reset scroll position on the main scrollable container
    const mainScrollContainer = document.getElementById('dashboard-main-scroll');
    if (mainScrollContainer) {
      mainScrollContainer.scrollTop = 0;
    }
  }, [activeTab]);

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

  const getThemeClass = (tab: string) => {
    switch (tab) {
      case "Timetable / Schedule": return "theme-cyan";
      case "Attendance": return "theme-orange";
      case "CGPA Calculator": return "theme-blue";
      case "Marks Predictor": return "theme-rose";
      case "Calendar": return "theme-gold";
      case "Events / Network": return "theme-indigo";
      case "Internship": return "theme-emerald";
      default: return "theme-violet";
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 bg-[var(--bg)] text-[var(--on-surface)] ${isDarkMode ? 'dark' : ''} ${getThemeClass(activeTab)}`}>
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] rounded-xl border border-[#7C3AED]/40 px-5 py-3 text-xs font-semibold shadow-xl flex items-center gap-2 animate-bounce bg-[#1a1625] text-white shadow-black/30`}>
          <Sparkles className="w-4 h-4 text-[#06B6D4] shrink-0" />
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
        <div className="main-wrapper bg-[#050505] relative">
          {/* Faint Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />
          
          <div className="relative z-10 flex flex-col h-full pb-16 md:pb-0">
            {/* TOP NAV */}
            <Header />

            {/* SCROLLABLE MAIN CONTENT */}
            <main id="dashboard-main-scroll" className="dashboard-main flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 relative">
              {children}
            </main>
          </div>
        </div>
        
        {/* MOBILE NAVIGATION & MENU */}
        <BottomNav 
          isMenuOpen={isMobileMenuOpen} 
          onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onCloseMenu={() => setIsMobileMenuOpen(false)}
        />
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

        {/* Guest Auth Modal */}
        {showGuestAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-3xl bg-[#0F0F13] border border-[#27272A] p-6 shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-[#7C3AED]/20 flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-[#7C3AED]" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{guestAuthMessage}</h2>
              <p className="text-sm text-zinc-400 mb-6">
                Create an account or sign in to save your progress, build your timetable, and personalize your Acadsphere experience.
              </p>
              <div className="flex flex-col w-full gap-3">
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.removeItem("acadsphere_guest");
                    window.location.href = "/";
                  }}
                  className="w-full py-3 px-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium rounded-xl transition-all duration-200"
                >
                  Sign In / Create Account
                </button>
                <button
                  type="button"
                  onClick={() => setShowGuestAuthModal(false)}
                  className="w-full py-3 px-4 bg-transparent hover:bg-white/5 text-zinc-300 font-medium rounded-xl transition-all duration-200"
                >
                  Continue Exploring
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
