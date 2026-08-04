import React, { useState, useEffect } from "react";
import { StudentUser, TimetableEntry } from "@/lib/db";

interface HeroGreetingProps {
  currentUser: StudentUser;
  todaysClasses: TimetableEntry[];
  healthScore: number;
}

export default function HeroGreeting({ currentUser, todaysClasses, healthScore }: HeroGreetingProps) {
  const firstName = currentUser.fullName ? currentUser.fullName.split(" ")[0] : "Student";
  const collegeLabel = currentUser.college ? currentUser.college : "College not set";
  const yearLabel = currentUser.year ? currentUser.year : "Year not set";

  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good morning");
    } else if (currentHour < 17) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  return (
    <div className="lg:col-span-8 glass-card relative overflow-hidden min-h-0 sm:min-h-[168px] flex items-end p-4 sm:p-6">
      {/* Decorative Glows */}
      <div className="absolute -top-12 -left-12 w-[150px] h-[150px] rounded-full bg-[var(--accent-20)] blur-[40px] pointer-events-none" />
      <div className="absolute -bottom-5 right-10 w-[100px] h-[100px] rounded-full bg-[#06B6D4]/15 blur-[40px] pointer-events-none" />
      
      <div className="relative z-10 w-full flex flex-col justify-between h-full">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border border-[var(--accent)]/20 bg-[var(--accent)]/10 text-[var(--accent-hover)] mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981] animate-pulse" />
            System Operational
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1 text-[var(--foreground)]">
            {greeting}, {firstName}.
          </h2>
          
          <p className="text-xs text-[var(--muted)] max-w-lg leading-relaxed">
            You have <strong className="text-[var(--foreground)] font-semibold">{todaysClasses.length} lectures</strong> scheduled today. Your academic health score is standing strong at <strong className="text-[var(--accent-hover)] font-extrabold">{healthScore}%</strong>.
          </p>
        </div>
        
        <div className="mt-4 pt-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-[10px] uppercase font-bold text-[var(--muted)] tracking-widest border-t border-[var(--border)] w-full">
          <span className="break-words">COLLEGE: {collegeLabel}</span>
          {currentUser.course && <span className="break-words sm:text-center text-[#7C3AED] dark:text-[#9c82ff]">COURSE: {currentUser.course}</span>}
          <span>YEAR: {yearLabel}</span>
        </div>
      </div>
    </div>
  );
}
