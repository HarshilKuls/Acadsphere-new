"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAcadsphere } from "@/context/AcadsphereContext";
import PublicNavbar from "@/components/PublicNavbar";
import { db } from "@/lib/db";
import Footer from "@/components/homepage/Footer";
import { Lock, Trash2, Plus } from "lucide-react";

export default function CGPACalculatorPage() {
  const router = useRouter();
  const { currentUser, gradePoints } = useAcadsphere();
  
  const [mounted, setMounted] = useState(false);
  const [subjects, setSubjects] = useState<{ id: string; name: string; credits: number; grade: string }[]>([]);
  const [name, setName] = useState("");
  const [credits, setCredits] = useState("");
  const [grade, setGrade] = useState("O");
  
  const [uses, setUses] = useState(0);
  const [showGate, setShowGate] = useState(false);
  const [sgpaResult, setSgpaResult] = useState<{ sgpa: number; totalCredits: number } | null>(null);

  const tracked = useRef(false);
  useEffect(() => {
    setMounted(true);
    if (!tracked.current) {
      tracked.current = true;
      db.recordUnauthenticatedCheck("cgpa_calculator").catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (mounted && currentUser) {
      router.push("/cgpa");
    }
  }, [mounted, currentUser, router]);

  if (!mounted || currentUser) return null;

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const c = parseInt(credits);
    if (!c || c <= 0) return;

    setSubjects([
      ...subjects,
      { id: Date.now().toString(), name: name || `Subject ${subjects.length + 1}`, credits: c, grade }
    ]);
    setName("");
    setCredits("");
    setGrade("O");
    setSgpaResult(null); // Clear result when data changes
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
    setSgpaResult(null); // Clear result when data changes
  };

  const handleCalculate = () => {
    if (uses >= 3) {
      setShowGate(true);
      return;
    }
    
    let totalPoints = 0;
    let totalCredits = 0;
    subjects.forEach(s => {
      totalCredits += s.credits;
      totalPoints += (s.credits * (gradePoints[s.grade as keyof typeof gradePoints] || 0));
    });
    
    const sgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    setSgpaResult({ sgpa, totalCredits });
    setUses(u => u + 1);
  };

  const accentColor = "text-cyan-500";
  const accentBorder = "border-cyan-500";
  const accentBg = "bg-cyan-500";
  const accentHoverBg = "hover:bg-cyan-600";
  const accentFocusRing = "focus:ring-cyan-500/50 focus:border-cyan-500";

  return (
    <div className="min-h-screen bg-[#09090f] text-[#e6e0ee] font-sans selection:bg-cyan-500/30 flex flex-col">
      <title>CGPA Calculator & Predictor | Acadsphere</title>
      <meta name="description" content="Accurately calculate your college CGPA and SGPA. Predict your future GPA by adding your target course grades." />
      <PublicNavbar />
      
      <main className="flex-1 max-w-[1000px] w-full mx-auto px-4 md:px-8 pt-24 pb-12 md:pt-32 md:pb-20 relative">
        {showGate && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#09090f]/90 backdrop-blur-sm p-6 text-center animate-in fade-in duration-300">
            <div className={`w-16 h-16 rounded-full ${accentBg} bg-opacity-20 flex items-center justify-center mb-4`}>
              <Lock className={`h-8 w-8 ${accentColor}`} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">You've reached the free limit</h2>
            <p className="text-zinc-400 mb-8 max-w-md">
              Sign in to continue adding courses, save your CGPA history, and access the full academic dashboard.
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
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-white">CGPA <span className={accentColor}>Calculator</span></h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Input your courses, credits, and expected grades to instantly calculate your SGPA/CGPA. Perfect for tracking progress or predicting your final results.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden">
            <form onSubmit={handleAddSubject} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end mb-8">
              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-2 tracking-wider">Course Name (Optional)</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="E.g. Data Structures"
                  className={`w-full rounded-xl border border-zinc-800 bg-[#121214] px-4 py-3 text-zinc-100 outline-none transition-all ${accentFocusRing}`}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-2 tracking-wider">Credits</label>
                <input
                  type="number"
                  value={credits}
                  onChange={e => setCredits(e.target.value)}
                  min="1"
                  max="10"
                  step="1"
                  placeholder="3"
                  required
                  className={`w-full rounded-xl border border-zinc-800 bg-[#121214] px-4 py-3 text-zinc-100 outline-none transition-all ${accentFocusRing}`}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-2 tracking-wider">Grade</label>
                <select
                  value={grade}
                  onChange={e => setGrade(e.target.value)}
                  className={`w-full rounded-xl border border-zinc-800 bg-[#121214] px-4 py-3 text-zinc-100 outline-none transition-all ${accentFocusRing}`}
                >
                  <option>O</option>
                  <option>A+</option>
                  <option>A</option>
                  <option>B+</option>
                  <option>B</option>
                  <option>C</option>
                  <option>F</option>
                </select>
              </div>
              <div>
                <button
                  type="submit"
                  className={`w-full rounded-xl ${accentBg} ${accentHoverBg} px-4 py-3.5 text-sm font-bold text-white transition-all shadow-md active:scale-[0.98]`}
                >
                  Add Course
                </button>
              </div>
            </form>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500">
                    <th className="py-3 font-semibold">Course</th>
                    <th className="py-3 font-semibold">Credits</th>
                    <th className="py-3 font-semibold">Grade</th>
                    <th className="py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map(item => (
                    <tr key={item.id} className="border-b border-zinc-800/50">
                      <td className="py-4 font-medium text-zinc-200">{item.name}</td>
                      <td className="py-4 text-zinc-400">{item.credits}</td>
                      <td className={`py-4 font-bold ${accentColor}`}>{item.grade}</td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => removeSubject(item.id)}
                          className="text-zinc-600 hover:text-red-400 p-2 transition-colors rounded-lg hover:bg-zinc-800/50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {subjects.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-zinc-500 text-sm">
                        No courses added yet. Start adding courses above to see your GPA.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleCalculate}
                disabled={subjects.length === 0}
                className={`rounded-xl ${accentBg} ${accentHoverBg} disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 text-sm font-bold text-white transition-all shadow-md active:scale-[0.98]`}
              >
                Calculate SGPA
              </button>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl text-center flex flex-col justify-center h-full">
              {!sgpaResult ? (
                <div className="text-zinc-500">
                  <span className="block text-xs font-bold uppercase tracking-wider mb-2">Calculated SGPA</span>
                  <span className="text-4xl font-black block mb-2 opacity-30">0.00</span>
                  <span className="text-sm">Click calculate to see result</span>
                </div>
              ) : (
                <div className="animate-in fade-in zoom-in duration-300">
                  <span className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Calculated SGPA</span>
                  <span className={`text-6xl font-black ${accentColor} block mb-2`}>{sgpaResult.sgpa > 0 ? sgpaResult.sgpa.toFixed(2) : "0.00"}</span>
                  <span className="text-sm text-zinc-400">Total Credits: {sgpaResult.totalCredits}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className={`mt-8 text-center border ${accentBorder} bg-opacity-10 rounded-xl p-4`} style={{backgroundColor: "rgba(6, 182, 212, 0.1)"}}>
          <p className="text-sm text-zinc-300">
            <span className={`font-bold ${accentColor}`}>Keep your grades.</span> Sign in to save this semester permanently and track your cumulative CGPA over time.
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
