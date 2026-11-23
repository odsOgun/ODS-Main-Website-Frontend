import { Suspense, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  Handshake,
  Mic,
  GraduationCap,
  Rocket,
  Code2,
  FileText,
  Ticket,
  Receipt,
  Newspaper,
  ScanLine,
  Menu,
  X
} from 'lucide-react';
import UserMenu from '../hackathon-portal/components/UserMenu';
import { GridPattern, OdsLogo } from '../hackathon-portal/components/brand';
import { Loading, cx, type IconType } from '../hackathon-portal/components/ui';
import { p } from '../hackathon-portal/lib/paths';

type NavItem = { to: string; label: string; icon: IconType; end?: boolean };
const NAV: Array<{ title?: string; items: NavItem[] }> = [
  { items: [{ to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true }] },
  {
    title: 'Registrations',
    items: [
      { to: '/admin/registrations/exhibitors', label: 'Exhibitors', icon: Store },
      { to: '/admin/registrations/sponsors', label: 'Sponsors', icon: Handshake },
      { to: '/admin/registrations/speakers', label: 'Speakers', icon: Mic },
      { to: '/admin/registrations/masterclass', label: 'Masterclass', icon: GraduationCap },
      { to: '/admin/registrations/startups', label: 'Startups', icon: Rocket },
      { to: '/admin/registrations/hackathon', label: 'Hackathon teams', icon: Code2 },
      { to: '/admin/registrations/subscribers', label: 'Impact report', icon: FileText }
    ]
  },
  {
    title: 'Tickets',
    items: [
      { to: '/admin/tickets', label: 'Passes & check-in', icon: Ticket },
      { to: '/admin/orders', label: 'Orders', icon: Receipt }
    ]
  },
  { title: 'Content', items: [{ to: '/admin/news', label: 'News', icon: Newspaper }] }
];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className='relative flex h-full flex-col overflow-hidden bg-[#101612] text-[#D0D5DD]'>
      <GridPattern />
      <Link
        to='/admin'
        className='relative z-10 flex items-center gap-3 px-5 py-6'
        onClick={onNavigate}
      >
        <OdsLogo className='h-8 w-auto' />
        <span className='text-sm font-semibold text-white'>Admin</span>
      </Link>
      <div className='relative z-10 flex-1 space-y-4 overflow-y-auto px-3 pb-4'>
        {NAV.map((group, i) => (
          <div key={i} className='space-y-1'>
            {group.title && (
              <p className='px-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[#667085]'>
                {group.title}
              </p>
            )}
            {group.items.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cx(
                    'flex items-center gap-3 rounded-full px-4 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-[#009E49] font-semibold text-white shadow-sm'
                      : 'hover:bg-white/5 hover:text-white'
                  )
                }
              >
                <Icon className='size-4 shrink-0' /> {label}
              </NavLink>
            ))}
          </div>
        ))}
      </div>
      <a
        href={p('/dashboard')}
        className='relative z-10 flex items-center gap-2 border-t border-white/10 px-6 py-4 text-xs text-[#98A2B3] hover:text-white'
      >
        <ScanLine className='size-4' /> Hackathon portal
      </a>
    </nav>
  );
}

export default function AdminShell() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc.pathname]);
  return (
    <div className='flex min-h-screen'>
      <aside className='fixed inset-y-0 left-0 z-30 hidden w-64 lg:block'>
        <Sidebar />
      </aside>
      {open && (
        <div className='fixed inset-0 z-40 lg:hidden'>
          <div className='absolute inset-0 bg-[#101828]/60' onClick={() => setOpen(false)} />
          <div className='relative h-full w-72 max-w-[85vw]'>
            <Sidebar onNavigate={() => setOpen(false)} />
            <button
              type='button'
              className='absolute right-3 top-5 text-[#D0D5DD]'
              onClick={() => setOpen(false)}
              aria-label='Close menu'
            >
              <X className='size-5' />
            </button>
          </div>
        </div>
      )}
      <div className='flex min-w-0 flex-1 flex-col lg:pl-64'>
        <header className='sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-[#EAECF0] bg-white/95 px-4 backdrop-blur sm:px-6'>
          <button
            type='button'
            className='rounded-lg p-2 text-[#475467] hover:bg-[#F2F4F7] lg:hidden'
            onClick={() => setOpen(true)}
            aria-label='Open menu'
          >
            <Menu className='size-5' />
          </button>
          <p className='min-w-0 flex-1 truncate text-sm font-semibold text-[#344054]'>
            Ogun Digital Summit admin
          </p>
          <UserMenu />
        </header>
        <main className='flex-1 px-4 py-6 sm:px-6 lg:px-8'>
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
