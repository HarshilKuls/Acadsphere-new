import React from 'react';

export default function SignalRouterSection() {
  return (
    <section id="feed" className="relative py-12 lg:py-16 text-zinc-100 overflow-hidden z-10">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="rounded-2xl border border-[#8C8CF9]/25 bg-[#0E0A1A]/75 backdrop-blur-md p-8 lg:p-12 shadow-[0_20px_50px_-15px_rgba(5,4,10,0.9)] grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-8 lg:gap-12 items-center">
          {/* Left Column */}
          <div>
            <div className="font-mono text-xs tracking-[0.16em] text-[#B08CFF] uppercase mb-3">
              NOT A DASHBOARD.
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[0.06em] uppercase font-['Space_Grotesk'] leading-tight text-white">
              YOUR ACADEMIC LIFE. <span className="text-[#965CFF] font-semibold drop-shadow-[0_0_25px_rgba(150,92,255,0.4)]">ONE PANEL.</span>
            </h2>
            <p className="mt-4 text-sm text-zinc-400 font-['Hanken_Grotesk'] leading-relaxed max-w-md">
              Acadsphere brings your timetable, attendance, marks, deadlines, events and internships together in one organized academic workspace — so you spend less time managing college chaos and more time focusing on what matters.
            </p>
          </div>

          {/* Right Column: SVG Signal Routing Flow */}
          <div className="w-full h-[180px] flex items-center justify-center">
            <svg viewBox="0 0 480 180" className="w-full h-full overflow-visible" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="rtGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#8B4DFF" stopOpacity="0.3"/>
                </linearGradient>
                <linearGradient id="rtGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#8B4DFF" stopOpacity="0.3"/>
                </linearGradient>
                <linearGradient id="rtGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#8B4DFF" stopOpacity="0.3"/>
                </linearGradient>
                <linearGradient id="rtGrad4" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D946EF" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#8B4DFF" stopOpacity="0.3"/>
                </linearGradient>
                <linearGradient id="rtGrad5" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#8B4DFF" stopOpacity="0.3"/>
                </linearGradient>
                <radialGradient id="rtSphereGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1A1235"/>
                  <stop offset="70%" stopColor="#0B0718"/>
                  <stop offset="100%" stopColor="#7C3CFF" stopOpacity="0.4"/>
                </radialGradient>
                <radialGradient id="rtYouGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#8B4DFF"/>
                  <stop offset="100%" stopColor="#3A1C78"/>
                </radialGradient>
              </defs>

              {/* Input Nodes & Labels */}
              <g fontFamily="'JetBrains Mono', monospace" fontSize="8.5" fontWeight="500" letterSpacing="0.08em">
                {/* Attendance */}
                <circle cx="14" cy="24" r="3.5" fill="#3B82F6"/>
                <text x="24" y="27" fill="#CBD5E1">ATTENDANCE</text>
                <path d="M95 24 C 180 24, 210 80, 240 86" fill="none" stroke="url(#rtGrad1)" strokeWidth="1.2" strokeDasharray="2 3"/>

                {/* Marks */}
                <circle cx="14" cy="54" r="3.5" fill="#F59E0B"/>
                <text x="24" y="57" fill="#CBD5E1">MARKS</text>
                <path d="M60 54 C 160 54, 200 84, 240 88" fill="none" stroke="url(#rtGrad2)" strokeWidth="1.2"/>

                {/* Deadlines */}
                <circle cx="14" cy="84" r="3.5" fill="#EF4444"/>
                <text x="24" y="87" fill="#CBD5E1">DEADLINES</text>
                <path d="M80 84 L 240 90" fill="none" stroke="url(#rtGrad3)" strokeWidth="1.2"/>

                {/* Events */}
                <circle cx="14" cy="114" r="3.5" fill="#D946EF"/>
                <text x="24" y="117" fill="#CBD5E1">EVENTS</text>
                <path d="M65 114 C 160 114, 200 96, 240 92" fill="none" stroke="url(#rtGrad4)" strokeWidth="1.2"/>

                {/* Internships */}
                <circle cx="14" cy="144" r="3.5" fill="#8B5CF6"/>
                <text x="24" y="147" fill="#CBD5E1">INTERNSHIPS</text>
                <path d="M96 144 C 180 144, 210 100, 240 94" fill="none" stroke="url(#rtGrad5)" strokeWidth="1.2" strokeDasharray="2 3"/>
              </g>

              {/* Stream Particle Dots */}
              <circle cx="170" cy="38" r="1.5" fill="#3B82F6" opacity="0.8"/>
              <circle cx="150" cy="62" r="1.5" fill="#F59E0B" opacity="0.8"/>
              <circle cx="160" cy="85" r="1.8" fill="#EF4444" opacity="0.9"/>
              <circle cx="150" cy="110" r="1.5" fill="#D946EF" opacity="0.8"/>
              <circle cx="170" cy="136" r="1.5" fill="#8B5CF6" opacity="0.8"/>

              {/* Central Acadsphere Sphere */}
              <g transform="translate(290, 90)">
                <circle cx="0" cy="0" r="54" fill="none" stroke="#7C3CFF" strokeWidth="0.8" opacity="0.3" strokeDasharray="3 4"/>
                <circle cx="0" cy="0" r="48" fill="none" stroke="#965CFF" strokeWidth="1" opacity="0.5"/>
                <circle cx="0" cy="0" r="44" fill="url(#rtSphereGlow)"/>
                
                <text x="0" y="-3" textAnchor="middle" fontFamily="'Space Grotesk', sans-serif" fontWeight="600" fontSize="9.5" letterSpacing="0.16em" fill="#FFFFFF">ACADSPHERE</text>
                <text x="0" y="9" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="5.5" letterSpacing="0.22em" fill="#A5A5FB">L E A R N &nbsp; P L A N &nbsp; G R O W</text>
              </g>

              {/* Outgoing Funnel Particle Stream to YOU */}
              <path d="M336 86 C 365 86, 385 88, 416 90" fill="none" stroke="#965CFF" strokeWidth="1.8" opacity="0.7"/>
              <path d="M336 94 C 365 94, 385 92, 416 90" fill="none" stroke="#8B4DFF" strokeWidth="1.2" opacity="0.5"/>
              <path d="M336 78 C 365 82, 385 86, 416 90" fill="none" stroke="#B08CFF" strokeWidth="0.8" opacity="0.3" strokeDasharray="2 3"/>
              <path d="M336 102 C 365 98, 385 94, 416 90" fill="none" stroke="#B08CFF" strokeWidth="0.8" opacity="0.3" strokeDasharray="2 3"/>

              {/* Outgoing Particles */}
              <circle cx="360" cy="87" r="1.5" fill="#FFFFFF" opacity="0.9"/>
              <circle cx="380" cy="92" r="1.2" fill="#A5A5FB" opacity="0.8"/>
              <circle cx="395" cy="89" r="1.8" fill="#FFFFFF" opacity="0.9"/>

              {/* YOU Node */}
              <g transform="translate(426, 90)">
                <circle cx="0" cy="0" r="18" fill="none" stroke="#965CFF" strokeWidth="0.8" opacity="0.4" strokeDasharray="2 2"/>
                <circle cx="0" cy="0" r="13" fill="url(#rtYouGlow)"/>
                <circle cx="0" cy="0" r="13" fill="none" stroke="#B08CFF" strokeWidth="1"/>
                <text x="0" y="3" textAnchor="middle" fontFamily="'Space Grotesk', sans-serif" fontWeight="700" fontSize="7.5" letterSpacing="0.1em" fill="#FFFFFF">YOU</text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
