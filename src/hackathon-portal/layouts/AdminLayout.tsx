import { useState, useEffect, Suspense } from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  UserRound,
  FileUp,
  MailCheck,
  Ticket,
  ScanLine,
  Clock,
  FileBarChart,
  Mail,
  ShieldCheck,
  ScrollText,
  Settings,
  Menu,
  X
} from 'lucide-react';
import EventSelector from '../components/EventSelector';
import UserMenu from '../components/UserMenu';
import { GridPattern, PortalBrand } from '../components/brand';
import { useEvent } from '../context/EventContext';
import { Loading, EmptyState, Button, cx, type IconType } from '../components/ui';
import { p, portalRelative } from '../lib/paths';

const NAV: Array<{ to: string; label: string; icon: IconType }> = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/events', label: 'Events', icon: CalendarDays },
  { to: '/teams', label: 'Teams', icon: Users },
  { to: '/participants', label: 'Participants', icon: UserRound },
  { to: '/import', label: 'CSV Import', icon: FileUp },
  { to: '/rsvp', label: 'RSVP Management', icon: MailCheck },
  { to: '/tickets', label: 'QR Tickets', icon: Ticket },
  { to: '/check-in', label: 'Check-in', icon: ScanLine },
  { to: '/sessions', label: 'Attendance Sessions', icon: Clock },
  { to: '/reports', label: 'Reports', icon: FileBarChart },
  { to: '/email-logs', label: 'Email Logs', icon: Mail },
  { to: '/users', label: 'Check-in Officers', icon: ShieldCheck },
  { to: '/audit-logs', label: 'Audit Logs', icon: ScrollText },
  { to: '/settings', label: 'Settings', icon: Settings }
];
// pages that work without a selected event
const EVENTLESS = ['/events', '/users', '/audit-logs'];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className='relative flex h-full flex-col overflow-hidden bg-[#101612] text-[#D0D5DD]'>
      <GridPattern />
      <Link to={p('/dashboard')} className='relative z-10 px-5 py-6' onClick={onNavigate}>
        <PortalBrand />
      </Link>
      <div className='relative z-10 flex-1 space-y-1 overflow-y-auto px-3 pb-4'>
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={p(to)}
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
      <a
        href='/'
        className='relative z-10 border-t border-white/10 px-6 py-4 text-xs text-[#98A2B3] hover:text-white'
      >
        ogundigitalsummit.com
      </a>
    </nav>
  );
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const { eventId, events, eventsQuery } = useEvent();
  useEffect(() => setOpen(false), [loc.pathname]);
  const rel = portalRelative(loc.pathname);
  const needsEvent = !EVENTLESS.some((path) => rel.startsWith(path));

  let content = <Outlet />;
  if (needsEvent && eventsQuery.isLoading) content = <Loading />;
  else if (needsEvent && !events.length)
    content = (
      <EmptyState
        icon={CalendarDays}
        title='Create your first event'
        description='Teams, RSVPs, tickets and attendance all belong to an event.'
        action={
          <Link to={p('/events')}>
            <Button>Go to Events</Button>
          </Link>
        }
      />
    );
  else if (needsEvent && !eventId) content = <Loading />;

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
          <div className='min-w-0 flex-1'>
            <EventSelector />
          </div>
          <UserMenu />
        </header>
        <main className='flex-1 px-4 py-6 sm:px-6 lg:px-8'>
          <Suspense fallback={<Loading />}>{content}</Suspense>
        </main>
      </div>
    </div>
  );
}
