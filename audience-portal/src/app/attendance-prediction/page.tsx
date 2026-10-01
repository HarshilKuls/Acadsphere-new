"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAcadsphere } from "@/context/AcadsphereContext";
import PublicNavbar from "@/components/PublicNavbar";
import { db } from "@/lib/db";
import Footer from "@/components/homepage/Footer";
import { Target, Lock, Plus, Trash2 } from "lucide-react";

type SubjectCard = {
  id: string;
  subject: string;
  attended: string;
  total: string;
  result: { percent: number; skips: number; rec: number; isSafe: boolean } | null;
};

export default function AttendancePredictionPage() {
  const router = useRouter();
  const { currentUser } = useAcadsphere();
  
  const [mounted, setMounted] = useState(false);
  const [threshold, setThreshold] = useState<66 | 75>(75);
  const [subjects, setSubjects] = useState<SubjectCard[]>([
    { id: "1", subject: "", attended: "", total: "", result: null }
  ]);
  const [uses, setUses] = useState(0);
  const [showGate, setShowGate] = useState(false);

  const tracked = useRef(false);
  useEffect(() => {
    setMounted(true);
    if (!tracked.current) {
      tracked.current = true;
      db.recordUnauthenticatedCheck("attendance_predictor").catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (mounted && currentUser) {
      router.push("/attendance");
    }
  }, [mounted, currentUser, router]);

  if (!mounted || currentUser) return null;

  const handleAddSubject = () => {
    if (subjects.length < 3) {
      setSubjects([...subjects, { id: Date.now().toString(), subject: "", attended: "", total: "", result: null }]);
    }
  };

  const handleRemoveSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const updateSubject = (id: string, field: keyof SubjectCard, value: string) => {
    setSubjects(subjects.map(s => {
      if (s.id === id) {
        return { ...s, [field]: value, result: null };
      }
      return s;
    }));
  };

  const handleCalculate = (id: string) => {
    if (uses >= 3) {
      setShowGate(true);
      return;
    }

    setSubjects(subjects.map(s => {
      if (s.id === id) {
        const att = parseInt(s.attended) || 0;
        const tot = parseInt(s.total) || 0;
        
        if (tot === 0) return s;

        const reqRatio = threshold / 100;
        const percent = (att / tot) * 100;
        const isSafe = percent >= threshold;
        const skips = Math.max(0, Math.floor((att - reqRatio * tot) / reqRatio));
        const rec = Math.max(0, Math.ceil((reqRatio * tot - att) / (1 - reqRatio)));

        return { ...s, result: { percent, skips, rec, isSafe } };
      }
      return s;
    }));
    
    setUses(u => u + 1);
  };

  const accentColor = "text-orange-500";
  const accentBorder = "border-orange-500";
  const accentBg = "bg-orange-500";
  const accentHoverBg = "hover:bg-orange-600";
  const accentFocusRing = "focus:ring-orange-500/50 focus:border-orange-500";

  return (
    <div className="min-h-screen bg-[#09090f] text-[#e6e0ee] font-sans selection:bg-orange-500/30 flex flex-col">
      <title>Attendance Predictor & Calculator | Acadsphere</title>
      <meta name="description" content="Calculate your college attendance percentage, find out how many classes you can skip, or how many you need to attend to reach the minimum threshold." />
      <PublicNavbar />
      
      <main className="flex-1 max-w-[1000px] w-full mx-auto px-4 md:px-8 pt-24 pb-12 md:pt-32 md:pb-20 relative">
        {showGate && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#09090f]/90 backdrop-blur-sm p-6 text-center animate-in fade-in duration-300">
            <div className={`w-16 h-16 rounded-full ${accentBg} bg-opacity-20 flex items-center justify-center mb-4`}>
              <Lock className={`h-8 w-8 ${accentColor}`} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">You've used your 3 free predictions</h2>
            <p className="text-zinc-400 mb-8 max-w-md">
              Sign in to continue using the attendance predictor, save your courses, and build your complete academic dashboard.
            </p>
            <button
              onClick={() => router.push("/#auth")}
              className={`px-8 py-3 ${accentBg} ${accentHoverBg} text-white font-bold rounded-full transition-colors`}
            >
              Sign In / Sign Up
            </button>
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-white">Attendance <span className={accentColor}>Predictor</span></h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Calculate your current attendance percentage and instantly know how many classes you can afford to skip, or exactly how many you need to attend to get back to the safe zone.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center bg-zinc-900/40 border border-zinc-800 p-4 rounded-xl mb-8 gap-4">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Min. Requirement</span>
          <div className="flex border rounded-lg p-1 gap-1 bg-[#0a0a0c] border-white/5">
            <button
              onClick={() => { setThreshold(66); setSubjects(subjects.map(s => ({...s, result: null}))); }}
              className={`text-xs px-4 py-1.5 rounded-md font-bold transition-all ${threshold === 66 ? 'bg-[#27272a] text-zinc-200 shadow-sm' : 'bg-transparent text-zinc-500 hover:text-zinc-400'}`}
            >
              66%
            </button>
            <button
              onClick={() => { setThreshold(75); setSubjects(subjects.map(s => ({...s, result: null}))); }}
              className={`text-xs px-4 py-1.5 rounded-md font-bold transition-all ${threshold === 75 ? 'bg-[#27272a] text-zinc-200 shadow-sm' : 'bg-transparent text-zinc-500 hover:text-zinc-400'}`}
            >
              75%
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {subjects.map((s, index) => (
            <div key={s.id} className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase flex items-center gap-1.5">
                  <Target className={`h-4 w-4 ${accentColor}`} /> Subject {index + 1}
                </h3>
                {subjects.length > 1 && (
                  <button onClick={() => handleRemoveSubject(s.id)} className="text-zinc-500 hover:text-red-400 transition-colors p-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end mb-6">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2 tracking-wider">Subject / Course Name</label>
                  <input
                    type="text"
                    value={s.subject}
                    onChange={e => updateSubject(s.id, "subject", e.target.value)}
                    placeholder="E.g. Data Structures"
                    className={`w-full rounded-xl border border-zinc-800 bg-[#121214] px-4 py-3 text-sm text-zinc-100 outline-none transition-all ${accentFocusRing}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2 tracking-wider">Classes Attended</label>
                  <input
                    type="number"
                    value={s.attended}
                    onChange={e => updateSubject(s.id, "attended", e.target.value)}
                    min="0"
                    step="1"
                    placeholder="0"
                    className={`w-full rounded-xl border border-zinc-800 bg-[#121214] px-4 py-3 text-sm text-zinc-100 outline-none transition-all ${accentFocusRing}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2 tracking-wider">Total Conducted</label>
                  <input
                    type="number"
                    value={s.total}
                    onChange={e => updateSubject(s.id, "total", e.target.value)}
                    min="1"
                    step="1"
                    placeholder="0"
                    className={`w-full rounded-xl border border-zinc-800 bg-[#121214] px-4 py-3 text-sm text-zinc-100 outline-none transition-all ${accentFocusRing}`}
                  />
                </div>
              </div>

              {!s.result ? (
                <button
                  onClick={() => handleCalculate(s.id)}
                  disabled={!s.attended || !s.total}
                  className={`w-full rounded-xl ${accentBg} ${accentHoverBg} disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3.5 text-sm font-bold text-white transition-all shadow-md active:scale-[0.98]`}
                >
                  Calculate Margin
                </button>
              ) : (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between mb-4 border-t border-zinc-800/50 pt-6">
                    <div>
                      <span className="text-sm font-bold block text-white">{s.subject || `Subject ${index + 1}`}</span>
                      <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Tally: {s.attended} / {s.total}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${s.result.isSafe ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                      {s.result.percent.toFixed(1)}% Current
                    </span>
                  </div>
                  
                  <div className="w-full h-1.5 rounded-full my-5 overflow-hidden bg-zinc-800 border border-white/5">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${s.result.isSafe ? accentBg : "bg-red-500"}`}
                      style={{ width: `${Math.min(100, s.result.percent)}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0a0a0c] border border-white/5 rounded-xl p-4 text-center">
                      <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Skip Margin</span>
                      <span className={`text-2xl font-extrabold ${s.result.isSafe ? "text-emerald-400" : "text-zinc-600"}`}>
                        {s.result.isSafe ? `${s.result.skips}` : "0"}
                      </span>
                      <span className="block text-[10px] text-zinc-500 mt-1">classes</span>
                    </div>
                    <div className="bg-[#0a0a0c] border border-white/5 rounded-xl p-4 text-center">
                      <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Recovery Target</span>
                      <span className={`text-2xl font-extrabold ${!s.result.isSafe ? "text-red-400" : "text-zinc-600"}`}>
                        {!s.result.isSafe ? `${s.result.rec}` : "Safe"}
                      </span>
                      <span className="block text-[10px] text-zinc-500 mt-1">{!s.result.isSafe ? 'classes' : ''}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {subjects.length < 3 && (
            <button
              onClick={handleAddSubject}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-900/20 hover:bg-zinc-900/40 px-4 py-5 text-sm font-bold text-zinc-400 hover:text-zinc-300 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Another Subject
            </button>
          )}
        </div>

        <div className={`mt-8 text-center border ${accentBorder} bg-opacity-10 rounded-xl p-4`} style={{backgroundColor: "rgba(249, 115, 22, 0.1)"}}>
          <p className="text-sm text-zinc-300">
            <span className={`font-bold ${accentColor}`}>Want to save these results?</span> Sign in to keep your trackers permanently on your dashboard.
          </p>
          <button onClick={() => router.push("/#auth")} className={`mt-3 ${accentColor} text-xs font-bold hover:underline`}>
            Sign In / Sign Up →
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
