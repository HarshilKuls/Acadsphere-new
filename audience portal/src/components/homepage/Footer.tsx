import React from 'react';

export default function Footer() {
  const adminPortalUrl = process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || 'http://localhost:3001';

  return (
    <footer className="bg-zinc-100/50 dark:bg-[#14121b]/40 border-t border-zinc-200 dark:border-zinc-800/40 w-full py-6 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center px-gutter max-w-container-max mx-auto gap-4">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-headline-md text-base font-bold text-zinc-850 dark:text-zinc-100">AcadSphere Community</span>
          <p className="font-label-md text-xs text-zinc-500 dark:text-zinc-450 text-center md:text-left font-semibold">© 2024 AcadSphere. Developed for the academic community.</p>
        </div>
        <div className="flex items-center gap-6 z-50">
          <a className="font-label-md text-xs font-semibold text-zinc-500 dark:text-zinc-450 hover:text-[#7C3AED] dark:hover:text-[#9c82ff] transition-colors" href="/privacy">Privacy Policy</a>
          <a className="font-label-md text-xs font-semibold text-zinc-500 dark:text-zinc-450 hover:text-[#06B6D4] dark:hover:text-[#22d3ee] transition-colors relative z-50 cursor-pointer" href={process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || "http://localhost:3001"}>Admin Portal</a>
        </div>
      </div>
    </footer>
  );
}
