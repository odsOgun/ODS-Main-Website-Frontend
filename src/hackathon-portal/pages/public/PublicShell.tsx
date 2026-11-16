import type { ReactNode } from 'react';
import { GridPattern, OdsLogo } from '../../components/brand';

/** Layout for the participant-facing RSVP and ticket pages, styled like the ODS site (nav bar + dark grid band). */
export default function PublicShell({ children, eventName }: { children?: ReactNode; eventName?: string }) {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <nav className="no-print flex h-[54px] items-center justify-center border-b border-[#EAECF0] bg-white md:h-16">
        <div className="flex w-full max-w-[1120px] items-center justify-between px-4">
          <a href="/" className="flex items-center gap-3">
            <OdsLogo />
            <span className="text-sm font-semibold tracking-[0.2px] text-[#627587]">Ogun Digital Summit</span>
          </a>
          <a href="/hackathon" className="hidden text-sm font-semibold tracking-[0.2px] text-[#627587] hover:text-[#101828] sm:block">
            Hackathon
          </a>
        </div>
      </nav>
      <div className="no-print relative h-56 overflow-hidden bg-[#101612]">
        <GridPattern />
        <div className="relative z-10 mx-auto max-w-lg px-4 pt-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#99DBB9]">Ogun Digital Summit 2026</p>
          <p className="platypi-gf mt-1 text-2xl font-bold text-white">{eventName || 'Ogun Innovate Hackathon'}</p>
        </div>
      </div>
      <div className="relative z-10 mx-auto -mt-24 max-w-lg px-4 pb-12 print:mt-0">
        {children}
        <p className="no-print mt-6 text-center text-xs text-[#667085]">This page is personal to you. Please don't share your link.</p>
      </div>
    </div>
  );
}
