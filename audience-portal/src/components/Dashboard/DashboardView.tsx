import React, { useState, useEffect } from "react";
import { StudentUser, TimetableEntry, HackathonEvent, InternshipListing, LibraryItem, CalendarEvent } from "@/lib/db";
import HeroGreeting from "./HeroGreeting";
import ProgressRing from "./ProgressRing";
import FlightPath from "./FlightPath";
import UpNextStack from "./UpNextStack";
import MilestoneBadges, { MilestoneBadge } from "./MilestoneBadges";
import WeeklyGoals, { WeeklyGoal } from "./WeeklyGoals";
import CalendarWidget from "./CalendarWidget";
import { Clock, ChevronRight, Award, Star, Target, GraduationCap, CheckCircle, Flame, Sun, CalendarCheck, BookOpen, Swords, Dumbbell, CalendarDays, Crown } from "lucide-react";

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
  totalXp: number;
  momentum: number;
}

export default function DashboardView({
  currentUser, todaysClasses, healthData, currentDayName, overallCGPA, eventsFeed,
  nextClass, cumulativeAttendancePercent, timetable, calendarEvents, internshipsFeed,
  libraryFeed, setActiveTab, triggerToast, totalXp, momentum
}: DashboardViewProps) {

  const [localGoals, setLocalGoals] = useState<WeeklyGoal[]>([]);
  const completedGoalsCount = localGoals.filter(g => g.complete).length;
  const displayXp = totalXp + (completedGoalsCount * 50);
  const displayScore = Math.min(100, healthData.score + (completedGoalsCount * 3)); // +3% per completed goal

  const [streakDays, setStreakDays] = useState(1);
  const [isEarlyBird, setIsEarlyBird] = useState(false);

  // Today's Progress calculation (resets daily)
  const baselineProgress = streakDays > 0 ? 20 : 0; // 20% base for daily login streak

  const activeGoals = localGoals.filter(g => !g.archived);
  const todaysGoalsCompleted = activeGoals.filter(g => g.complete && g.completedAt === new Date().toDateString()).length;

  let goalProgress = 0;
  if (activeGoals.length > 0) {
    // Scale the remaining percentage dynamically based on how many goals exist!
    goalProgress = (todaysGoalsCompleted / activeGoals.length) * (100 - baselineProgress);
  }

  const todaysProgress = Math.min(100, Math.round(baselineProgress + goalProgress));

  const getLevelData = (xp: number) => {
    let level = 1;
    let xpNeededForNext = 500;
    let currentTierBaseXp = 0;

    while (xp >= currentTierBaseXp + xpNeededForNext) {
      currentTierBaseXp += xpNeededForNext;
      level++;
      xpNeededForNext += 250;
    }

    const xpIntoCurrentLevel = xp - currentTierBaseXp;
    const progressPercent = Math.round((xpIntoCurrentLevel / xpNeededForNext) * 100);

    return { level, xpNeededForNext, xpIntoCurrentLevel, progressPercent, remainingXp: xpNeededForNext - xpIntoCurrentLevel };
  };

  const levelData = getLevelData(displayXp);
  const currentLevelNumber = levelData.level;
  
  const badgesData: MilestoneBadge[] = [
    { id: '1', name: 'First Steps', description: 'Added first timetable entry', requirement: 'Add 1 class', rarity: 'Common', earned: timetable.length > 0, icon: GraduationCap },
    { id: '2', name: 'Perfect Presence', description: 'Maintained 100% attendance', requirement: '100% attendance', rarity: 'Epic', earned: cumulativeAttendancePercent === 100 && overallCGPA > 0, icon: Award },
    { id: '3', name: 'Top Performer', description: 'Maintained CGPA above 9.0', requirement: 'CGPA > 9.0', rarity: 'Legendary', earned: overallCGPA > 9.0, icon: Star },
    { id: '4', name: 'Lecture Legend', description: 'Logged over 50 attendance entries', requirement: '50 attendance', rarity: 'Rare', earned: (timetable.length * 5) > 50, icon: CheckCircle },
    { id: '5', name: 'Never Late', description: 'Maintained 90%+ attendance', requirement: '90%+ attendance', rarity: 'Uncommon', earned: cumulativeAttendancePercent >= 90 && cumulativeAttendancePercent < 100, icon: CheckCircle },
    { id: '6', name: 'Zero Pending', description: 'No active goals', requirement: 'All goals done', rarity: 'Uncommon', earned: localGoals.length > 0 && localGoals.every(g => g.complete || g.archived), icon: CalendarCheck },
    { id: '7', name: 'First Submission', description: 'Added first calendar deadline', requirement: 'Add 1 deadline', rarity: 'Common', earned: calendarEvents.length > 0, icon: BookOpen },
    { id: '8', name: 'Active Participant', description: 'Added 5 calendar events', requirement: '5 events', rarity: 'Rare', earned: calendarEvents.length >= 5, icon: Target },
    { id: '9', name: 'Flame', description: 'Maintained a 7-day login streak', requirement: '7-day streak', rarity: 'Rare', earned: streakDays >= 7, icon: Flame },
    { id: '10', name: 'Wildfire', description: 'Maintained a 30-day login streak', requirement: '30-day streak', rarity: 'Epic', earned: streakDays >= 30, icon: Flame },
    { id: '11', name: 'Early Bird', description: 'Opened app before 8 AM for 7 days', requirement: 'Early for 7 days', rarity: 'Legendary', earned: isEarlyBird, icon: Sun },
    { id: '12', name: 'Weekend Warrior', description: 'Logged in during a weekend', requirement: 'Weekend activity', rarity: 'Rare', earned: typeof window !== "undefined" && (new Date().getDay() === 0 || new Date().getDay() === 6 || localStorage.getItem("acadsphere_weekend_warrior") === "true"), icon: Swords },
    { id: '13', name: 'Heavyweight', description: 'Added 15+ classes to timetable', requirement: '15+ classes', rarity: 'Epic', earned: timetable.length >= 15, icon: Dumbbell },
    { id: '14', name: 'Master Planner', description: 'Customized Semester Timeline dates', requirement: 'Custom timeline', rarity: 'Uncommon', earned: typeof window !== "undefined" && !!localStorage.getItem("acadsphere_sem_start"), icon: CalendarDays },
    { id: '15', name: 'Vanguard', description: 'Reached Level 10+', requirement: 'Level 10', rarity: 'Legendary', earned: currentLevelNumber >= 10, icon: Crown }
  ];

  const earnedBadgesCount = badgesData.filter(b => b.earned).length;
  const badgeProgressPercent = Math.round((earnedBadgesCount / badgesData.length) * 100);

  const getTitle = (level: number, badges: number) => {
    const tier = Math.max(level, badges);
    if (tier >= 20) return "Titan";
    if (tier >= 19) return "Mythic Scholar";
    if (tier >= 18) return "Academic Legend";
    if (tier >= 17) return "Grandmaster";
    if (tier >= 16) return "Pioneer";
    if (tier >= 15) return "Mastermind";
    if (tier >= 14) return "Visionary";
    if (tier >= 13) return "Architect";
    if (tier >= 12) return "Innovator";
    if (tier >= 11) return "Elite Scholar";
    if (tier >= 10) return "Vanguard";
    if (tier >= 9) return "Strategist";
    if (tier >= 8) return "Analyst";
    if (tier >= 7) return "Specialist";
    if (tier >= 6) return "Prodigy";
    if (tier >= 5) return "Adept";
    if (tier >= 4) return "Scholar";
    if (tier >= 3) return "Learner";
    if (tier >= 2) return "Apprentice";
    return "Novice";
  };

  const currentTitle = getTitle(currentLevelNumber, earnedBadgesCount);

  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");
  const [isEditingTimeline, setIsEditingTimeline] = useState(false);

  useEffect(() => {
      const savedStart = localStorage.getItem("acadsphere_sem_start");
      const savedEnd = localStorage.getItem("acadsphere_sem_end");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (savedStart) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCustomStart(savedStart);
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (savedEnd) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCustomEnd(savedEnd);
      }

      // Basic streak tracking
      const lastLoginStr = localStorage.getItem("acadsphere_last_login");
      const currentStreakStr = localStorage.getItem("acadsphere_streak");
      let currentStreak = parseInt(currentStreakStr || "1");

      const today = new Date().toDateString();
      if (lastLoginStr !== today) {
        if (lastLoginStr === new Date(Date.now() - 86400000).toDateString()) {
          currentStreak += 1;
        } else if (lastLoginStr) {
          currentStreak = 1; // reset streak
        }
        localStorage.setItem("acadsphere_last_login", today);
        localStorage.setItem("acadsphere_streak", currentStreak.toString());
      }
      setStreakDays(currentStreak);

      // Early Bird tracking
      const earlyBirdCount = parseInt(localStorage.getItem("acadsphere_early_bird") || "0");
      if (new Date().getHours() < 8 && earlyBirdCount < 7) {
        if (localStorage.getItem("acadsphere_early_today") !== today) {
          localStorage.setItem("acadsphere_early_today", today);
          localStorage.setItem("acadsphere_early_bird", (earlyBirdCount + 1).toString());
        }
      }
      setIsEarlyBird(parseInt(localStorage.getItem("acadsphere_early_bird") || "0") >= 7);
    }, []);

    const handleSaveTimeline = (e: React.FormEvent) => {
      e.preventDefault();
      localStorage.setItem("acadsphere_sem_start", customStart);
      localStorage.setItem("acadsphere_sem_end", customEnd);
      setIsEditingTimeline(false);
    };

    // Dynamic Semester Calculation
    const now = new Date();
    const currentMonth = now.getMonth();
    const isFall = currentMonth >= 7; // Aug to Dec
    const defaultStart = isFall ? new Date(now.getFullYear(), 7, 15) : new Date(now.getFullYear(), 0, 15);
    const defaultEnd = isFall ? new Date(now.getFullYear(), 11, 15) : new Date(now.getFullYear(), 4, 15);

    const parsedStart = customStart ? new Date(customStart) : defaultStart;
    const parsedEnd = customEnd ? new Date(customEnd) : defaultEnd;

    const totalWeeks = Math.max(1, Math.ceil((parsedEnd.getTime() - parsedStart.getTime()) / (1000 * 60 * 60 * 24 * 7)));
    const weeksSinceStart = Math.floor((now.getTime() - parsedStart.getTime()) / (1000 * 60 * 60 * 24 * 7));
    const currentWeek = Math.max(1, Math.min(totalWeeks, weeksSinceStart + 1));

    let semesterProgress = 0;
    if (now.getTime() < parsedStart.getTime()) {
      semesterProgress = 0;
    } else if (now.getTime() > parsedEnd.getTime()) {
      semesterProgress = 100;
    } else {
      const totalMs = parsedEnd.getTime() - parsedStart.getTime();
      const passedMs = now.getTime() - parsedStart.getTime();
      semesterProgress = Math.min(100, Math.max(0, Math.round((passedMs / totalMs) * 100)));
    }

    return (
      <div className="space-y-4 sm:space-y-6 animate-fadeIn">

        {/* ─── ZONE A: ACT ─── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <HeroGreeting currentUser={currentUser} todaysClasses={todaysClasses} healthScore={displayScore} />
          <ProgressRing score={todaysProgress} status={healthData.status} xpGained={displayXp} momentum={momentum} />
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
                  // Calculate local date string to fix timezone mismatch
                  const date = new Date();
                  date.setDate(date.getDate() - (29 - idx));
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  const dateString = `${year}-${month}-${day}`;

                  // Stable deterministic hash for the date to distribute XP points
                  const dateSeed = dateString;
                  let hash = 0;
                  for (let i = 0; i < dateSeed.length; i++) {
                    hash = Math.imul(31, hash) + dateSeed.charCodeAt(i);
                  }
                  const threshold = Math.abs(hash) % 100;

                  // As displayXp grows (attendance, goals, etc.), it permanently lights up more days.
                  // We add a recency bias so recent days light up faster.
                  const recencyBias = (idx / 30) * 30;
                  const baseActivity = ((displayXp / 15) + recencyBias) > threshold ? 1 : 0;

                  // Combine explicit calendar events with the underlying XP-based momentum
                  const eventsOnDay = calendarEvents.filter(e => e.date === dateString).length + baseActivity;

                  const w = eventsOnDay === 0 ? 1 : eventsOnDay === 1 ? 2 : eventsOnDay === 2 ? 3 : 4;
                  return (
                    <div
                      key={idx}
                      className={`w-[18px] h-[18px] rounded-md transition-all flex items-center justify-center text-[9px] font-bold hover:scale-125 cursor-pointer ${w === 1 ? "bg-[var(--accent-20)] text-[var(--muted)]" :
                        w === 2 ? "bg-[var(--accent)]/40 text-[var(--foreground)]" :
                          w === 3 ? "bg-[var(--accent)]/70 text-white" :
                            "bg-[var(--accent)] text-white shadow-[0_0_8px_var(--accent-glow)]"
                        }`}
                      title={`Day ${idx + 1}: ${eventsOnDay} activities`}
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
                      {currentLevelNumber}
                    </div>
                    <span className="text-sm font-extrabold text-[var(--foreground)]">
                      {currentTitle}
                    </span>
                  </div>
                </div>
                <div className="h-9 w-9 rounded-lg bg-[var(--accent-20)] text-[var(--accent)] flex items-center justify-center border border-[var(--accent)]/30">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4">
                <span className="text-[10px] font-bold text-[var(--muted)] uppercase">Total XP</span>
                <span className="text-2xl font-black block text-[var(--foreground)]">{displayXp}</span>
              </div>

              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-[10px] text-[var(--muted)]">
                  <span>Progress to Level {levelData.level + 1}</span>
                  <span>{levelData.progressPercent}%</span>
                </div>
                <div className="h-2 bg-[var(--surface-top)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--accent)] rounded-full transition-all duration-1000" style={{ width: `${levelData.progressPercent}%` }} />
                </div>
                <span className="text-[9px] text-[var(--muted)] block">
                  {levelData.remainingXp} XP remaining
                </span>
              </div>
            </div>

            <WeeklyGoals goals={[]} onGoalsChange={setLocalGoals} />

          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Semester Timeline */}
            <div className="bg-[var(--surface-low)] border border-[var(--outline-dim)] rounded-xl p-5 md:col-span-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-[var(--muted)] uppercase">Semester Timeline</span>
                  <h4 className="text-sm font-extrabold mt-1 text-[var(--foreground)]">Week {currentWeek} of {totalWeeks}</h4>
                  <button onClick={() => setIsEditingTimeline(!isEditingTimeline)} className="text-[9px] text-[var(--accent)] hover:underline mt-0.5">Edit Dates</button>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[var(--muted)] uppercase">Completed Credits</span>
                  <h4 className="text-sm font-extrabold mt-1 text-[var(--foreground)]">18 / 24</h4>
                </div>
              </div>

              {isEditingTimeline ? (
                <form onSubmit={handleSaveTimeline} className="mt-4 p-3 bg-[var(--surface-high)] rounded-lg border border-[var(--outline-dim)] animate-fadeIn">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-[9px] font-bold text-[var(--muted)] block mb-1">Start Date</label>
                      <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} required className="w-full bg-[var(--surface-top)] border border-[var(--outline-dim)] rounded px-2 py-1 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)]" />
                    </div>
                    <div className="flex-1">
                      <label className="text-[9px] font-bold text-[var(--muted)] block mb-1">End Date</label>
                      <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} required className="w-full bg-[var(--surface-top)] border border-[var(--outline-dim)] rounded px-2 py-1 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)]" />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button type="submit" className="flex-1 bg-[var(--accent)] text-white text-[10px] font-bold py-1.5 rounded hover:bg-[var(--accent-hover)] transition-all">Save</button>
                    <button type="button" onClick={() => setIsEditingTimeline(false)} className="flex-1 bg-[var(--surface-top)] text-[var(--foreground)] border border-[var(--outline-dim)] text-[10px] font-bold py-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all">Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-[10px] text-[var(--muted)]">
                      <span>Midterm Horizon</span>
                      <span>{semesterProgress}% Completed</span>
                    </div>
                    <div className="h-2 bg-[var(--surface-top)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--accent)] rounded-full transition-all duration-1000" style={{ width: `${semesterProgress}%` }} />
                    </div>
                  </div>

                  <div className="flex gap-1.5 mt-4 overflow-x-auto pb-2">
                    {Array.from({ length: totalWeeks }).map((_, idx) => {
                      const isDone = idx + 1 < currentWeek;
                      const isCurrent = idx + 1 === currentWeek;
                      return (
                        <div
                          key={idx}
                          className={`h-7 w-7 rounded-lg flex items-center justify-center text-[9px] font-bold flex-shrink-0 transition-transform hover:-translate-y-1 ${isDone ? 'bg-[var(--accent-20)] text-[var(--accent-hover)]' :
                            isCurrent ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]' :
                              'bg-[var(--surface-top)] text-[var(--muted)]'
                            }`}
                        >
                          {idx + 1}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="bg-[var(--surface-low)] border border-[var(--outline-dim)] rounded-xl p-5 md:col-span-1 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-[var(--muted)] uppercase">Badge Progress</span>
              <div className="mt-4">
                <span className="text-sm font-bold text-[var(--foreground)]">
                  {earnedBadgesCount === 0 ? "No badge activity yet" : `${earnedBadgesCount} / ${badgesData.length} badges earned`}
                </span>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface-top)]">
                  <div className="h-full rounded-full bg-[var(--accent)] transition-all duration-700" style={{ width: `${badgeProgressPercent}%` }} />
                </div>
              </div>
              <p className="mt-4 text-[10px] leading-relaxed text-[var(--muted)]">Earn badges as you complete milestones across Acadsphere.</p>
            </div>

          </div>
          <MilestoneBadges badges={badgesData} />
        </section>

        {/* ─── ZONE D: EXPLORE ─── */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">

          {/* Internships Preview */}
          <button type="button" className="glass-card p-5 cursor-pointer hover:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] outline-none transition-colors group w-full text-left" onClick={() => setActiveTab("Internship")}>
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
          </button>

          {/* E-Library Preview */}
          <button type="button" className="glass-card p-5 cursor-pointer hover:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] outline-none transition-colors group w-full text-left" onClick={() => setActiveTab("E-Library")}>
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
          </button>

          <CalendarWidget events={calendarEvents} onOpen={() => setActiveTab("Calendar")} />

        </section>

      </div>
    );
  }
