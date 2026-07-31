import React from 'react';
import Link from 'next/link';
import Image from "next/image";

export default function Navbar({ toggleTheme }: { toggleTheme: () => void }) {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#0A0910]/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/40">
      <div className="flex justify-between items-center px-gutter max-w-container-max mx-auto h-16">
        <div className="flex items-center gap-3">
          <Image alt="AcadSphere Logo" className="h-8 w-8 object-contain" src="/Acadshpere%20website%20logo.png" width={32} height={32}/>
          <span className="font-headline-md text-headline-md font-bold text-zinc-800 dark:text-zinc-100">
            Acad<span className="text-gradient-brand">Sphere</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link className="font-label-md text-label-md text-[#7C3AED] dark:text-[#9c82ff] font-bold transition-colors duration-200" href="/">Home</Link>
          <Link className="font-label-md text-label-md text-zinc-500 dark:text-zinc-400 hover:text-[#7C3AED] dark:hover:text-[#9c82ff] transition-colors duration-200" href="/privacy">Privacy</Link>
        </nav>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-850 transition-colors text-zinc-500 dark:text-zinc-400">
            <span className="material-symbols-outlined">dark_mode</span>
          </button>
          <a href="#auth" className="hidden md:block px-6 py-2 rounded-full btn-gradient text-white font-label-md">
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}
