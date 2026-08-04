import React from 'react';
import Image from "next/image";

interface HeroProps {
  isLoginView: boolean;
  setIsLoginView: (val: boolean) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  handleLogIn: (e: React.FormEvent) => void;
  handleGoogleLogin: () => void;
  fullName: string;
  setFullName: (val: string) => void;
  college: string;
  setCollege: (val: string) => void;
  year: string;
  setYear: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  handleSignUp: (e: React.FormEvent) => void;
  isForgotPasswordView: boolean;
  setIsForgotPasswordView: (val: boolean) => void;
  authError: string | null;
}

export default function Hero(props: HeroProps) {
  const {
    isLoginView, setIsLoginView, email, setEmail, password, setPassword,
    handleLogIn, handleGoogleLogin, fullName, setFullName,
    college, setCollege, year, setYear, confirmPassword, setConfirmPassword,
    handleSignUp, setIsForgotPasswordView, isForgotPasswordView, authError
  } = props;

  return (
    <main className="flex-grow flex items-center pt-24 pb-stack-lg z-10 relative">
      <div className="max-w-container-max mx-auto px-gutter w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Content */}
        <div className="space-y-6">
          <h1 className="font-headline-xl text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-zinc-800 dark:text-zinc-100">
            Everything Academic, <br/>
            <span className="text-gradient-brand">One Place</span>
          </h1>
          <p className="font-body-lg text-zinc-500 dark:text-zinc-400 max-w-xl text-base lg:text-lg leading-relaxed">
            Get instant notifications for attendance updates, marks, hackathons, conferences, social events, and much more. Your academic life, centralized and simplified.
          </p>
          <div className="pt-4 gap-6 hidden md:flex">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <span className="material-symbols-outlined text-[#7C3AED] dark:text-[#9c82ff]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span className="text-label-md text-xs font-semibold">Official Partner</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <span className="material-symbols-outlined text-[#7C3AED] dark:text-[#9c82ff]" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
              <span className="text-label-md text-xs font-semibold">Privacy Focused</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="flex justify-center lg:justify-end">
          <div id="auth" className="bg-white/85 dark:bg-[#14121b]/80 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800/40 backdrop-blur-md shadow-xl w-full max-w-md">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-[#7C3AED]/10 p-2 rounded-xl flex items-center justify-center border border-[#7C3AED]/20">
                  <Image src="/Acadshpere%20website%20logo.png" alt="Acadsphere Logo" width={40} height={40} className="h-10 w-10 object-contain" />
                </div>
              </div>
              <h2 className="font-headline-md text-2xl font-black text-zinc-800 dark:text-zinc-100 uppercase tracking-tight">Acadsphere</h2>
              <p className="font-label-md text-[10px] uppercase tracking-widest text-zinc-450 dark:text-zinc-500 mt-1 font-bold">Your Academic Command Center</p>
            </div>

            {typeof authError === 'string' && authError && (
              <div className="mb-4 rounded-lg bg-red-500/15 border border-red-500/30 p-3 text-xs font-medium text-red-500">
                {authError}
              </div>
            )}

            {isForgotPasswordView ? (
              <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="forgot-email" className="font-label-md text-xs font-bold text-zinc-650 dark:text-zinc-350">Email ID</label>
                  <input id="forgot-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@college.edu" className="w-full px-4 py-3 bg-zinc-50 dark:bg-[#09090f] border border-zinc-250 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-body-md text-zinc-800 dark:text-zinc-100 text-xs font-medium" />
                </div>
                <button type="submit" className="w-full py-3.5 btn-gradient rounded-lg text-white font-label-md flex items-center justify-center gap-2 mt-2 font-bold text-xs">
                  Dispatch Passcode Link
                </button>
                <div className="flex justify-center">
                  <button type="button" onClick={() => setIsForgotPasswordView(false)} className="text-xs font-bold text-zinc-500 dark:text-zinc-450 hover:text-[#7C3AED] dark:hover:text-[#9c82ff] transition-colors">
                    Back to Login
                  </button>
                </div>
              </form>
            ) : isLoginView ? (
              <form onSubmit={handleLogIn} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="login-email" className="font-label-md text-xs font-bold text-zinc-650 dark:text-zinc-350">Email ID</label>
                  <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@college.edu" className="w-full px-4 py-3 bg-zinc-50 dark:bg-[#09090f] border border-zinc-250 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-body-md text-zinc-800 dark:text-zinc-100 text-xs font-medium" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="login-password" className="font-label-md text-xs font-bold text-zinc-650 dark:text-zinc-350">Password</label>
                  <input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 bg-zinc-50 dark:bg-[#09090f] border border-zinc-250 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-body-md text-zinc-800 dark:text-zinc-100 text-xs font-medium" />
                </div>
                <div className="flex justify-between items-center">
                  <button type="button" onClick={() => setIsForgotPasswordView(true)} className="text-xs font-bold text-zinc-500 dark:text-zinc-450 hover:text-[#7C3AED] dark:hover:text-[#9c82ff] transition-colors">
                    Forgot passcode?
                  </button>
                </div>
                <button type="submit" className="w-full py-3.5 btn-gradient rounded-lg text-white font-label-md flex items-center justify-center gap-2 mt-2 font-bold text-xs">
                  Log In
                </button>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200 dark:border-zinc-800/50"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-[#14121b] px-2 text-zinc-400 dark:text-zinc-550 font-label-md font-bold">or</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button type="button" onClick={(e) => { e.preventDefault(); handleGoogleLogin(); }} className="w-full py-3 border border-zinc-250 dark:border-zinc-800 rounded-lg bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/30 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300 font-label-md flex items-center justify-center gap-3 font-bold text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                      <path fill="none" d="M0 0h48v48H0z"/>
                    </svg>
                    Continue with Google
                  </button>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Don&apos;t have an account? <button type="button" onClick={() => setIsLoginView(false)} className="text-[#7C3AED] dark:text-[#9c82ff] font-bold hover:underline">Sign Up</button></p>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="signup-name" className="font-label-md text-xs font-bold text-zinc-650 dark:text-zinc-350">Full Name</label>
                    <input id="signup-name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#09090f] border border-zinc-250 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-body-md text-zinc-800 dark:text-zinc-100 text-xs font-medium" />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="signup-college" className="font-label-md text-xs font-bold text-zinc-650 dark:text-zinc-350">College</label>
                    <input id="signup-college" type="text" value={college} onChange={(e) => setCollege(e.target.value)} placeholder="Stanford Univ" className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#09090f] border border-zinc-250 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-body-md text-zinc-800 dark:text-zinc-100 text-xs font-medium" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="signup-year" className="font-label-md text-xs font-bold text-zinc-650 dark:text-zinc-350">Year</label>
                    <select id="signup-year" value={year} onChange={(e) => setYear(e.target.value)} className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#09090f] border border-zinc-250 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all font-body-md text-zinc-800 dark:text-zinc-100 text-xs font-medium">
                      <option>I Year</option>
                      <option>II Year</option>
                      <option>III Year</option>
                      <option>IV Year</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="signup-email" className="font-label-md text-xs font-bold text-zinc-650 dark:text-zinc-350">Email ID</label>
                    <input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@college.edu" className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#09090f] border border-zinc-250 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-body-md text-zinc-800 dark:text-zinc-100 text-xs font-medium" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="signup-password" className="font-label-md text-xs font-bold text-zinc-650 dark:text-zinc-350">Password</label>
                    <input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#09090f] border border-zinc-250 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-body-md text-zinc-800 dark:text-zinc-100 text-xs font-medium" />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="signup-confirm" className="font-label-md text-xs font-bold text-zinc-650 dark:text-zinc-350">Confirm</label>
                    <input id="signup-confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#09090f] border border-zinc-250 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-body-md text-zinc-800 dark:text-zinc-100 text-xs font-medium" />
                  </div>
                </div>

                <button type="submit" className="w-full py-3 btn-gradient rounded-lg text-white font-label-md flex items-center justify-center gap-2 mt-2 font-bold text-xs">
                  Create Account
                </button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200 dark:border-zinc-800/50"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-[#14121b] px-2 text-zinc-400 dark:text-zinc-550 font-label-md font-bold">or</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button type="button" onClick={(e) => { e.preventDefault(); handleGoogleLogin(); }} className="w-full py-3 border border-zinc-250 dark:border-zinc-800 rounded-lg bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/30 dark:hover:bg-zinc-900 transition-colors text-zinc-700 dark:text-zinc-300 font-label-md flex items-center justify-center gap-3 font-bold text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                      <path fill="none" d="M0 0h48v48H0z"/>
                    </svg>
                    Continue with Google
                  </button>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Already have an account? <button type="button" onClick={() => setIsLoginView(true)} className="text-[#7C3AED] dark:text-[#9c82ff] font-bold hover:underline">Log In</button></p>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
