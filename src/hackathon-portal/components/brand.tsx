/* ODS brand pieces shared by the portal's shells. They mirror src/pages/register/hackathon.tsx and src/components/local/nav.tsx. */
import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import ODSMark from '@/assets/svgs/nav/ODSLogo2.svg';
import { cx } from './ui';

/** The hackathon artwork used on /hackathon and /register/hackathon. */
export const HACKATHON_ART = '/img/ODS circle asset 1 [Vectorized].png';

export function OdsLogo({ className }: { className?: string }) {
  return <img src={ODSMark} alt='Ogun Digital Summit' className={cx('h-8 w-auto', className)} />;
}

/** Brand lock-up: ODS mark + product name, for dark backgrounds unless `light` is set. */
export function PortalBrand({
  light,
  sub = 'Ogun Innovate Hackathon'
}: {
  light?: boolean;
  sub?: string;
}) {
  return (
    <span className='flex items-center gap-3'>
      <OdsLogo />
      <span className='leading-tight'>
        <span className={cx('block text-sm font-bold', light ? 'text-[#101828]' : 'text-white')}>
          Hackathon Portal
        </span>
        <span className={cx('block text-[11px]', light ? 'text-[#667085]' : 'text-[#98A2B3]')}>
          {sub}
        </span>
      </span>
    </span>
  );
}

/** Subtle white grid over the dark #101612 panels, as on the registration page. */
export function GridPattern({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cx('pointer-events-none absolute inset-0 opacity-[0.04]', className)}
      style={{
        backgroundImage:
          'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }}
    />
  );
}

/** Row of ticked highlights (top of the registration page's dark panel). */
export function Ticks({ items }: { items: string[] }) {
  return (
    <div className='relative z-10 flex flex-wrap items-center gap-4 text-xs text-[#B2BDB5]'>
      {items.map((t) => (
        <span key={t} className='flex items-center gap-1.5'>
          <Check className='h-3.5 w-3.5 text-white' />
          <span>{t}</span>
        </span>
      ))}
    </div>
  );
}

/** Dark branded side panel used by the staff login (same structure as the registration page). */
export function BrandPanel({ children }: { children?: ReactNode }) {
  return (
    <div className='relative flex w-full shrink-0 flex-col justify-between overflow-hidden bg-[#101612] p-8 text-white lg:min-h-screen lg:w-[480px] lg:p-12 xl:w-[540px] xl:p-14'>
      <GridPattern />
      <Ticks items={['RSVP', 'QR tickets', 'Check-in']} />
      <div className='relative z-10 my-8 hidden items-center justify-center py-6 lg:my-auto lg:flex'>
        <img
          src={HACKATHON_ART}
          alt=''
          className='h-auto w-[320px] max-w-full select-none object-contain xl:w-[400px]'
        />
      </div>
      <div className='relative z-10 pt-6 lg:pt-4'>{children}</div>
    </div>
  );
}
