import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  GraduationCap, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Compass,
  AlertCircle
} from 'lucide-react';

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
  handleContinueAsGuest: () => void;
}

export default function Hero({
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
  isForgotPasswordView,
  setIsForgotPasswordView,
  authError,
  handleContinueAsGuest
}: HeroProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animated Procedural Purple Sand Particles Dunes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let time = 0.5;
    const duneCount = 4;
    const pointsPerDune = 50;
    let animationFrameId: number;

    const render = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Draw undulating dune ridges with fine particles (static)
      for (let d = 0; d < duneCount; d++) {
        const baseHeight = h * (0.35 + d * 0.16);
        const amp = 42 - d * 6;
        const freq = 0.0016 + d * 0.0004;
        const phase = d * 1.8 + time * 0.35;

        ctx.beginPath();
        let prevX = 0, prevY = baseHeight;
        ctx.moveTo(0, h);

        const ridgePoints: { x: number; y: number }[] = [];

        for (let i = 0; i <= pointsPerDune; i++) {
          const x = (w / pointsPerDune) * i;
          const y = baseHeight 
                + Math.sin(x * freq + phase) * amp 
                + Math.cos(x * freq * 1.8 - phase * 0.7) * (amp * 0.45);

          if (i === 0) ctx.lineTo(x, y);
          else {
            const mx = (prevX + x) / 2;
            const my = (prevY + y) / 2;
            ctx.quadraticCurveTo(prevX, prevY, mx, my);
          }
          prevX = x;
          prevY = y;
          ridgePoints.push({ x, y });
        }
        ctx.lineTo(w, prevY);
        ctx.lineTo(w, h);
        ctx.closePath();

        const duneFill = ctx.createLinearGradient(0, baseHeight - 40, 0, h);
        if (d === 0) {
          duneFill.addColorStop(0, 'rgba(124, 60, 255, 0.22)');
          duneFill.addColorStop(0.4, 'rgba(80, 30, 160, 0.10)');
          duneFill.addColorStop(1, 'rgba(5, 4, 10, 0.95)');
        } else if (d === 1) {
          duneFill.addColorStop(0, 'rgba(140, 77, 255, 0.28)');
          duneFill.addColorStop(0.5, 'rgba(70, 25, 140, 0.14)');
          duneFill.addColorStop(1, 'rgba(5, 4, 10, 0.98)');
        } else {
          duneFill.addColorStop(0, 'rgba(168, 85, 247, 0.18)');
          duneFill.addColorStop(0.6, 'rgba(30, 12, 60, 0.12)');
          duneFill.addColorStop(1, 'rgba(5, 4, 10, 1)');
        }
        ctx.fillStyle = duneFill;
        ctx.fill();

        // Dune crest line with gold/purple touches
        ctx.beginPath();
        for (let p = 0; p < ridgePoints.length; p++) {
          if (p === 0) ctx.moveTo(ridgePoints[p].x, ridgePoints[p].y);
          else ctx.lineTo(ridgePoints[p].x, ridgePoints[p].y);
        }
        ctx.strokeStyle = d % 2 === 1 ? 'rgba(201, 154, 91, 0.35)' : 'rgba(192, 132, 252, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Particles along the crest
        for (let p = 0; p < ridgePoints.length; p += 2) {
          const pt = ridgePoints[p];
          ctx.beginPath();
          const pRad = 0.9 + (p % 3) * 0.4;
          ctx.arc(pt.x + (Math.sin(p + time) * 3), pt.y + ((p % 5) - 2), pRad, 0, Math.PI * 2);
          ctx.fillStyle = (p % 5 === 0) 
            ? 'rgba(224, 179, 107, 0.65)'  // Subtle gold highlight
            : 'rgba(176, 140, 255, 0.75)'; // Soft violet sand
          ctx.fill();

          for (let s = 1; s <= 2; s++) {
            const fallY = pt.y + s * (12 + (p % 4) * 4);
            if (fallY < h) {
              ctx.beginPath();
              ctx.arc(pt.x + (s * 3) - 5, fallY, 0.7, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(140, 77, 255, 0.3)';
              ctx.fill();
            }
          }
        }
      }
      
      time += 0.02; // Fast, visible movement
      animationFrameId = requestAnimationFrame(render);
    };

    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    render();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const onSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await handleLogIn(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await handleSignUp(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-[#05040A] text-zinc-100 font-['Hanken_Grotesk']">
      {/* Canvas sand dunes background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-90"
      />

      {/* Atmospheric lighting */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 z-0"
        style={{
          background: 'radial-gradient(1100px 500px at 50% 20%, rgba(124, 60, 255, 0.18), transparent 70%)'
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-6 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Hero Text Matching Reference */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-light tracking-[0.08em] leading-[1.1] uppercase text-white font-['Space_Grotesk']">
              EVERYTHING<br />
              ACADEMIC,<br />
              IN <span className="font-semibold text-[#965CFF] drop-shadow-[0_0_30px_rgba(150,92,255,0.45)]">ONE PANEL.</span>
            </h1>

            <p className="text-[14px] sm:text-[15px] text-zinc-400 max-w-lg leading-[1.65] font-['Hanken_Grotesk']">
              Attendance, marks, deadlines and campus events —<br className="hidden sm:inline" />
              routed to you, so you can focus on what truly matters. <br className="hidden sm:inline" />
              Less searching. More learning.
            </p>

            {/* Badges and Stats Row Matching Reference */}
            <div className="pt-3 flex flex-wrap items-center gap-6">
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-xl font-normal text-white">9+</span>
                <span className="text-[10px] text-zinc-400">Essential Modules</span>
              </div>

              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-xl font-normal text-white">10K+</span>
                <span className="text-[10px] text-zinc-400">Students Trust Us</span>
              </div>

              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-xl font-normal text-white">98%</span>
                <span className="text-[10px] text-zinc-400">Uptime Reliability</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Dark Glass Auth Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div 
              id="auth"
              className="w-full max-w-md p-7 sm:p-8 rounded-2xl border border-[#8C8CF9]/20 bg-[#0E0A1A]/75 backdrop-blur-xl shadow-[0_24px_60px_-15px_rgba(5,4,10,0.95),0_0_40px_-10px_rgba(124,60,255,0.3)] relative"
            >
              {/* Tab Switcher: Login / Create Account */}
              {!isForgotPasswordView && (
                <div className="flex p-1 bg-[#070510]/85 rounded-xl border border-white/10 mb-6">
                  <button
                    type="button"
                    onClick={() => setIsLoginView(true)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isLoginView 
                        ? 'bg-gradient-to-r from-[#7C3CFF] to-[#965CFF] text-white shadow-[0_4px_14px_rgba(124,60,255,0.4)]' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLoginView(false)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      !isLoginView 
                        ? 'bg-gradient-to-r from-[#7C3CFF] to-[#965CFF] text-white shadow-[0_4px_14px_rgba(124,60,255,0.4)]' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Create Account
                  </button>
                </div>
              )}

              {/* Error Alert Display */}
              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-tight">{authError}</span>
                </div>
              )}

              {/* Forgot Password View */}
              {isForgotPasswordView ? (
                <div>
                  <div className="mb-5">
                    <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white">Reset Passcode</h3>
                    <p className="text-xs text-zinc-400 mt-1">We will send a secure recovery link to your college email.</p>
                  </div>

                  <form onSubmit={onSubmitLogin} className="space-y-4">
                    <div>
                      <label htmlFor="fp-email" className="block text-[11px] font-mono uppercase text-zinc-400 font-semibold mb-1.5">
                        College Email
                      </label>
                      <div className="relative flex items-center">
                        <Mail className="absolute left-3 w-4 h-4 text-zinc-500 pointer-events-none" />
                        <input
                          id="fp-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@college.edu"
                          className="w-full h-11 pl-9 pr-3.5 bg-[#070510] border border-white/10 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:border-[#965CFF] focus:ring-2 focus:ring-[#965CFF]/20 transition-all outline-none"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 rounded-xl bg-gradient-to-r from-[#7C3CFF] to-[#8B4DFF] hover:from-[#8B4DFF] hover:to-[#965CFF] text-white font-semibold text-xs shadow-[0_8px_20px_-6px_rgba(124,60,255,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <span>Dispatch Recovery Link</span>
                      )}
                    </button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => setIsForgotPasswordView(false)}
                        className="text-xs text-zinc-400 hover:text-white transition-colors"
                      >
                        &larr; Back to Login
                      </button>
                    </div>
                  </form>
                </div>
              ) : isLoginView ? (
                /* LOGIN FORM MATCHING REFERENCE */
                <div>
                  <div className="mb-5">
                    <h3 className="font-['Space_Grotesk'] text-[19px] font-semibold text-white">Welcome Back</h3>
                    <p className="text-[12px] text-zinc-400 mt-0.5">Sign in to your Acadsphere panel</p>
                  </div>

                  <form onSubmit={onSubmitLogin} className="space-y-4">
                    <div>
                      <label htmlFor="login-email-input" className="block text-[10.5px] font-mono uppercase text-zinc-400 font-semibold mb-1.5">
                        College Email
                      </label>
                      <div className="relative flex items-center">
                        <Mail className="absolute left-3 w-4 h-4 text-zinc-500 pointer-events-none" />
                        <input
                          id="login-email-input"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@college.edu"
                          className="w-full h-11 pl-9 pr-3.5 bg-[#070510] border border-white/10 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:border-[#965CFF] focus:ring-2 focus:ring-[#965CFF]/20 transition-all outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="login-password-input" className="block text-[10.5px] font-mono uppercase text-zinc-400 font-semibold mb-1.5">
                        Password
                      </label>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-3 w-4 h-4 text-zinc-500 pointer-events-none" />
                        <input
                          id="login-password-input"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-11 pl-9 pr-10 bg-[#070510] border border-white/10 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:border-[#965CFF] focus:ring-2 focus:ring-[#965CFF]/20 transition-all outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label="Toggle password visibility"
                          className="absolute right-2.5 p-1.5 text-zinc-500 hover:text-white rounded-lg transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Remember me & Forgot password Row */}
                    <div className="flex items-center justify-between text-xs pt-0.5">
                      <label className="flex items-center gap-2 text-zinc-400 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="accent-[#7C3CFF] w-3.5 h-3.5 rounded cursor-pointer"
                        />
                        <span>Remember me</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsForgotPasswordView(true)}
                        className="text-xs text-zinc-400 hover:text-[#B08CFF] hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 rounded-xl bg-gradient-to-r from-[#7C3CFF] to-[#8B4DFF] hover:from-[#8B4DFF] hover:to-[#965CFF] text-white font-semibold text-xs shadow-[0_8px_22px_-6px_rgba(124,60,255,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
                    >
                      {isSubmitting ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <span>Sign in</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                /* SIGNUP FORM */
                <div>
                  <div className="mb-4">
                    <h3 className="font-['Space_Grotesk'] text-[19px] font-semibold text-white">Create Account</h3>
                    <p className="text-[12px] text-zinc-400 mt-0.5">One login for every academic module</p>
                  </div>

                  <form onSubmit={onSubmitSignup} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label htmlFor="reg-name" className="block text-[10px] font-mono uppercase text-zinc-400 font-semibold mb-1">
                          Full Name
                        </label>
                        <div className="relative flex items-center">
                          <User className="absolute left-2.5 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
                          <input
                            id="reg-name"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Ishaan Verma"
                            className="w-full h-9 pl-8 pr-2.5 bg-[#070510] border border-white/10 rounded-lg text-xs text-white placeholder:text-zinc-600 focus:border-[#965CFF] transition-all outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="reg-college" className="block text-[10px] font-mono uppercase text-zinc-400 font-semibold mb-1">
                          College / Campus
                        </label>
                        <div className="relative flex items-center">
                          <GraduationCap className="absolute left-2.5 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
                          <input
                            id="reg-college"
                            type="text"
                            value={college}
                            onChange={(e) => setCollege(e.target.value)}
                            placeholder="SRCC / Hindu / DTU"
                            className="w-full h-9 pl-8 pr-2.5 bg-[#070510] border border-white/10 rounded-lg text-xs text-white placeholder:text-zinc-600 focus:border-[#965CFF] transition-all outline-none"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                      <div className="col-span-1">
                        <label htmlFor="reg-year" className="block text-[10px] font-mono uppercase text-zinc-400 font-semibold mb-1">
                          Year
                        </label>
                        <select
                          id="reg-year"
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          className="w-full h-9 px-2 bg-[#070510] border border-white/10 rounded-lg text-xs text-white focus:border-[#965CFF] transition-all outline-none"
                        >
                          <option value="I Year">I Year</option>
                          <option value="II Year">II Year</option>
                          <option value="III Year">III Year</option>
                          <option value="IV Year">IV Year</option>
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label htmlFor="reg-email" className="block text-[10px] font-mono uppercase text-zinc-400 font-semibold mb-1">
                          College Email
                        </label>
                        <div className="relative flex items-center">
                          <Mail className="absolute left-2.5 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
                          <input
                            id="reg-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@college.edu"
                            className="w-full h-9 pl-8 pr-2.5 bg-[#070510] border border-white/10 rounded-lg text-xs text-white placeholder:text-zinc-600 focus:border-[#965CFF] transition-all outline-none"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label htmlFor="reg-pass" className="block text-[10px] font-mono uppercase text-zinc-400 font-semibold mb-1">
                          Password
                        </label>
                        <div className="relative flex items-center">
                          <Lock className="absolute left-2.5 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
                          <input
                            id="reg-pass"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="6+ chars"
                            className="w-full h-9 pl-8 pr-7 bg-[#070510] border border-white/10 rounded-lg text-xs text-white placeholder:text-zinc-600 focus:border-[#965CFF] transition-all outline-none"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label="Toggle password visibility"
                            className="absolute right-1.5 p-1 text-zinc-500 hover:text-white rounded"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="reg-confirm" className="block text-[10px] font-mono uppercase text-zinc-400 font-semibold mb-1">
                          Confirm
                        </label>
                        <div className="relative flex items-center">
                          <Lock className="absolute left-2.5 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
                          <input
                            id="reg-confirm"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repeat"
                            className="w-full h-9 pl-8 pr-7 bg-[#070510] border border-white/10 rounded-lg text-xs text-white placeholder:text-zinc-600 focus:border-[#965CFF] transition-all outline-none"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label="Toggle password visibility"
                            className="absolute right-1.5 p-1 text-zinc-500 hover:text-white rounded"
                          >
                            {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-10 rounded-xl bg-gradient-to-r from-[#7C3CFF] to-[#8B4DFF] hover:from-[#8B4DFF] hover:to-[#965CFF] text-white font-semibold text-xs shadow-[0_8px_20px_-6px_rgba(124,60,255,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
                    >
                      {isSubmitting ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <span>Create Account</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Or Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-[#0E0A1A] px-2.5 text-zinc-500 font-mono tracking-wider">or continue with</span>
                </div>
              </div>

              {/* Google OAuth & Guest Mode Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleGoogleLogin();
                  }}
                  className="w-full h-10 rounded-xl border border-white/10 bg-[#070510] hover:border-[#8C8CF9]/40 hover:bg-white/[0.04] text-zinc-200 text-xs font-medium flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4">
                    <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.2H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2-1.9 3.3-4.7 3.3-8.1Z"/>
                    <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.8A11 11 0 0 0 12 23Z"/>
                    <path fill="#FBBC05" d="M5.7 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2a11 11 0 0 0 0 9.8l3.7-2.8Z"/>
                    <path fill="#EA4335" d="M12 5.4c1.6 0 3 .6 4.2 1.7l3.1-3.1A11 11 0 0 0 2 7.1l3.7 2.8C6.6 7.3 9.1 5.4 12 5.4Z"/>
                  </svg>
                  <span>Sign in with Google</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleContinueAsGuest();
                  }}
                  className="w-full h-9 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] text-zinc-400 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-[#965CFF]" />
                  <span>Instant Guest Mode (No sign up needed)</span>
                </button>
              </div>

              {/* Footnote Switch Link */}
              <div className="mt-5 pt-3 border-t border-white/10 text-center text-[11.5px] text-zinc-400">
                {isLoginView ? (
                  <span>
                    New to AcadSphere?{' '}
                    <button
                      type="button"
                      onClick={() => setIsLoginView(false)}
                      className="text-[#B08CFF] font-semibold hover:underline cursor-pointer"
                    >
                      Create an account
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setIsLoginView(true)}
                      className="text-[#B08CFF] font-semibold hover:underline cursor-pointer"
                    >
                      Log in
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
