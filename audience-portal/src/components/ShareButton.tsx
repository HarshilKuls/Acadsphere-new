"use client";

import React, { useState } from "react";
import { Share2 } from "lucide-react";

export default function ShareButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  const shareText = `Hello everyone!!

The time of your multiple organizers is finally over, cause Acadsphere is live for your use.
We bring your reminders, events, internships, cgpa and attendance calculators in one place.

Say bye to academic chaos and hello to your organised self with Acadsphere, college ka organizer system ;)
Join today- https://www.acadsphere.in
Follow our insta for more updates- https://www.instagram.com/acadsphere?igsh=N3Rod21iaWVpdTdl`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Acadsphere",
          text: shareText,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
      }
    }
  };

  return (
    <div className="relative flex items-center">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 hover:bg-indigo-600/20 dark:hover:bg-indigo-500/30 transition-colors shrink-0"
        aria-label="Share Acadsphere"
        title="Share Acadsphere"
      >
        <Share2 className="w-4 h-4 shrink-0" />
        <span className="hidden sm:inline">Share</span>
      </button>
      
      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg whitespace-nowrap z-50">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
}
