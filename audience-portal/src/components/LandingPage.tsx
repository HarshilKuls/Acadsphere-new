"use client";

import React from "react";
import Navbar from "@/components/homepage/Navbar";
import Hero from "@/components/homepage/Hero";
import Footer from "@/components/homepage/Footer";
import { useAcadsphere } from "@/context/AcadsphereContext";
import { X, Clock, User } from "lucide-react";

export default function LandingPage() {
  const {
    isDarkMode,
    toggleTheme,
    isLoginView,
    setIsLoginView,
    email,
    setEmail,
    password,
    setPassword,
    handleLogIn,
    handleGoogleLogin,
    fullName,
    setFullName,
    college,
    setCollege,
    year,
    setYear,
    confirmPassword,
    setConfirmPassword,
    handleSignUp,
    setIsForgotPasswordView,
    isForgotPasswordView,
    authError,
    isBannedView,
    handleSignOut,
    isVerificationPending,
    handleResendVerification,
    isResetSuccess,
    setIsResetSuccess,
    handleForgotPassword
  } = useAcadsphere();

  if (isBannedView) {
    return (
      <div className={`flex min-h-screen items-center justify-center p-4 transition-colors duration-300 ${isDarkMode ? "bg-[#09090f] text-[#e6e0ee]" : "bg-[#f4f1fb] text-[#1c1a24]"}`}>
        <div className={`relative w-full max-w-md overflow-hidden rounded-2xl border p-8 shadow-2xl text-center bg-white/85 dark:bg-[#14121b]/80 border-zinc-200 dark:border-red-500/20 shadow-red-500/5`}>
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/15 text-red-500 mb-4 animate-bounce">
            <X className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-850 dark:text-zinc-100">Account Suspended</h1>
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">Acadsphere Security Center</p>
          <div className="my-6 rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-500 dark:text-red-400">
            Your account access has been suspended due to an administrative policy violation. Please contact student affairs or ecosystem administration.
          </div>
          <button
            onClick={handleSignOut}
            className="w-full rounded-lg bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 text-xs font-bold text-white transition-all"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (isVerificationPending) {
    return (
      <div className={`flex min-h-screen items-center justify-center p-4 transition-colors duration-300 ${isDarkMode ? "bg-[#09090f] text-[#e6e0ee]" : "bg-[#f4f1fb] text-[#1c1a24]"}`}>
        <div className={`relative w-full max-w-md overflow-hidden rounded-2xl border p-8 shadow-2xl text-center bg-white/85 dark:bg-[#14121b]/80 border-zinc-200 dark:border-[#06B6D4]/20 shadow-[#06B6D4]/5`}>
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#06B6D4]/15 text-[#06B6D4] mb-4 animate-pulse">
            <Clock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-850 dark:text-zinc-100">Verification Link Dispatched</h1>
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1">Ecosystem Registration Flow</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 my-6 leading-relaxed">
            We have dispatched a verification link to your email <strong className="text-[#06B6D4]">{email}</strong>.
            Please check your inbox (and spam folder) and verify your account before accessing the command center dashboard.
          </p>
          {authError && (
            <div className="mb-4 rounded-lg bg-red-500/15 border border-red-500/30 p-3 text-xs text-red-500">
              {authError}
            </div>
          )}
          <div className="space-y-3">
            <button
              onClick={handleResendVerification}
              className="w-full rounded-lg bg-[#06B6D4] hover:bg-[#0891B2] px-4 py-2.5 text-xs font-bold text-white transition-all"
            >
              Resend Verification Email
            </button>
            <button
              onClick={handleSignOut}
              className="w-full rounded-lg bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 text-xs font-semibold text-zinc-400 hover:text-white transition-all"
            >
              Back to Login Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isForgotPasswordView) {
    return (
      <div className={`flex min-h-screen items-center justify-center p-4 transition-colors duration-300 ${isDarkMode ? "bg-[#09090f] text-[#e6e0ee]" : "bg-[#f4f1fb] text-[#1c1a24]"}`}>
        <div className={`relative w-full max-w-md overflow-hidden rounded-2xl border p-8 shadow-2xl text-center bg-white/85 dark:bg-[#14121b]/80 border-zinc-200 dark:border-zinc-800/40 shadow-black/10`}>
          <div className="mb-8 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#7C3AED]/15 text-[#7C3AED] mb-3">
              <User className="h-6 w-6 animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-850 dark:text-zinc-100">Reset Your Passcode</h1>
            <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase mt-1">Ecosystem Access Recovery</p>
          </div>

          {authError && (
            <div className="mb-4 rounded-lg bg-red-500/15 border border-red-500/30 p-3 text-xs text-red-500">
              {authError}
            </div>
          )}

          {isResetSuccess ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-500 dark:text-emerald-400 leading-relaxed font-semibold">
                A secure passcode recovery link has been dispatched to your email! Please follow the link to reset your credentials.
              </div>
              <button
                onClick={() => {
                  setIsForgotPasswordView(false);
                  setIsResetSuccess(false);
                }}
                className="w-full rounded-lg bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 text-xs font-bold text-white transition-all"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label htmlFor="input-enter-your-email-id-1" className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1.5 text-left">Enter your Email ID</label>
                <input id="input-enter-your-email-id-1"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu"
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-xs font-medium transition-all focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none ${isDarkMode ? "border-zinc-800 bg-[#18181B] text-[#F4F4F5] placeholder:text-zinc-650" : "border-zinc-250 bg-zinc-50 text-zinc-950 placeholder:text-zinc-450"}`}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2.5 text-xs font-bold text-white transition-all shadow-lg mt-2"
              >
                Dispatch Passcode Link
              </button>

              <button
                type="button"
                onClick={() => setIsForgotPasswordView(false)}
                className="w-full rounded-lg bg-transparent hover:underline text-xs text-zinc-500 mt-2 text-center"
              >
                Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`mesh-gradient-bg min-h-screen flex flex-col font-body-md text-zinc-800 dark:text-zinc-100 ${isDarkMode ? 'dark' : ''}`}>
      <Navbar toggleTheme={toggleTheme} />
      <Hero
        isLoginView={isLoginView}
        setIsLoginView={setIsLoginView}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleLogIn={handleLogIn}
        handleGoogleLogin={handleGoogleLogin}
        fullName={fullName}
        setFullName={setFullName}
        college={college}
        setCollege={setCollege}
        year={year}
        setYear={setYear}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        handleSignUp={handleSignUp}
        setIsForgotPasswordView={setIsForgotPasswordView}
        isForgotPasswordView={isForgotPasswordView}
        authError={authError}
      />
      <Footer />
    </div>
  );
}
