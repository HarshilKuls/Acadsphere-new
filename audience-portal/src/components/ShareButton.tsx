"use client";

import React, { useState, useEffect, useRef } from "react";
import { Share2, Link as LinkIcon, Mail, MessageCircle, Send } from "lucide-react";

export default function ShareButton({ url, title, text }: { url?: string; title?: string; text?: string }) {
  const [showPopover, setShowPopover] = useState(false);
  const [copied, setCopied] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const defaultShareText = `Hello everyone!!

The time of your multiple organizers is finally over, cause Acadsphere is live for your use.
We bring your reminders, events, internships, cgpa and attendance calculators in one place.

Say bye to academic chaos and hello to your organised self with Acadsphere, college ka organizer system ;)
Join today- https://www.acadsphere.in
Follow our insta for more updates- https://www.instagram.com/acadsphere?igsh=N3Rod21iaWVpdTdl`;

  const finalTitle = title || "Acadsphere";
  const finalText = text || defaultShareText;
  
  // Default to window.location.href if in browser and no URL provided
  const finalUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowPopover(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: finalTitle,
          text: finalText,
          url: finalUrl,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          // If native share fails (e.g. on some desktop browsers), fallback to popover
          setShowPopover(!showPopover);
        }
      }
    } else {
      setShowPopover(!showPopover);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(finalUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowPopover(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const encodedUrl = encodeURIComponent(finalUrl);
  const encodedText = encodeURIComponent(finalText);
  const encodedTitle = encodeURIComponent(finalTitle);

  const shareOptions = [
    {
      name: copied ? "Copied!" : "Copy Link",
      icon: LinkIcon,
      onClick: copyLink,
      color: "text-zinc-400 hover:text-white",
      bg: "hover:bg-zinc-800"
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
      color: "text-emerald-500 hover:text-emerald-400",
      bg: "hover:bg-emerald-500/10"
    },
    {
      name: "Telegram",
      icon: Send,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      color: "text-sky-500 hover:text-sky-400",
      bg: "hover:bg-sky-500/10"
    },
    {
      name: "X / Twitter",
      icon: (props: any) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      color: "text-zinc-300 hover:text-white",
      bg: "hover:bg-zinc-800"
    },
    {
      name: "Facebook",
      icon: (props: any) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
        </svg>
      ),
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "text-blue-500 hover:text-blue-400",
      bg: "hover:bg-blue-500/10"
    },
    {
      name: "Email",
      icon: Mail,
      href: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
      color: "text-zinc-400 hover:text-white",
      bg: "hover:bg-zinc-800"
    }
  ];

  return (
    <div className="relative flex items-center" ref={popoverRef}>
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl bg-[#06B6D4]/10 text-[#06B6D4] dark:bg-[#06B6D4]/10 dark:text-[#06B6D4] hover:bg-[#06B6D4]/20 transition-all shrink-0 active:scale-95"
        aria-label="Share this"
        title="Share this"
      >
        <Share2 className="w-4 h-4 shrink-0" />
        <span>Share</span>
      </button>
      
      {showPopover && (
        <div className="absolute top-full right-0 mt-3 p-2 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col gap-1">
            {shareOptions.map((option, idx) => {
              const Icon = option.icon;
              if (option.onClick) {
                return (
                  <button
                    key={idx}
                    onClick={option.onClick}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${option.color} ${option.bg} text-left`}
                  >
                    <Icon className="w-4 h-4" />
                    {option.name}
                  </button>
                );
              }
              return (
                <a
                  key={idx}
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowPopover(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${option.color} ${option.bg}`}
                >
                  <Icon className="w-4 h-4" />
                  {option.name}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
