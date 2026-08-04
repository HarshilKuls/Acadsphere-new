import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-[var(--muted)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
        <p className="text-sm font-medium animate-pulse">Loading Terms of Service...</p>
      </div>
    </div>
  );
}
