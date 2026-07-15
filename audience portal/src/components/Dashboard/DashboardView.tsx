import React from "react";
import { StudentUser, TimetableEntry, HackathonEvent, InternshipListing, LibraryItem, CalendarEvent } from "@/lib/db";
import HeroGreeting from "./HeroGreeting";
import ProgressRing from "./ProgressRing";
import FlightPath from "./FlightPath";
import UpNextStack from "./UpNextStack";
import MilestoneBadges from "./MilestoneBadges";
import WeeklyGoals from "./WeeklyGoals";
import CalendarWidget from "./CalendarWidget";
import { Clock, ChevronRight, Award, Star, Target, GraduationCap } from "lucide-react";

interface DashboardViewProps {
  currentUser: StudentUser;
  todaysClasses: TimetableEntry[];
  healthData: { score: number; status: "Safe" | "Warning" | "Critical" };
  currentDayName: string;
  overallCGPA: number;
  eventsFeed: HackathonEvent[];
  nextClass: TimetableEntry | null | undefined;
  cumulativeAttendancePercent: number;
  timetable: TimetableEntry[];
  calendarEvents: CalendarEvent[];
  internshipsFeed: InternshipListing[];
  libraryFeed: LibraryItem[];
  setActiveTab: (tab: string) => void;
  triggerToast: (msg: string) => void;
}

