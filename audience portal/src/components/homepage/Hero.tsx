import React from 'react';

export default function Hero(props: any) {
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
                  <img src="/Acadshpere%20website%20logo.png" alt="Acadsphere Logo" className="h-10 w-10 object-contain" />
                </div>
              </div>
              <h2 className="font-headline-md text-2xl font-black text-zinc-800 dark:text-zinc-100 uppercase tracking-tight">Acadsphere</h2>
              <p className="font-label-md text-[10px] uppercase tracking-widest text-zinc-450 dark:text-zinc-500 mt-1 font-bold">Your Academic Command Center</p>
            </div>

            {authError && (
              <div className="mb-4 rounded-lg bg-red-500/15 border border-red-500/30 p-3 text-xs font-medium text-red-500">
                {authError}
              </div>
            )}

            {isForgotPasswordView ? (
              <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-5">
                <div className="space-y-2">
                  <label className="font-label-md text-xs font-bold text-zinc-650 dark:text-zinc-350">Email ID</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@college.edu" className="w-full px-4 py-3 bg-zinc-50 dark:bg-[#09090f] border border-zinc-250 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-body-md text-zinc-800 dark:text-zinc-100 text-xs font-medium" />
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
                  <label className="font-label-md text-xs font-bold text-zinc-650 dark:text-zinc-350">Email ID</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@college.edu" className="w-full px-4 py-3 bg-zinc-50 dark:bg-[#09090f] border border-zinc-250 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-body-md text-zinc-800 dark:text-zinc-100 text-xs font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="font-label-md text-xs font-bold text-zinc-650 dark:text-zinc-350">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 bg-zinc-50 dark:bg-[#09090f] border border-zinc-250 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-body-md text-zinc-800 dark:text-zinc-100 text-xs font-medium" />
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
                    <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChn9WDSmd4C8KfbUEPqHV40WqHvmdFtJ8pPH8sFge1AaJqQtRyrzbTzmfOqhIIe4QSmLocxLSLmURKVd4do2lLZl8Q5hO_hDdeDEu4R2VjYTvO1MzRBaZ0wY27uoXV9gK4H8tRahRQrg0yMYop_JyF-EPGXZmwMfWzP2c5rG2dDfLfQQpQLn7Dn_U4JmolosPsiUJ1mkUXg08EhmjfNPCH8u8q7WnQILUhw5ax6h83qCpLwuHE2LmJHlX2faaO_ucQ5OVVorIHNo3Q"/>
                    Continue with Google
                  </button>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Don't have an account? <button type="button" onClick={() => setIsLoginView(false)} className="text-[#7C3AED] dark:text-[#9c82ff] font-bold hover:underline">Sign Up</button></p>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-label-md text-xs font-bold text-zinc-650 dark:text-zinc-350">Full Name</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#09090f] border border-zinc-250 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-body-md text-zinc-800 dark:text-zinc-100 text-xs font-medium" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-label-md text-xs font-bold text-zinc-650 dark:text-zinc-350">College</label>
                    <input type="text" value={college} onChange={(e) => setCollege(e.target.value)} placeholder="Stanford Univ" className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#09090f] border border-zinc-250 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-body-md text-zinc-800 dark:text-zinc-100 text-xs font-medium" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-label-md text-xs font-bold text-zinc-650 dark:text-zinc-350">Year</label>
                    <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#09090f] border border-zinc-250 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all font-body-md text-zinc-800 dark:text-zinc-100 text-xs font-medium">
                      <option>I Year</option>
                      <option>II Year</option>
                      <option>III Year</option>
                      <option>IV Year</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-label-md text-xs font-bold text-zinc-650 dark:text-zinc-350">Email ID</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@college.edu" className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#09090f] border border-zinc-250 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-body-md text-zinc-800 dark:text-zinc-100 text-xs font-medium" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-label-md text-xs font-bold text-zinc-650 dark:text-zinc-350">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#09090f] border border-zinc-250 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-body-md text-zinc-800 dark:text-zinc-100 text-xs font-medium" />
                  </div>
                  <div className="space-y-1">
                    <label className="font-label-md text-xs font-bold text-zinc-650 dark:text-zinc-350">Confirm</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2 bg-zinc-50 dark:bg-[#09090f] border border-zinc-250 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-body-md text-zinc-800 dark:text-zinc-100 text-xs font-medium" />
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
                    <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChn9WDSmd4C8KfbUEPqHV40WqHvmdFtJ8pPH8sFge1AaJqQtRyrzbTzmfOqhIIe4QSmLocxLSLmURKVd4do2lLZl8Q5hO_hDdeDEu4R2VjYTvO1MzRBaZ0wY27uoXV9gK4H8tRahRQrg0yMYop_JyF-EPGXZmwMfWzP2c5rG2dDfLfQQpQLn7Dn_U4JmolosPsiUJ1mkUXg08EhmjfNPCH8u8q7WnQILUhw5ax6h83qCpLwuHE2LmJHlX2faaO_ucQ5OVVorIHNo3Q"/>
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
