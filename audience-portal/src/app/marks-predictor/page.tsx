"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAcadsphere } from "@/context/AcadsphereContext";
import PublicNavbar from "@/components/PublicNavbar";
import { db } from "@/lib/db";
import Footer from "@/components/homepage/Footer";
import { Lock, Plus, Trash2, Target } from "lucide-react";

type CourseCard = {
  id: string;
  name: string;
  internals: string;
  internalsTotal: string;
  externalsTotal: string;
  targetGrade: "O" | "A+" | "A" | "B+" | "B" | "C";
  result: { targetBoundary: number; internalContrib: number; neededExternalContrib: number; rawExternalNeeded: number; alreadySecured: boolean; feasible: boolean } | null;
};

export default function MarksPredictorPage() {
  const router = useRouter();
  const { currentUser, getExternalRequirement } = useAcadsphere();
  
  const [mounted, setMounted] = useState(false);
  const [courses, setCourses] = useState<CourseCard[]>([
    { id: "1", name: "", internals: "40", internalsTotal: "60", externalsTotal: "100", targetGrade: "A+", result: null }
  ]);
  
  const [uses, setUses] = useState(0);
  const [showGate, setShowGate] = useState(false);

  const tracked = useRef(false);
  useEffect(() => {
    setMounted(true);
    if (!tracked.current) {
      tracked.current = true;
      db.recordUnauthenticatedCheck("marks_predictor").catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (mounted && currentUser) {
      router.push("/marks");
    }
  }, [mounted, currentUser, router]);

  if (!mounted || currentUser) return null;

  const handleAddCourse = () => {
    if (courses.length < 3) {
      setCourses([...courses, { id: Date.now().toString(), name: "", internals: "40", internalsTotal: "60", externalsTotal: "100", targetGrade: "A+", result: null }]);
    }
  };

  const handleRemoveCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const updateCourse = (id: string, field: keyof CourseCard, value: string) => {
    setCourses(courses.map(c => {
      if (c.id === id) {
        return { ...c, [field]: value, result: null };
      }
      return c;
    }));
  };

  const handleCalculate = (id: string) => {
    if (uses >= 3) {
      setShowGate(true);
      return;
    }
    
    setCourses(courses.map(c => {
      if (c.id === id) {
        const mockPrediction = {
          id: c.id,
          userId: "public",
          semester: 1,
          subject: c.name || `Subject`,
          internalScore: parseFloat(c.internals) || 0,
          internalTotal: parseFloat(c.internalsTotal) || 60,
          externalTotal: parseFloat(c.externalsTotal) || 100,
          targetGrade: c.targetGrade,
          createdAt: new Date().toISOString()
        };
        const req = getExternalRequirement(mockPrediction);
        return { ...c, result: req };
      }
      return c;
    }));

    setUses(u => u + 1);
  };

  const accentColor = "text-pink-500";
  const accentBorder = "border-pink-500";
  const accentBg = "bg-pink-500";
  const accentHoverBg = "hover:bg-pink-600";
  const accentFocusRing = "focus:ring-pink-500/50 focus:border-pink-500";

  return (
    <div className="min-h-screen bg-[#09090f] text-[#e6e0ee] font-sans selection:bg-pink-500/30 flex flex-col">
      <title>Marks Predictor | Acadsphere</title>
      <meta name="description" content="Predict the exact external marks you need to secure your target grade based on your current internal scores." />
      <PublicNavbar />
      
      <main className="flex-1 max-w-[1000px] w-full mx-auto px-4 md:px-8 pt-24 pb-12 md:pt-32 md:pb-20 relative">
        {showGate && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#09090f]/90 backdrop-blur-sm p-6 text-center animate-in fade-in duration-300">
            <div className={`w-16 h-16 rounded-full ${accentBg} bg-opacity-20 flex items-center justify-center mb-4`}>
              <Lock className={`h-8 w-8 ${accentColor}`} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">You've reached the free limit</h2>
            <p className="text-zinc-400 mb-8 max-w-md">
              Sign in to continue predicting marks, save your targets, and access the full academic dashboard.
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
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-white">Marks <span className={accentColor}>Predictor</span></h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Find out exactly how many marks you need in your external exams to achieve your desired target grade.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {courses.map((c, index) => (
            <div key={c.id} className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
                <h3 className="text-xs font-bold tracking-wide text-zinc-500 uppercase flex items-center gap-1.5">
                  <Target className={`h-4 w-4 ${accentColor}`} /> Course {index + 1}
                </h3>
                {courses.length > 1 && (
                  <button onClick={() => handleRemoveCourse(c.id)} className="text-zinc-500 hover:text-red-400 transition-colors p-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end mb-8">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5 tracking-wider">Course Name</label>
                  <input
                    type="text"
                    value={c.name}
                    onChange={e => updateCourse(c.id, "name", e.target.value)}
                    placeholder="E.g. OS"
                    className={`w-full rounded-xl border border-zinc-800 bg-[#121214] px-4 py-3 text-xs text-zinc-100 outline-none transition-all ${accentFocusRing}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5 tracking-wider">Internals Scored</label>
                  <input
                    type="number"
                    value={c.internals}
                    onChange={e => updateCourse(c.id, "internals", e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="40"
                    className={`w-full rounded-xl border border-zinc-800 bg-[#121214] px-4 py-3 text-xs text-zinc-100 outline-none transition-all ${accentFocusRing}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5 tracking-wider">Internals Out Of</label>
                  <input
                    type="number"
                    value={c.internalsTotal}
                    onChange={e => updateCourse(c.id, "internalsTotal", e.target.value)}
                    min="0.01"
                    step="0.01"
                    placeholder="60"
                    className={`w-full rounded-xl border border-zinc-800 bg-[#121214] px-4 py-3 text-xs text-zinc-100 outline-none transition-all ${accentFocusRing}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5 tracking-wider">Externals Out Of</label>
                  <input
                    type="number"
                    value={c.externalsTotal}
                    onChange={e => updateCourse(c.id, "externalsTotal", e.target.value)}
                    min="0.01"
                    step="0.01"
                    placeholder="100"
                    className={`w-full rounded-xl border border-zinc-800 bg-[#121214] px-4 py-3 text-xs text-zinc-100 outline-none transition-all ${accentFocusRing}`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5 tracking-wider">Target Grade</label>
                  <select
                    value={c.targetGrade}
                    onChange={e => updateCourse(c.id, "targetGrade", e.target.value)}
                    className={`w-full rounded-xl border border-zinc-800 bg-[#121214] px-4 py-3 text-xs text-zinc-100 outline-none transition-all ${accentFocusRing}`}
                  >
                    <option>O</option>
                    <option>A+</option>
                    <option>A</option>
                    <option>B+</option>
                    <option>B</option>
                    <option>C</option>
                  </select>
                </div>
              </div>

              {!c.result ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-[10px] text-zinc-500 font-medium italic">
                    * Calculation scale assumes Internals = 60%, Externals = 40% grade weighting.
                  </div>
                  <button
                    onClick={() => handleCalculate(c.id)}
                    disabled={!c.internals || !c.internalsTotal || !c.externalsTotal}
                    className={`w-full sm:w-auto rounded-xl ${accentBg} ${accentHoverBg} disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 text-sm font-bold text-white transition-all shadow-md active:scale-[0.98]`}
                  >
                    Generate Prediction
                  </button>
                </div>
              ) : (
                <div className="animate-in slide-in-from-bottom-4 duration-500 bg-[#121214] border border-zinc-800 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <span className="text-base font-extrabold block text-white">{c.name || `Course ${index + 1}`}</span>
                      <span className="text-[10px] text-zinc-500 font-semibold">Current Internals: {c.internals} / {c.internalsTotal} ({c.result.internalContrib.toFixed(1)} / 60.0 pts)</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-zinc-500 block uppercase">Target Grade</span>
                      <span className={`text-lg font-extrabold ${accentColor} block`}>{c.targetGrade} ({c.result.targetBoundary}%)</span>
                    </div>
                  </div>

                  <div className="space-y-4 p-4 rounded-xl border bg-zinc-900/50 border-zinc-800">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Needed External Score:</span>
                      <span className={`font-bold ${c.result.feasible ? "text-white" : "text-rose-500"}`}>
                        {c.result.alreadySecured ? "Already secured" : c.result.feasible ? `${c.result.rawExternalNeeded} / ${c.externalsTotal}` : "Impossible"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-[10px]">
                      <span className="text-zinc-500">Weighted points still needed:</span>
                      <span className="font-bold text-zinc-300">{Math.max(0, c.result.neededExternalContrib).toFixed(1)} / 40</span>
                    </div>

                    <div className="w-full h-2 rounded-full overflow-hidden bg-zinc-800">
                      <div
                        className={`h-full rounded-full transition-all ${c.result.feasible ? accentBg : "bg-red-500"}`}
                        style={{ width: `${Math.min(100, Math.max(0, (c.result.rawExternalNeeded / parseFloat(c.externalsTotal)) * 100))}%` }}
                      />
                    </div>

                    {!c.result.feasible && (
                      <p className="text-[10px] text-red-500 font-bold leading-normal mt-2">
                        Target grade is mathematically out of bounds. Reduce the target grade or confirm your exam totals.
                      </p>
                    )}
                  </div>

                  <div className="mt-4 text-center">
                    <span className="text-[10px] font-medium text-zinc-500 italic">
                      {c.result.alreadySecured ? "Current internals already meet this target." : c.result.feasible ? "Use this as your minimum final exam target." : "Target grade warning active."}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {courses.length < 3 && (
            <button
              onClick={handleAddCourse}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-900/20 hover:bg-zinc-900/40 px-4 py-5 text-sm font-bold text-zinc-400 hover:text-zinc-300 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Another Course
            </button>
          )}
        </div>

        <div className={`mt-8 text-center border ${accentBorder} bg-opacity-10 rounded-xl p-4`} style={{backgroundColor: "rgba(236, 72, 153, 0.1)"}}>
          <p className="text-sm text-zinc-300">
            <span className={`font-bold ${accentColor}`}>Want to save these targets?</span> Sign in to keep your predictions permanently on your dashboard.
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
