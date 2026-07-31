import React from "react";
import { TimetableEntry } from "@/lib/db";
import { MapPin } from "lucide-react";

interface FlightPathProps {
  todaysClasses: TimetableEntry[];
  currentDayName: string;
}

export default function FlightPath({ todaysClasses, currentDayName }: FlightPathProps) {
  return (
    <div className="lg:col-span-8 glass-card p-4 sm:p-6">
      <div className="flex justify-between items-center gap-3 mb-4">
        <div className="min-w-0">
          <h3 className="text-sm font-extrabold tracking-tight text-[var(--foreground)]">Today&apos;s Flight Path</h3>
          <span className="text-[10px] text-[var(--muted)]">{currentDayName} Class Schedule</span>
        </div>
        <span className="text-[10px] font-bold bg-[var(--accent)]/10 text-[var(--accent-hover)] px-3 py-1 rounded-full border border-[var(--accent)]/20">
          {todaysClasses.length} slots
        </span>
      </div>

      {todaysClasses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {todaysClasses.map((item, idx) => {
            const isActive = idx === 0;
            return (
              <div 
                key={item.id} 
                className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                  isActive 
                    ? "bg-[var(--accent-20)] border-[var(--accent-50)]" 
                    : "bg-[var(--surface-top)] border-[var(--outline-dim)] hover:border-[var(--accent)]/30"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)]" />
                )}
                
                <div className="flex justify-between items-start gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 ${isActive ? "text-[var(--accent-hover)]" : "text-[var(--muted)]"}`}>
                    {item.startTime} — {item.endTime}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#1c1a24] text-[var(--muted)] uppercase tracking-wider border border-[var(--outline-dim)]">
                    {item.room}
                  </span>
                </div>
                <span className="text-sm font-extrabold block mb-1 truncate text-[var(--foreground)]">{item.subject}</span>
                <span className="text-[10px] text-[var(--muted)] font-semibold flex items-center gap-1 mt-2">
                  <MapPin className="w-3 h-3 text-[var(--accent-hover)]" />
                  {item.faculty}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 rounded-xl border border-dashed border-[var(--outline-dim)] bg-[var(--surface-low)]/50">
          <p className="text-xs text-[var(--muted)] font-semibold">No classes scheduled for today. Rest & recharge!</p>
        </div>
      )}
    </div>
  );
}
