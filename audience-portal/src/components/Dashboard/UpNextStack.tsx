import React from "react";
import { TimetableEntry, HackathonEvent } from "@/lib/db";
import { Calendar, ChevronRight } from "lucide-react";

interface UpNextStackProps {
  nextClass: TimetableEntry | null | undefined;
  eventsFeed: HackathonEvent[];
  onViewEvents: () => void;
}

export default function UpNextStack({ nextClass, eventsFeed, onViewEvents }: UpNextStackProps) {
  return (
    <div className="lg:col-span-4 space-y-4">
      {/* Up Next Card */}
      <div className="glass-card p-5 border-[#06B6D4]/30 bg-[#06B6D4]/5">
        <h3 className="text-xs font-bold text-[#06B6D4] uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#06B6D4] shadow-[0_0_8px_#06B6D4]" />
          Up Next
        </h3>
        {nextClass ? (
          <div>
            <span className="text-[10px] font-bold text-[var(--muted)]">{nextClass.startTime} in {nextClass.room}</span>
            <span className="block text-lg font-extrabold mt-1 text-[var(--foreground)]">{nextClass.subject}</span>
            <span className="text-xs text-[var(--muted)] mt-1 block">{nextClass.faculty}</span>
          </div>
        ) : (
          <div className="text-sm text-[var(--muted)] font-semibold py-2">
            No more classes today!
          </div>
        )}
      </div>

      {/* Featured Event */}
      {eventsFeed.length > 0 && (
        <div className="glass-card p-5">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Featured Event
            </h3>
            <span className="text-[9px] bg-[var(--accent)] text-white px-2 py-0.5 rounded-full font-bold">NEW</span>
          </div>
          <span className="block text-sm font-extrabold text-[var(--foreground)] truncate">{eventsFeed[0].title}</span>
          <span className="text-[10px] text-[var(--muted)] mt-1 block truncate">{eventsFeed[0].organizer}</span>
          
          <button type="button" onClick={onViewEvents} className="mt-4 w-full py-2 bg-[var(--surface-top)] hover:bg-[var(--accent-20)] hover:text-[var(--accent-hover)] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1">
            View Details <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
