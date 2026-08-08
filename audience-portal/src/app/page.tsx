"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAcadsphere } from "@/context/AcadsphereContext";
import LandingPage from "@/components/LandingPage";
import OnboardingView from "@/components/Onboarding/OnboardingView";

export default function Home() {
  const router = useRouter();
  const {
    currentUser,
    isDarkMode,
    toggleTheme,
    handleOnboardingComplete,
    handleOnboardingSkip
  } = useAcadsphere();

  useEffect(() => {
    if (currentUser && currentUser.onboardingCompleted) {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return <LandingPage />;
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

  return null;
}
