import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const adminPortalUrl = process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || 'https://acadsphere-adminportal.vercel.app/';

  return (
    <footer className="relative border-t border-white/10 bg-[#07080B] text-zinc-400 py-16 font-['Hanken_Grotesk'] text-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-10">
          {/* Col 1: Brand & Lede */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image 
                src="/Acadshpere%20website%20logo.png" 
                alt="AcadSphere Logo" 
                width={36} 
                height={36} 
                className="h-9 w-9 object-contain"
              />
              <div>
                <span className="font-['Space_Grotesk'] text-lg font-bold text-white tracking-tight">
                  AcadSphere
                </span>
                <div className="text-[9.5px] font-mono text-[#8C8CF9] tracking-[0.18em] -mt-0.5">
                  STUDENT OS
                </div>
              </div>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Your academic command center. Every signal from campus — timetables, attendance margins, and marks — routed to one panel.
            </p>
          </div>

          {/* Col 2: Product */}
          <div>
            <h5 className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-4">
              Product
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#feed" className="hover:text-white transition-colors">Overview</a>
              </li>
              <li>
                <a href="#modules" className="hover:text-white transition-colors">Modules Suite</a>
              </li>
              <li>
                <a href="#how" className="hover:text-white transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#auth" className="hover:text-white transition-colors">Sign In</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h5 className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-4">
              Services
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/attendance-prediction" className="hover:text-white transition-colors">Attendance Prediction</Link>
              </li>
              <li>
                <Link href="/cgpa-calculator" className="hover:text-white transition-colors">CGPA & Marks Prediction</Link>
              </li>
              <li>
                <Link href="/marks-predictor" className="hover:text-white transition-colors">Marks Predictor</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div>
            <h5 className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-4">
              Resources
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">Blog & Updates</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Support & Contact</Link>
              </li>
            </ul>
          </div>

          {/* Socials / Connect */}
          <div>
            <h5 className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-4">
              Connect
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="https://www.instagram.com/acadsphere?stkn=MWpmM2F2OGNoem51Yg==" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-pink-500">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/acadsphere-in/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-blue-500">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal & Admin */}
          <div>
            <h5 className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-4">
              Governance
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </li>
              <li>
                <a 
                  href={adminPortalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#8C8CF9] hover:text-[#A5A5FB] font-semibold transition-colors inline-flex items-center gap-1"
                >
                  <span>Admin Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Base Bar */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            &copy; 2026 AcadSphere. Built for university ecosystems.
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="text-zinc-400">India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
