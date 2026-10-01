import React from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  BarChart2, 
  GraduationCap, 
  TrendingUp, 
  CalendarDays, 
  Sparkles, 
  Briefcase, 
  BookOpen, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';

const MODULES = [
  { num: '01', name: 'Timetable', icon: Calendar, boxBg: 'rgba(124, 60, 255, 0.12)', boxBorder: 'rgba(124, 60, 255, 0.25)', iconColor: '#B08CFF' },
  { num: '02', name: 'Attendance', icon: BarChart2, boxBg: 'rgba(6, 182, 212, 0.12)', boxBorder: 'rgba(6, 182, 212, 0.25)', iconColor: '#22D3EE' },
  { num: '03', name: 'CGPA', icon: GraduationCap, boxBg: 'rgba(168, 85, 247, 0.12)', boxBorder: 'rgba(168, 85, 247, 0.25)', iconColor: '#C084FC' },
  { num: '04', name: 'Marks Predictor', icon: TrendingUp, boxBg: 'rgba(239, 68, 68, 0.12)', boxBorder: 'rgba(239, 68, 68, 0.25)', iconColor: '#F87171' },
  { num: '05', name: 'Calendar', icon: CalendarDays, boxBg: 'rgba(234, 179, 8, 0.12)', boxBorder: 'rgba(234, 179, 8, 0.25)', iconColor: '#FACC15' },
  { num: '06', name: 'Events', icon: Sparkles, boxBg: 'rgba(217, 70, 239, 0.12)', boxBorder: 'rgba(217, 70, 239, 0.25)', iconColor: '#E879F9' },
  { num: '07', name: 'Internships', icon: Briefcase, boxBg: 'rgba(249, 115, 22, 0.12)', boxBorder: 'rgba(249, 115, 22, 0.25)', iconColor: '#FB923C' },
  { num: '08', name: 'E-Library', icon: BookOpen, boxBg: 'rgba(59, 130, 246, 0.12)', boxBorder: 'rgba(59, 130, 246, 0.25)', iconColor: '#60A5FA' },
];

