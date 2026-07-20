import React from "react";

interface ProgressRingProps {
  score: number;
  status: "Safe" | "Warning" | "Critical";
}

export default function ProgressRing({ score, status }: ProgressRingProps) {
  const radius = 82;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const xpGained = Math.round(score * 12.5 + 400);
  const momentum = status === "Safe" ? 12 : status === "Warning" ? 5 : 2;

  return (
    <div className="lg:col-span-4 glass-card flex flex-col justify-between items-center relative overflow-hidden p-5">
      <div className="relative h-44 w-44 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
          <circle 
            cx="96" cy="96" r={radius} 
            className="stroke-[var(--outline-dim)]" 
            strokeWidth="11" fill="none" 
          />
          <circle 
            cx="96" cy="96" r={radius} 
            className="stroke-[var(--accent)] transition-all duration-1000"
            strokeWidth="11" 
            strokeLinecap="round"
            fill="none" 
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold tracking-tighter text-[var(--foreground)]">{score}%</span>
          <span className="text-[8px] font-bold text-[var(--muted)] uppercase tracking-widest mt-1">Today's Progress</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 w-full mt-4">
        <div className="text-center p-2.5 rounded-xl bg-[var(--surface-high)] border border-[var(--outline-dim)]">
          <span className="text-sm font-extrabold text-[var(--foreground)] block mb-0.5">{xpGained}</span>
          <span className="text-[9px] font-bold text-[var(--muted)] uppercase">XP Gained</span>
        </div>
        <div className="text-center p-2.5 rounded-xl bg-[var(--surface-high)] border border-[var(--outline-dim)]">
          <span className="text-sm font-extrabold text-[#10b981] block mb-0.5">+{momentum}</span>
          <span className="text-[9px] font-bold text-[var(--muted)] uppercase">Momentum</span>
        </div>
      </div>
    </div>
  );
}
