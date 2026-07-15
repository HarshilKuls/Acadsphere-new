"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Lock, Trophy } from "lucide-react";

export type BadgeRarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

export interface MilestoneBadge {
  id: string;
  name: string;
  description: string;
  requirement: string;
  rarity: BadgeRarity;
  earned: boolean;
  icon: LucideIcon;
}

const rarityStyles: Record<BadgeRarity, { dot: string; text: string; badge: string }> = {
  Common: { dot: "bg-slate-400", text: "text-slate-400", badge: "bg-slate-400/10" },
  Uncommon: { dot: "bg-emerald-400", text: "text-emerald-500", badge: "bg-emerald-500/10" },
  Rare: { dot: "bg-sky-400", text: "text-sky-500", badge: "bg-sky-500/10" },
  Epic: { dot: "bg-violet-400", text: "text-violet-400", badge: "bg-violet-500/10" },
  Legendary: { dot: "bg-amber-400", text: "text-amber-500", badge: "bg-amber-500/10" },
};

function BadgeCard({ badge }: { badge: MilestoneBadge }) {
  const Icon = badge.icon;
  const rarity = rarityStyles[badge.rarity];

  return (
    <article
      className={`group relative overflow-hidden rounded-xl border p-4 transition-all duration-300 motion-reduce:transition-none ${
        badge.earned
          ? "border-[var(--accent-50)] bg-[linear-gradient(135deg,var(--accent-20),transparent_72%)] hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_10px_24px_var(--accent-glow)]"
          : "border-[var(--outline-dim)] bg-[var(--surface-low)]/70 opacity-70 hover:border-[var(--outline)] hover:opacity-90"
      }`}
    >
      {badge.earned && <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full bg-[var(--accent)]/10 blur-xl transition-transform duration-500 group-hover:scale-150" />}
      <div className="relative flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${badge.earned ? "border-[var(--accent)]/40 bg-[var(--accent)] text-white shadow-[0_5px_14px_var(--accent-glow)]" : "border-[var(--outline-dim)] bg-[var(--surface-top)] text-[var(--muted)]"}`}>
          {badge.earned ? <Icon className="h-5 w-5" aria-hidden="true" /> : <Lock className="h-4 w-4" aria-hidden="true" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-xs font-extrabold text-[var(--foreground)]">{badge.name}</h4>
            <span className={`mt-0.5 flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-bold ${rarity.badge} ${rarity.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${rarity.dot}`} /> {badge.rarity}
            </span>
          </div>
          <p className="mt-1 text-[10px] leading-relaxed text-[var(--muted)]">{badge.earned ? badge.description : badge.requirement}</p>
        </div>
      </div>
      <div className={`relative mt-3 border-t pt-2 text-[9px] font-semibold ${badge.earned ? "border-[var(--accent)]/15 text-[var(--accent-hover)]" : "border-[var(--outline-dim)] text-[var(--muted)]"}`}>
        {badge.earned ? "Earned milestone" : `To unlock: ${badge.requirement}`}
      </div>
    </article>
  );
}

export default function MilestoneBadges({ badges }: { badges: MilestoneBadge[] }) {
  const earned = badges.filter((badge) => badge.earned).length;
  const [showAll, setShowAll] = useState(false);
  const displayedBadges = showAll ? badges : badges.slice(0, 6);

  return (
    <section className="mt-4 rounded-xl border border-[var(--outline-dim)] bg-[var(--surface-low)] p-4 sm:p-5" aria-labelledby="milestone-badges-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--accent)]/35 bg-[var(--accent-20)] text-[var(--accent-hover)]">
            <Trophy className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 id="milestone-badges-heading" className="text-sm font-extrabold text-[var(--foreground)]">Milestone Badges</h3>
              <span className="rounded-full bg-[var(--accent-20)] px-2 py-0.5 text-[9px] font-bold text-[var(--accent-hover)]">{earned} earned</span>
            </div>
            <p className="mt-0.5 text-[10px] text-[var(--muted)]">Celebrate the habits that shape your academic story.</p>
          </div>
        </div>
        {badges.length > 6 && (
          <button type="button" onClick={() => setShowAll((value) => !value)} className="self-start text-xs font-bold text-[var(--accent-hover)] transition-opacity hover:opacity-70 sm:self-auto">
            {showAll ? "Show less" : "View collection"}
          </button>
        )}
      </div>

      {badges.length === 0 ? <p className="mt-6 rounded-xl border border-dashed border-[var(--outline-dim)] px-4 py-8 text-center text-[11px] font-medium text-[var(--muted)]">No badges have been issued yet.</p> : <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {displayedBadges.map((badge) => <BadgeCard key={badge.id} badge={badge} />)}
      </div>}
    </section>
  );
}