export default function ModulesSection() {
  return (
    <section id="modules" className="relative py-12 lg:py-16 text-zinc-100 overflow-hidden z-10">
      <div className="max-w-[1180px] mx-auto px-6">
        {/* Module Header */}
        <div className="flex items-end justify-between border-b border-white/[0.08] pb-4 mb-6 flex-wrap gap-3">
          <div>
            <div className="font-mono text-[10.5px] tracking-[0.16em] text-[#B08CFF] uppercase">
              EXPLORE OUR MODULES
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium tracking-[0.04em] uppercase font-['Space_Grotesk'] text-white mt-1">
              ALL YOU NEED. ALL IN SYNC.
            </h2>
          </div>
          <div className="font-mono text-[10px] tracking-[0.12em] text-zinc-400 uppercase">
            BUILT FOR STUDENTS. DESIGNED FOR A BETTER TOMORROW.
          </div>
        </div>

        {/* 8 Modules Horizontal Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {MODULES.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <div
                key={i}
                className="bg-[#0E0A1A]/70 border border-white/[0.07] rounded-xl p-3.5 flex flex-col items-center text-center transition-all duration-200 hover:border-[#8C8CF9]/40 hover:-translate-y-1 hover:shadow-[0_8px_20px_-6px_rgba(124,60,255,0.3)] group cursor-default"
              >
                <div 
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 transition-transform duration-200 group-hover:scale-110"
                  style={{
                    backgroundColor: mod.boxBg,
                    border: `1px solid ${mod.boxBorder}`,
                    color: mod.iconColor
                  }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="font-mono text-[10px] text-zinc-400 font-medium">
                  {mod.num}
                </div>
                <div className="font-['Space_Grotesk'] text-xs font-medium text-zinc-200 mt-1 whitespace-nowrap overflow-hidden text-ellipsis w-full">
                  {mod.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* Duo Cards Showcase */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 01 Predict, Don't Guess */}
          <div className="bg-[#0E0A1A]/70 border border-white/[0.08] rounded-xl p-7 flex flex-col justify-between relative overflow-hidden group hover:border-[#8C8CF9]/30 transition-all">
            <div>
              <div className="font-mono text-xs text-[#B08CFF] font-medium tracking-wider mb-2">01</div>
              <h3 className="text-xl font-medium tracking-wide uppercase font-['Space_Grotesk'] text-white leading-snug">
                PREDICT,<br />DON&apos;T GUESS.
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400 font-['Hanken_Grotesk'] leading-relaxed max-w-sm">
                Enter what you&apos;ve scored, see possible outcomes, and plan better for the final exam.
              </p>
              <Link 
                href="#auth" 
                className="inline-flex items-center gap-2 mt-4 px-3.5 py-1.5 rounded-lg border border-white/[0.12] bg-white/[0.03] text-xs font-medium text-zinc-200 hover:border-[#8C8CF9]/50 hover:bg-[#8C8CF9]/10 transition-all font-['Hanken_Grotesk']"
              >
                <span>Explore Marks Predictor</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B08CFF]" />
              </Link>
            </div>

            {/* Rising Particle Bars Viz */}
            <div className="mt-8 h-28 flex items-end justify-center gap-3.5 px-4 pb-2 border-b border-white/[0.06] relative">
              <div className="w-7 rounded-t bg-gradient-to-t from-[#7C3CFF]/20 to-[#965CFF]/60 h-[38%] transition-all" />
              <div className="w-7 rounded-t bg-gradient-to-t from-[#7C3CFF]/25 to-[#965CFF]/70 h-[52%] transition-all" />
              <div className="w-7 rounded-t bg-gradient-to-t from-[#7C3CFF]/30 to-[#965CFF]/80 h-[64%] transition-all" />
              <div className="w-7 rounded-t bg-gradient-to-t from-[#7C3CFF]/35 to-[#965CFF]/90 h-[75%] transition-all" />
              
              {/* Highlighted Target Bar with Callout */}
              <div className="w-7 rounded-t bg-gradient-to-t from-[#7C3CFF] to-[#B08CFF] h-[92%] relative shadow-[0_0_18px_rgba(150,92,255,0.7)]">
                {/* Glowing Dot on top */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_10px_#FFFFFF] animate-pulse" />
                
                {/* Badge Callout */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#120B24] border border-[#8C8CF9]/60 px-2.5 py-0.5 rounded text-[10px] font-mono font-medium text-white shadow-[0_0_15px_rgba(140,77,255,0.4)]">
                  Predicted: A Grade
                </div>
              </div>

              <div className="w-7 rounded-t bg-gradient-to-t from-[#7C3CFF]/15 to-[#965CFF]/40 h-[60%] opacity-40 transition-all" />
            </div>
          </div>

          {/* 02 Never Miss A Deadline */}
          <div className="bg-[#0E0A1A]/70 border border-white/[0.08] rounded-xl p-7 flex flex-col justify-between relative overflow-hidden group hover:border-[#8C8CF9]/30 transition-all">
            <div>
              <div className="font-mono text-xs text-[#B08CFF] font-medium tracking-wider mb-2">02</div>
              <h3 className="text-xl font-medium tracking-wide uppercase font-['Space_Grotesk'] text-white leading-snug">
                NEVER MISS<br />A DEADLINE.
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400 font-['Hanken_Grotesk'] leading-relaxed max-w-sm">
                All your classes, exams, events and submissions in one place — with timely reminders.
              </p>
              <Link 
                href="#auth" 
                className="inline-flex items-center gap-2 mt-4 px-3.5 py-1.5 rounded-lg border border-white/[0.12] bg-white/[0.03] text-xs font-medium text-zinc-200 hover:border-[#8C8CF9]/50 hover:bg-[#8C8CF9]/10 transition-all font-['Hanken_Grotesk']"
              >
                <span>Explore Calendar</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B08CFF]" />
              </Link>
            </div>

            {/* 7-Day Deadline Strip & Legend */}
            <div className="mt-8 flex flex-col justify-end">
              <div className="flex items-end justify-between px-6 pb-3 border-b border-white/[0.06]">
                {/* S */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-2.5 rounded-full bg-[#3B82F6] h-8 opacity-80" />
                  <span className="font-mono text-[11px] text-zinc-400">S</span>
                </div>
                {/* M */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-2.5 rounded-full bg-[#8B4DFF] h-12 opacity-80" />
                  <span className="font-mono text-[11px] text-zinc-400">M</span>
                </div>
                {/* T */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-2.5 rounded-full bg-[#3B82F6] h-9 opacity-80" />
                  <span className="font-mono text-[11px] text-zinc-400">T</span>
                </div>
                {/* W - Active Highlight */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-2.5 rounded-full bg-[#EAB308] h-18 shadow-[0_0_14px_rgba(234,179,8,0.7)]" />
                  <span className="font-mono text-[11px] text-[#EAB308] font-bold">W</span>
                </div>
                {/* T */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-2.5 rounded-full bg-[#EF4444] h-14 opacity-80" />
                  <span className="font-mono text-[11px] text-zinc-400">T</span>
                </div>
                {/* F */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-2.5 rounded-full bg-[#8B4DFF] h-11 opacity-80" />
                  <span className="font-mono text-[11px] text-zinc-400">F</span>
                </div>
                {/* S */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-2.5 rounded-full bg-[#06B6D4] h-7 opacity-80" />
                  <span className="font-mono text-[11px] text-zinc-400">S</span>
                </div>
              </div>

              {/* Legend Dots */}
              <div className="flex items-center justify-center gap-5 mt-4 text-[10.5px] font-mono text-zinc-400">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#EAB308]" />
                  Class
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8B4DFF]" />
                  Exam
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
                  Event
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                  Deadline
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
