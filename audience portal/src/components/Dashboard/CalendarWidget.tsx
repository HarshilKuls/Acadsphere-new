"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CalendarEvent } from "@/lib/db";

interface CalendarWidgetProps {
  events: CalendarEvent[];
  onOpen: () => void;
}

const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function dayKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function CalendarWidget({ events, onOpen }: CalendarWidgetProps) {
  const today = new Date();
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const firstVisibleDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1 - visibleMonth.getDay());
  const eventDays = new Set(events.map((event) => event.date));
  const calendarDays = Array.from({ length: 35 }, (_, index) => {
    const date = new Date(firstVisibleDay);
    date.setDate(firstVisibleDay.getDate() + index);
    return date;
  });
  const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(visibleMonth);
  const changeMonth = (offset: number) => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() + offset, 1));

  return (
    <section className="group glass-card p-5 transition-colors" aria-labelledby="calendar-heading">
      <div className="flex items-center justify-between">
        <h3 id="calendar-heading" className="text-sm font-extrabold text-[var(--foreground)]">Calendar</h3>
        <button type="button" onClick={onOpen} aria-label="Open calendar" className="rounded-lg p-1 text-[var(--accent)] transition-all group-hover:translate-x-1 hover:bg-[var(--accent-20)]">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-extrabold text-[var(--foreground)]">{monthLabel}</span>
        <div className="flex items-center gap-1 text-[var(--muted)]">
          <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month" className="rounded p-0.5 transition-colors hover:bg-[var(--surface-top)]"><ChevronLeft className="h-3.5 w-3.5" /></button>
          <button type="button" onClick={() => changeMonth(1)} aria-label="Next month" className="rounded p-0.5 transition-colors hover:bg-[var(--surface-top)]"><ChevronRight className="h-3.5 w-3.5" /></button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-y-1 text-center">
        {weekdays.map((day) => <span key={day} className="text-[8px] font-bold uppercase text-[var(--muted)]">{day}</span>)}
        {calendarDays.map((date) => {
          const isCurrentMonth = date.getMonth() === visibleMonth.getMonth();
          const isToday = dayKey(date) === dayKey(today);
          const hasEvent = eventDays.has(dayKey(date));
          return (
            <span key={dayKey(date)} className={`relative mx-auto flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold transition-transform ${
              isToday ? "bg-[var(--accent)] text-white shadow-[0_3px_10px_var(--accent-glow)]" :
              isCurrentMonth ? "text-[var(--foreground)] hover:bg-[var(--accent-20)]" : "text-[var(--muted)] opacity-35"
            }`}>
              {date.getDate()}
              {hasEvent && !isToday && <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-[var(--accent-hover)]" aria-label="Event scheduled" />}
            </span>
          );
        })}
      </div>
      <p className="mt-3 text-[9px] font-medium text-[var(--muted)]">{events.length ? `${events.length} upcoming item${events.length === 1 ? "" : "s"} marked this month` : "Your scheduled events will appear here"}</p>
    </section>
  );
}