export default function DashboardView({
  currentUser, todaysClasses, healthData, currentDayName, overallCGPA, eventsFeed,
  nextClass, cumulativeAttendancePercent, calendarEvents, internshipsFeed,
  libraryFeed, setActiveTab, triggerToast
}: DashboardViewProps) {
  
  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      
      {/* ─── ZONE A: ACT ─── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <HeroGreeting currentUser={currentUser} todaysClasses={todaysClasses} healthScore={healthData.score} />
        <ProgressRing score={healthData.score} status={healthData.status} />
        <FlightPath todaysClasses={todaysClasses} currentDayName={currentDayName} />
        <UpNextStack nextClass={nextClass} eventsFeed={eventsFeed} onViewEvents={() => setActiveTab("Events / Network")} />
      </section>

      {/* ─── ZONE B: TRACK ─── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-6">
        
        {/* Academic Vitality Card */}
        <div className="lg:col-span-4 glass-card p-6 flex flex-col min-h-[300px]">
          <h3 className="text-sm font-extrabold text-[var(--foreground)]">Academic Vitality</h3>
          
          <div className="relative h-40 w-40 mx-auto flex items-center justify-center mt-6">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <path 
                className="stroke-[var(--outline-dim)]" 
                d="M 14 86 A 44 44 0 1 1 86 86" 
                fill="none" strokeWidth="10" strokeLinecap="round"
              />
              <path 
                className="stroke-[var(--accent)] transition-all duration-1000" 
                d="M 14 86 A 44 44 0 1 1 86 86" 
                fill="none" strokeWidth="10" strokeLinecap="round"
                strokeDasharray="207"
                strokeDashoffset={207 * (1 - (healthData.score / 100))}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center mt-6">
              <span className="text-4xl font-extrabold text-[var(--foreground)]">{(healthData.score / 10).toFixed(1)}</span>
              <span className="text-emerald-500 font-bold text-[9px] uppercase tracking-wider mt-1">Optimum Zone</span>
            </div>
          </div>
          <p className="text-[10px] text-[var(--muted)] text-center mt-auto pt-4">
            Your academic velocity is running at optimum rates. Attendance is verified safe.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* GPA card */}
          <div 
            onClick={() => setActiveTab("CGPA Calculator")}
            className="glass-card p-5 flex flex-col justify-between hover:scale-[1.01] transition-all cursor-pointer hover:border-[var(--accent)]"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-20)] text-[var(--accent)] flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <span className="bg-emerald-500/15 text-emerald-500 px-2 py-0.5 rounded font-bold text-[9px]">+0.2 Target</span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold block text-[var(--foreground)]">{overallCGPA > 0 ? overallCGPA.toFixed(2) : "0.00"}</span>
              <span className="text-[10px] text-[var(--muted)] font-bold uppercase mt-1 block">Cumulative GPA</span>
            </div>
          </div>

          {/* Avg Attendance card */}
          <div 
            onClick={() => setActiveTab("Attendance")}
            className="glass-card p-5 flex flex-col justify-between hover:scale-[1.01] transition-all cursor-pointer hover:border-amber-500/50"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center">
                <Star className="w-4 h-4" />
              </div>
              <span className="bg-[var(--surface-high)] text-[var(--muted)] px-2 py-0.5 rounded font-bold text-[9px]">Target 75%</span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold block text-[var(--foreground)]">{cumulativeAttendancePercent.toFixed(1)}%</span>
              <span className="text-[10px] text-[var(--muted)] font-bold uppercase mt-1 block">Avg. Attendance</span>
            </div>
          </div>

          {/* Semester Drift card */}
          <div className="glass-card p-5 flex flex-col justify-between hover:scale-[1.01] transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-top)] text-[var(--muted)] flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <span className="bg-[var(--surface-high)] text-[var(--muted)] px-2 py-0.5 rounded font-bold text-[9px]">Week 8/16</span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold block text-[var(--foreground)]">0.0%</span>
              <span className="text-[10px] text-[var(--muted)] font-bold uppercase mt-1 block">Semester Drift</span>
            </div>
          </div>

          {/* Momentum Markers grid */}
          <div className="glass-card p-5 sm:col-span-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-extrabold text-[var(--foreground)]">Momentum Markers</h3>
              <div className="flex items-center gap-1 text-[8px] font-bold text-[var(--muted)] uppercase">
                <span>Low</span>
                <div className="h-2.5 w-2.5 rounded bg-[var(--accent-20)]" />
                <div className="h-2.5 w-2.5 rounded bg-[var(--accent)] opacity-50" />
                <div className="h-2.5 w-2.5 rounded bg-[var(--accent)] opacity-80" />
                <div className="h-2.5 w-2.5 rounded bg-[var(--accent)]" />
                <span>High</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1.5 mt-4">
              {Array.from({ length: 30 }).map((_, idx) => {
                const weights = [1, 2, 4, 3, 2, 1, 3, 4, 2, 3, 1, 4, 4, 2, 3, 1, 2, 3, 4, 2, 1, 3, 4, 2, 1, 4, 3, 2, 4, 3];
                const w = weights[idx] || 1;
                return (
                  <div 
                    key={idx} 
                    className={`w-[18px] h-[18px] rounded-md transition-all flex items-center justify-center text-[9px] font-bold hover:scale-125 cursor-pointer ${
                      w === 1 ? "bg-[var(--accent-20)] text-[var(--muted)]" :
                      w === 2 ? "bg-[var(--accent)]/40 text-[var(--foreground)]" :
                      w === 3 ? "bg-[var(--accent)]/70 text-white" :
                      "bg-[var(--accent)] text-white shadow-[0_0_8px_var(--accent-glow)]"
                    }`}
                    title={`Day ${idx + 1}: Weight ${w}`}
                  >
                    {idx + 1}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── ZONE C: JOURNEY ─── */}
      <section className="glass-card mt-6 p-6">
        <div className="flex justify-between items-center pb-3 border-b border-[var(--outline-dim)]">
          <h3 className="text-sm font-extrabold flex items-center gap-2 text-[var(--foreground)]">
            <Award className="w-5 h-5 text-[var(--accent-hover)]" /> Academic Journey
          </h3>
          <span className="text-[10px] text-[var(--muted)]">Level Progression &amp; Weekly Goals</span>
        </div>

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          
          {/* XP Card */}
          <div className="bg-[var(--surface-low)] border border-[var(--outline-dim)] rounded-xl p-5 md:col-span-1">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[var(--muted)] uppercase">Current Status</span>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="h-7 w-7 rounded bg-[var(--accent-20)] text-[var(--accent-hover)] flex items-center justify-center font-extrabold text-xs">
                    {Math.floor(healthData.score / 20) + 1}
                  </div>
                  <span className="text-sm font-extrabold text-[var(--foreground)]">
                    {healthData.score >= 80 ? "Scholar" : healthData.score >= 50 ? "Specialist" : "Novice"}
                  </span>
                </div>
              </div>
              <div className="h-9 w-9 rounded-lg bg-[var(--accent-20)] text-[var(--accent)] flex items-center justify-center border border-[var(--accent)]/30">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4">
              <span className="text-[10px] font-bold text-[var(--muted)] uppercase">Total XP</span>
              <span className="text-2xl font-black block text-[var(--foreground)]">{Math.round(healthData.score * 85 + 200)}</span>
            </div>

            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-[10px] text-[var(--muted)]">
                <span>Progress to Level {Math.floor(healthData.score / 20) + 2}</span>
                <span>{(healthData.score % 20) * 5}%</span>
              </div>
              <div className="h-2 bg-[var(--surface-top)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--accent)] rounded-full" style={{ width: `${(healthData.score % 20) * 5}%` }} />
              </div>
              <span className="text-[9px] text-[var(--muted)] block">
                {1000 - Math.round(healthData.score * 8.5)} XP remaining
              </span>
            </div>
          </div>

          <WeeklyGoals goals={[]} />

        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Semester Timeline */}
          <div className="bg-[var(--surface-low)] border border-[var(--outline-dim)] rounded-xl p-5 md:col-span-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-[var(--muted)] uppercase">Semester Timeline</span>
                <h4 className="text-sm font-extrabold mt-1 text-[var(--foreground)]">Week 8 of 16</h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-[var(--muted)] uppercase">Completed Credits</span>
                <h4 className="text-sm font-extrabold mt-1 text-[var(--foreground)]">18 / 24</h4>
              </div>
            </div>

            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-[10px] text-[var(--muted)]">
                <span>Midterm Horizon</span>
                <span>50% Completed</span>
              </div>
              <div className="h-2 bg-[var(--surface-top)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--accent)] rounded-full" style={{ width: '50%' }} />
              </div>
            </div>

            <div className="flex gap-1.5 mt-4 overflow-x-auto pb-2">
              {Array.from({ length: 16 }).map((_, idx) => {
                const isDone = idx + 1 < 8;
                const isCurrent = idx + 1 === 8;
                return (
                  <div 
                    key={idx} 
                    className={`h-7 w-7 rounded-lg flex items-center justify-center text-[9px] font-bold flex-shrink-0 transition-transform hover:-translate-y-1 ${
                      isDone ? 'bg-[var(--accent-20)] text-[var(--accent-hover)]' :
                      isCurrent ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]' :
                      'bg-[var(--surface-top)] text-[var(--muted)]'
                    }`}
                  >
                    {idx + 1}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[var(--surface-low)] border border-[var(--outline-dim)] rounded-xl p-5 md:col-span-1 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase">Badge Progress</span>
            <div className="mt-4">
              <span className="text-sm font-bold text-[var(--foreground)]">No badge activity yet</span>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface-top)]" />
            </div>
            <p className="mt-4 text-[10px] leading-relaxed text-[var(--muted)]">Earn badges as you complete milestones across Acadsphere.</p>
          </div>

        </div>
        <MilestoneBadges badges={[]} />
      </section>

      {/* ─── ZONE D: EXPLORE ─── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        
        {/* Internships Preview */}
        <div className="glass-card p-5 cursor-pointer hover:border-[var(--accent)] transition-colors group" onClick={() => setActiveTab("Internship")}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-extrabold text-[var(--foreground)]">Career Opportunities</h3>
            <ChevronRight className="w-4 h-4 text-[var(--accent)] group-hover:translate-x-1 transition-transform" />
          </div>
          {internshipsFeed.slice(0, 2).map(item => (
            <div key={item.id} className="p-3 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-dim)] mt-2">
              <div className="flex justify-between items-center text-[8px] font-bold text-[var(--muted)] uppercase">
                <span>{item.company}</span>
                <span>{item.stipend}</span>
              </div>
              <span className="text-xs font-extrabold block mt-1 text-[var(--foreground)] truncate">{item.role}</span>
            </div>
          ))}
        </div>

        {/* E-Library Preview */}
        <div className="glass-card p-5 cursor-pointer hover:border-[var(--accent)] transition-colors group" onClick={() => setActiveTab("E-Library")}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-extrabold text-[var(--foreground)]">Digital Library</h3>
            <ChevronRight className="w-4 h-4 text-[var(--accent)] group-hover:translate-x-1 transition-transform" />
          </div>
          {libraryFeed.slice(0, 2).map(item => (
            <div key={item.id} className="p-3 rounded-xl bg-[var(--surface-low)] border border-[var(--outline-dim)] mt-2">
              <div className="flex justify-between items-center text-[8px] font-bold text-[var(--muted)] uppercase">
                <span>{item.subject}</span>
                <span>{item.type}</span>
              </div>
              <span className="text-xs font-extrabold block mt-1 text-[var(--foreground)] truncate">{item.title}</span>
            </div>
          ))}
        </div>

        <CalendarWidget events={calendarEvents} onOpen={() => setActiveTab("Calendar")} />

      </section>

    </div>
  );
}
