import { Check, Flag } from "lucide-react";

export interface WeeklyGoal {
  id: string;
  title: string;
  category: string;
  progress: number;
  complete?: boolean;
}

export default function WeeklyGoals({ goals }: { goals: WeeklyGoal[] }) {
  const completeCount = goals.filter((goal) => goal.complete).length;
  const completion = goals.length ? Math.round((completeCount / goals.length) * 100) : 0;

  return (
    <section className="bg-[var(--surface-low)] border border-[var(--outline-dim)] rounded-xl p-5 md:col-span-2" aria-labelledby="weekly-goals-heading">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase">Weekly Goals</span>
            <span className="flex items-center gap-1 rounded-full bg-[var(--accent-20)] px-2 py-0.5 text-[9px] font-bold text-[var(--accent-hover)]"><Flag className="h-3 w-3" /> {completion}%</span>
          </div>
          <h3 id="weekly-goals-heading" className="mt-1 text-sm font-extrabold text-[var(--foreground)]">{completeCount}/{goals.length} completed</h3>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--surface-top)]">
        <div className="h-full rounded-full bg-[var(--accent)] transition-all duration-700" style={{ width: `${completion}%` }} />
      </div>
      {goals.length === 0 ? <p className="py-8 text-center text-[11px] font-medium text-[var(--muted)]">No weekly goals yet.</p> : <ul className="mt-3 divide-y divide-[var(--outline-dim)]">
        {goals.map((goal) => (
          <li key={goal.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${goal.complete ? "bg-emerald-500 text-white" : "bg-[var(--accent-20)] text-[var(--accent-hover)]"}`}>
              {goal.complete ? <Check className="h-3.5 w-3.5" /> : `${goal.progress}%`}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className={`truncate text-[11px] font-bold ${goal.complete ? "text-[var(--muted)] line-through" : "text-[var(--foreground)]"}`}>{goal.title}</span>
                <span className="rounded-full bg-[var(--surface-top)] px-2 py-0.5 text-[8px] font-bold text-[var(--muted)]">{goal.category}</span>
              </div>
              {!goal.complete && <div className="mt-1 h-1 overflow-hidden rounded-full bg-[var(--surface-top)]"><div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${goal.progress}%` }} /></div>}
            </div>
          </li>
        ))}
      </ul>}
    </section>
  );
}
