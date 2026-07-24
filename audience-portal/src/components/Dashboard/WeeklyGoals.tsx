"use client";

import React, { useState, useEffect } from "react";
import { Check, Flag, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface WeeklyGoal {
  id: string;
  title: string;
  category: string;
  progress: number;
  complete?: boolean;
}

export default function WeeklyGoals({ goals: initialGoals }: { goals: WeeklyGoal[] }) {
  const [goals, setGoals] = useState<WeeklyGoal[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("acadsphere_weekly_goals");
    if (saved) {
      setGoals(JSON.parse(saved));
    } else {
      setGoals(initialGoals || []);
    }
  }, [initialGoals]);

  const saveGoals = (newGoals: WeeklyGoal[]) => {
    setGoals(newGoals);
    localStorage.setItem("acadsphere_weekly_goals", JSON.stringify(newGoals));
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    const newGoal: WeeklyGoal = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      category: "Personal",
      progress: 0,
      complete: false
    };
    
    saveGoals([...goals, newGoal]);
    setNewTitle("");
    setIsAdding(false);
  };

  const toggleComplete = (id: string) => {
    const updated = goals.map(g => {
      if (g.id === id) {
        return { ...g, complete: !g.complete, progress: !g.complete ? 100 : 0 };
      }
      return g;
    });
    saveGoals(updated);
  };

  const deleteGoal = (id: string) => {
    saveGoals(goals.filter(g => g.id !== id));
  };

  const completeCount = goals.filter((goal) => goal.complete).length;
  const completion = goals.length ? Math.round((completeCount / goals.length) * 100) : 0;

  return (
    <section className="bg-[var(--surface-low)] border border-[var(--outline-dim)] rounded-xl p-5 md:col-span-2 flex flex-col min-h-[220px]" aria-labelledby="weekly-goals-heading">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase">Weekly Goals</span>
            <span className="flex items-center gap-1 rounded-full bg-[var(--accent-20)] px-2 py-0.5 text-[9px] font-bold text-[var(--accent-hover)]">
              <Flag className="h-3 w-3" /> {completion}%
            </span>
          </div>
          <h3 id="weekly-goals-heading" className="mt-1 text-sm font-extrabold text-[var(--foreground)]">{completeCount}/{goals.length} completed</h3>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="p-1.5 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-all shadow-md active:scale-95"
          aria-label={isAdding ? "Close Add Form" : "Add Weekly Goal"}
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--surface-top)]">
        <div className="h-full rounded-full bg-[var(--accent)] transition-all duration-700" style={{ width: `${completion}%` }} />
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
            onSubmit={handleAddGoal}
          >
            <div className="flex gap-2 items-center">
              <input 
                autoFocus
                type="text" 
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="E.g., Complete OS Assignment" 
                className="flex-1 bg-[var(--surface-top)] border border-[var(--outline-dim)] rounded-lg px-3 py-2 text-xs text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all"
              />
              <button 
                type="submit" 
                disabled={!newTitle.trim()}
                className="bg-[var(--accent)] text-white font-bold text-[10px] px-3 py-2 rounded-lg uppercase disabled:opacity-50 transition-all hover:bg-[var(--accent-hover)]"
              >
                Add
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto mt-3">
        {goals.length === 0 && !isAdding ? (
          <p className="py-8 text-center text-[11px] font-medium text-[var(--muted)]">No weekly goals yet.</p>
        ) : (
          <ul className="divide-y divide-[var(--outline-dim)]">
            {goals.map((goal) => (
              <li key={goal.id} className="flex items-center gap-3 py-2.5 first:pt-0 group">
                <button 
                  onClick={() => toggleComplete(goal.id)}
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-all ${goal.complete ? "bg-emerald-500 text-white" : "bg-[var(--accent-20)] text-[var(--accent-hover)] hover:bg-[var(--accent)] hover:text-white"}`}
                  aria-label="Toggle Complete"
                >
                  {goal.complete ? <Check className="h-3.5 w-3.5" /> : `${goal.progress}%`}
                </button>
                <div className="min-w-0 flex-1 cursor-pointer" onClick={() => toggleComplete(goal.id)}>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`truncate text-[11px] font-bold transition-colors ${goal.complete ? "text-[var(--muted)] line-through opacity-70" : "text-[var(--foreground)]"}`}>{goal.title}</span>
                    <span className="rounded-full bg-[var(--surface-top)] px-2 py-0.5 text-[8px] font-bold text-[var(--muted)]">{goal.category}</span>
                  </div>
                  {!goal.complete && (
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-[var(--surface-top)]">
                      <div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${goal.progress}%` }} />
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => deleteGoal(goal.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-[var(--muted)] hover:text-red-500 transition-all rounded hover:bg-[var(--surface-top)]"
                  aria-label="Delete Goal"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
