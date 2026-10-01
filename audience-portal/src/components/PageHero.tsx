import React from 'react';

export default function PageHero({ title, children, compactMobile = false }: { title: string, children?: React.ReactNode, compactMobile?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden flex flex-col items-start justify-center ${compactMobile ? "p-4 min-h-[90px] aspect-[2.8/1]" : "p-5 min-h-[130px] aspect-[2/1]"} md:p-[22px] mb-8 rounded-xl md:min-h-[208px] sm:aspect-auto`}
      style={{
        background: 'radial-gradient(circle at 18% 18%, var(--violet-50), transparent 33%), linear-gradient(135deg, var(--violet-20), rgba(8, 8, 12, .92))',
        border: '1px solid var(--violet-50)'
      }}
    >
      <div className="absolute right-0 top-0 bottom-0 w-[65%] md:w-[60%] pointer-events-none overflow-hidden z-0">
        {/* Faint dark theme ring */}
        <div 
          className={`absolute right-[5%] md:right-[10%] top-1/2 -translate-y-1/2 ${compactMobile ? "w-[100px] h-[100px] border-[16px]" : "w-[140px] h-[140px] border-[20px]"} md:w-[240px] md:h-[240px] rounded-full md:border-[40px] mix-blend-screen`}
          style={{ borderColor: 'var(--violet)', opacity: 0.4 }}
        />

        {/* Horizontal flare line (thick and faint) */}
        <div 
          className="absolute right-0 top-1/2 -translate-y-1/2 w-full h-8 blur-md mix-blend-screen" 
          style={{ background: 'linear-gradient(to right, transparent, var(--violet-50), var(--violet))', opacity: 0.4 }}
        />

        {/* Horizontal flare line (thin and bright) */}
        <div 
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[90%] md:w-[80%] h-[2px] blur-[1px] mix-blend-screen" 
          style={{ background: 'linear-gradient(to right, transparent, var(--violet), var(--violet-bright))', opacity: 0.8 }}
        />
      </div>
      {children}
      <h3 className={`relative z-10 font-medium uppercase text-zinc-300 ${compactMobile ? "text-[8.5px] mb-0.5" : "text-[9px] mb-1"} md:text-[11px] md:mb-3`}>
        Acadsphere Hub
      </h3>

      <div className={`relative z-10 w-full h-auto flex items-start justify-start ${compactMobile ? "mt-0" : "mt-1"} md:mt-2`}>
        <span
          className={`text-white uppercase font-light leading-[1.1] ${compactMobile ? "text-[22px]" : "text-[26px]"} md:text-[39px]`}
          style={{ letterSpacing: '.03em' }}
        >
          {title}
        </span>
      </div>
    </div>
  );
}
