import React from 'react';
import { MailCheck, RefreshCw, Zap, CheckCircle2 } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    icon: MailCheck,
    title: 'Connect your college email',
    desc: 'Verify with your institution address. We match your campus, course and year to pre-calibrate your syllabus and grading framework.'
  },
  {
    num: '02',
    icon: RefreshCw,
    title: 'LET AI HANDLE THE SETUP.',
    desc: (
      <>
        Use our built-in AI upload features to add your timetable, attendance data and internal assignment details without entering everything manually each time. Upload your existing information and let Acadsphere organize it for you.
        <br /><br />
        (In the future, we can explore fetching this information directly from your college, where supported and with your request.)
      </>
    )
  },
  {
    num: '03',
    icon: Zap,
    title: 'YOU\'RE READY TO GO.',
    desc: "Once your academic information is organized, you're ready to manage your semester in just a few simple steps. Acadsphere takes care of the academic organization so you can focus on getting things done."
  }
];

export default function HowItWorksSection() {
  return (
    <section id="how" className="relative py-24 lg:py-32 border-y border-white/10 bg-[#0E1013]/90 text-zinc-100 overflow-hidden">
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(1100px 400px at 50% 100%, rgba(140, 140, 249, 0.16), transparent 70%)'
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-zinc-300 font-mono text-xs font-semibold uppercase tracking-wider mb-4">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero Friction Onboarding</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-['Space_Grotesk'] leading-tight">
            Set up once.<br className="hidden sm:inline" />
            <span className="text-[#8C8CF9]"> It runs after that.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 font-['Hanken_Grotesk']">
            About two minutes, then it works autonomously in the background.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md overflow-hidden divide-y md:divide-y-0 md:divide-x divide-white/10 shadow-2xl">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="p-8 lg:p-10 flex flex-col justify-between group hover:bg-[#8C8CF9]/[0.03] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-base font-bold text-[#A5A5FB]">{step.num}</span>
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 text-[#8C8CF9] flex items-center justify-center group-hover:scale-110 group-hover:border-[#8C8CF9]/40 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold text-white font-['Space_Grotesk'] tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm text-zinc-400 font-['Hanken_Grotesk'] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
