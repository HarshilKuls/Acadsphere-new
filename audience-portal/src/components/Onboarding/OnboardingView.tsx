"use client";

import React, { useState } from "react";
import { Building, GraduationCap, Sparkles, CheckCircle2, Loader2, Sun, Moon } from "lucide-react";
import { StudentUser } from "@/lib/db";

interface OnboardingViewProps {
  currentUser: StudentUser;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onComplete: (college: string, year: string) => Promise<boolean>;
  onSkip: () => Promise<boolean>;
}

const YEAR_OPTIONS = ["I Year", "II Year", "III Year", "IV Year"];

export default function OnboardingView({
  currentUser,
  isDarkMode,
  toggleTheme,
  onComplete,
  onSkip,
}: OnboardingViewProps) {
  const [college, setCollege] = useState(currentUser.college || "");
  const [year, setYear] = useState(currentUser.year || "I Year");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const firstName = currentUser.fullName.split(" ")[0] || "there";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedCollege = college.trim();
    if (!trimmedCollege) {
      setError("Please enter your college name.");
      return;
    }
    if (!year) {
      setError("Please select your current year.");
      return;
    }

    setIsSubmitting(true);
    const success = await onComplete(trimmedCollege, year);
    setIsSubmitting(false);

    if (success) {
      setIsSuccess(true);
    } else {
      setError("Something went wrong. Please try again.");
    }
  };

  const handleSkip = async () => {
    setError("");
    setIsSkipping(true);
    const success = await onSkip();
    setIsSkipping(false);

    if (!success) {
      setError("Could not skip onboarding. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <div className={`mesh-gradient-bg min-h-screen flex items-center justify-center font-body-md ${isDarkMode ? "dark" : ""}`}>
        <div className="text-center space-y-4 animate-in fade-in duration-500 px-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">You&apos;re all set!</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Taking you to your dashboard...</p>
          <Loader2 className="h-5 w-5 animate-spin text-[#7C3AED] mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className={`mesh-gradient-bg min-h-screen flex flex-col font-body-md text-zinc-800 dark:text-zinc-100 ${isDarkMode ? "dark" : ""}`}>
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 z-10">
        <div className="flex items-center gap-2.5">
          <div className="bg-[#7C3AED]/10 p-1.5 rounded-lg border border-[#7C3AED]/20">
            <img src="/Acadshpere%20website%20logo.png" alt="Acadsphere" className="h-7 w-7 object-contain" />
          </div>
          <span className="font-bold text-sm tracking-tight">
            Acad<span className="text-gradient-brand">Sphere</span>
          </span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 hover:bg-white dark:hover:bg-zinc-800 transition-colors"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun className="h-4 w-4 text-zinc-400" /> : <Moon className="h-4 w-4 text-zinc-600" />}
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-lg">
          {/* Step indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Step 1 of 1
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#7C3AED] dark:text-[#9c82ff]">
                100%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
              <div className="h-full w-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] transition-all duration-700" />
            </div>
          </div>

          {/* Card */}
          <div className="bg-white/85 dark:bg-[#14121b]/80 rounded-2xl border border-zinc-200 dark:border-zinc-800/40 backdrop-blur-md shadow-xl overflow-hidden">
            {/* Welcome header */}
            <div className="px-8 pt-8 pb-6 text-center border-b border-zinc-100 dark:border-zinc-800/60">
              <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7C3AED]/20 to-[#06B6D4]/20 border border-[#7C3AED]/30 flex items-center justify-center">
                <span className="text-2xl font-black text-[#7C3AED] dark:text-[#9c82ff]">
                  {currentUser.fullName ? currentUser.fullName[0].toUpperCase() : "A"}
                </span>
              </div>
              <h1 className="font-headline-md text-2xl font-extrabold tracking-tight text-zinc-800 dark:text-zinc-100">
                Welcome, {firstName}! 👋
              </h1>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
                Let&apos;s personalize your experience. Tell us a bit about where you study so we can tailor your dashboard.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
              {error && (
                <div className="rounded-lg bg-red-500/15 border border-red-500/30 p-3 text-xs font-medium text-red-500">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="flex items-center gap-1.5 font-label-md text-xs font-bold text-zinc-650 dark:text-zinc-350">
                  <Building className="h-3.5 w-3.5 text-[#7C3AED]" />
                  College Name
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. MIT, Stanford University"
                  list="college-suggestions"
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-[#09090f] border border-zinc-250 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-body-md text-zinc-800 dark:text-zinc-100 text-sm font-medium"
                />
                <datalist id="college-suggestions">
                  <option value="Indian Institute of Technology" />
                  <option value="National Institute of Technology" />
                  <option value="Anna University" />
                  <option value="VIT University" />
                  <option value="SRM Institute" />
                </datalist>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-1.5 font-label-md text-xs font-bold text-zinc-650 dark:text-zinc-350">
                  <GraduationCap className="h-3.5 w-3.5 text-[#7C3AED]" />
                  Current Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-[#09090f] border border-zinc-250 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all font-body-md text-zinc-800 dark:text-zinc-100 text-sm font-medium"
                >
                  {YEAR_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isSkipping}
                className="w-full py-3.5 btn-gradient rounded-lg text-white font-label-md flex items-center justify-center gap-2 font-bold text-sm disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Setting up your profile...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Continue to Dashboard
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSkip}
                disabled={isSubmitting || isSkipping}
                className="w-full py-2.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-[#7C3AED] dark:hover:text-[#9c82ff] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSkipping ? "Skipping..." : "Skip for now"}
              </button>
            </form>
          </div>

          <p className="text-center text-[10px] text-zinc-400 dark:text-zinc-600 mt-4 font-medium">
            You can update these details anytime from Settings.
          </p>
        </div>
      </main>
    </div>
  );
}
