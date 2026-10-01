import React, { useState, useEffect } from "react";
import { StudentUser, TimetableEntry } from "@/lib/db";
import AeroShards from "./AeroShards";


interface HeroGreetingProps {
  currentUser: StudentUser;
  todaysClasses: TimetableEntry[];
  healthScore: number;
}

const handleAeroShardsError = (error: any) => console.error('AeroShards error:', error);

const HeroGreeting = React.memo(function HeroGreeting({ currentUser, todaysClasses, healthScore }: HeroGreetingProps) {
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
    <div className="lg:col-span-8 glass-card relative overflow-hidden min-h-[125px] sm:min-h-[320px] flex items-stretch sm:items-end p-3.5 sm:p-6 lg:p-8">
      <div className="absolute inset-0 z-0">
        <AeroShards onError={handleAeroShardsError} />
      </div>

      <div className="relative z-10 w-full flex flex-col justify-between h-full">
        <div className="pt-1 sm:pt-12 lg:pt-16">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8.5px] sm:text-[10px] font-bold border border-[var(--accent)]/20 bg-[var(--accent)]/10 text-[var(--accent-hover)] mb-1.5 sm:mb-3">
            <span className="h-1 sm:h-1.5 w-1 sm:w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981] animate-pulse" />
            System Operational
          </div>

          <h2 className="text-lg sm:text-3xl font-extrabold tracking-tight mb-0.5 sm:mb-1 text-[var(--foreground)]">
            {greeting}, {firstName}.
          </h2>

          <p className="text-[10px] sm:text-xs text-[var(--muted)] max-w-lg leading-snug sm:leading-relaxed">
            You have <strong className="text-[var(--foreground)] font-semibold">{todaysClasses.length} lectures</strong> scheduled today. Your academic health score is standing strong at <strong className="text-[var(--accent-hover)] font-extrabold">{healthScore}%</strong>.
          </p>
        </div>

        <div className="mt-2.5 pt-2.5 sm:mt-4 sm:pt-4 flex flex-wrap gap-x-3 gap-y-1 sm:flex-nowrap sm:gap-1 items-center justify-start sm:justify-between text-[8.5px] sm:text-[10px] uppercase font-bold text-[var(--muted)] tracking-widest border-t border-[var(--border)]/50 sm:border-[var(--border)] w-full">
          <span className="break-words">COLLEGE: {collegeLabel}</span>
          {currentUser.course && <span className="break-words sm:text-center text-[#7C3AED] dark:text-[#9c82ff]">COURSE: {currentUser.course}</span>}
          <span>YEAR: {yearLabel}</span>
        </div>
      </div>
    </div>
  );
});

export default HeroGreeting;
