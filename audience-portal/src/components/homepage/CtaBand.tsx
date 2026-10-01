import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';

interface CtaBandProps {
  onGetStarted: () => void;
  onContinueAsGuest: () => void;
}

export default function CtaBand({ onGetStarted, onContinueAsGuest }: CtaBandProps) {
  return (
    <section className="relative py-20 lg:py-28 bg-[#05040A] text-zinc-100 overflow-hidden z-10">
      {/* Background glow wash */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(800px 360px at 50% 50%, rgba(124, 60, 255, 0.22), transparent 70%)'
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[0.04em] uppercase font-['Space_Grotesk'] text-white leading-tight">
          Your academic life, <br className="hidden sm:inline" />
          <span className="text-[#965CFF] font-semibold drop-shadow-[0_0_25px_rgba(150,92,255,0.5)]">
            one panel.
          </span>
        </h2>

        <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-md mx-auto font-['Hanken_Grotesk'] leading-relaxed">
          Stop refreshing five portals. Let the changes come to you in real-time, ranked by urgency.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2.5 h-11 px-6 rounded-lg bg-gradient-to-r from-[#7C3CFF] to-[#965CFF] hover:from-[#8B4DFF] hover:to-[#A56CFF] text-white font-semibold text-xs tracking-wider uppercase shadow-[0_8px_25px_-6px_rgba(124,60,255,0.6)] transition-all cursor-pointer"
          >
            <span>Get started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onContinueAsGuest}
            className="inline-flex items-center gap-2 h-11 px-5 rounded-lg border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/30 text-white font-medium text-xs tracking-wider uppercase transition-all cursor-pointer backdrop-blur-sm"
          >
            <Compass className="w-3.5 h-3.5 text-[#B08CFF]" />
            <span>Explore as Guest</span>
          </button>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-lg border border-transparent hover:border-white/10 hover:bg-white/[0.02] text-zinc-400 hover:text-white font-medium text-xs tracking-wider uppercase transition-all"
          >
            Read the blog
          </Link>
        </div>
      </div>
    </section>
  );
}
