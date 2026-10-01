"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Compass, Menu, X } from 'lucide-react';

interface NavbarProps {
  onGetStarted?: () => void;
  onContinueAsGuest?: () => void;
}

export default function Navbar({ onGetStarted, onContinueAsGuest }: NavbarProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToAuth = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onGetStarted) {
      onGetStarted();
    }
    const el = document.getElementById('auth');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('/#auth');
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#05040A]/90 backdrop-blur-md border-b border-white/[0.08] transition-colors">
      <div className="flex justify-between items-center px-3 sm:px-6 max-w-6xl mx-auto h-[64px] sm:h-[74px]">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-1.5 sm:gap-3 group shrink-0 min-w-0">
          <Image alt="AcadSphere Logo" className="h-7 w-7 sm:h-8 sm:w-8 object-contain shrink-0" src="/Acadshpere%20website%20logo.png" width={32} height={32}/>
          <div className="flex flex-col items-center sm:items-start min-w-0">
            <span className="font-['Space_Grotesk'] text-[13px] sm:text-[17px] font-semibold text-white tracking-[0.1em] sm:tracking-[0.16em] leading-tight whitespace-nowrap">
              ACADSPHERE
            </span>
            <span className="text-[6.5px] sm:text-[8.5px] font-mono text-zinc-500 tracking-[0.15em] sm:tracking-[0.28em] mt-0.5 whitespace-nowrap">
              L E A R N &nbsp; P L A N &nbsp; G R O W
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-[13px] font-['Hanken_Grotesk'] font-medium text-zinc-400">
          <Link href="/#feed" className="hover:text-white transition-colors">Overview</Link>
          <Link href="/#modules" className="hover:text-white transition-colors">Modules</Link>
          <Link href="/#how" className="hover:text-white transition-colors">How it works</Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {onContinueAsGuest && (
            <button
              onClick={onContinueAsGuest}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 bg-white/[0.03] text-zinc-300 hover:text-white text-xs font-medium transition-all cursor-pointer shrink-0"
            >
              <Compass className="w-3.5 h-3.5 text-[#965CFF]" />
              <span>Guest</span>
            </button>
          )}

          <a 
            href="#auth" 
            onClick={scrollToAuth}
            className="inline-flex items-center justify-center gap-1 sm:gap-1.5 h-[32px] sm:h-[38px] px-3 sm:px-5 rounded-full bg-[#7C3CFF]/20 hover:bg-[#7C3CFF] border border-[#7C3CFF] text-white font-semibold text-[11px] sm:text-xs shadow-[0_0_20px_-4px_rgba(140,77,255,0.4)] hover:shadow-[0_0_26px_rgba(140,77,255,0.6)] transition-all cursor-pointer shrink-0 whitespace-nowrap"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </a>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-1.5 sm:p-2 text-zinc-400 hover:text-white shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[64px] sm:top-[74px] left-0 w-full bg-[#05040A]/95 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl animate-in slide-in-from-top-2">
          <nav className="flex flex-col py-4 px-6 gap-4 text-sm font-['Hanken_Grotesk'] font-medium text-zinc-300">
            <Link href="/#feed" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-white transition-colors">Overview</Link>
            <Link href="/#modules" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-white transition-colors">Modules</Link>
            <Link href="/#how" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-white transition-colors">How it works</Link>
            {onContinueAsGuest && (
              <button
                onClick={(e) => {
                  onContinueAsGuest();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 py-2 text-zinc-300 hover:text-white transition-colors sm:hidden text-left"
              >
                <Compass className="w-4 h-4 text-[#965CFF]" />
                <span>Continue as Guest</span>
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
