"use client";

import React, { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      setShowInstructions(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 hover:bg-blue-600/20 dark:hover:bg-blue-500/30 transition-colors shrink-0"
        aria-label="Install App"
        title="Install Acadsphere as a mobile/desktop app"
      >
        <Download className="w-4 h-4 shrink-0" />
        <span className="hidden sm:inline">Install</span>
      </button>

      {showInstructions && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-[#14121b] border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl">
            <button onClick={() => setShowInstructions(false)} className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
              <X className="w-5 h-5" />
            </button>
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-500 mb-4">
              <Download className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">Install Acadsphere</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              Your browser doesn't support automatic installation. You can still install Acadsphere manually:
            </p>
            <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-3 list-disc pl-5">
              <li><strong>iOS (Safari):</strong> Tap the <strong>Share</strong> button at the bottom of Safari, then scroll down and tap <strong>Add to Home Screen</strong>.</li>
              <li><strong>Android / Chrome:</strong> Tap the <strong>Menu</strong> (three dots) at the top right, then tap <strong>Install app</strong> or <strong>Add to Home Screen</strong>.</li>
            </ul>
            <button onClick={() => setShowInstructions(false)} className="mt-6 w-full py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg font-bold text-sm transition-colors">Got it</button>
          </div>
        </div>
      )}
    </>
  );
}
