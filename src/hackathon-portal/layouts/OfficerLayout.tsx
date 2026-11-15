import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import EventSelector from '../components/EventSelector';
import UserMenu from '../components/UserMenu';
import { GridPattern, OdsLogo } from '../components/brand';
import { Loading, EmptyState } from '../components/ui';
import { useEvent } from '../context/EventContext';

export default function OfficerLayout() {
  const { eventId, events, eventsQuery } = useEvent();
  return (
    <div className='min-h-screen bg-[#F9FAFB]'>
      <header className='sticky top-0 z-20 flex h-16 items-center gap-3 overflow-hidden bg-[#101612] px-4 text-white'>
        <GridPattern />
        <span className='relative z-10 shrink-0'>
          <OdsLogo />
        </span>
        <span className='relative z-10 hidden text-sm font-bold sm:block'>Check-in</span>
        <div className='relative z-10 min-w-0 flex-1'>
          <EventSelector dark />
        </div>
        <div className='relative z-10'>
          <UserMenu dark />
        </div>
      </header>
      <main className='mx-auto max-w-3xl px-3 py-4 sm:px-4'>
        <Suspense fallback={<Loading />}>
          {eventsQuery.isLoading || (events.length > 0 && !eventId) ? (
            <Loading />
          ) : !events.length ? (
            <EmptyState
              title='No events available'
              description='An administrator needs to create an event first.'
            />
          ) : (
            <Outlet />
          )}
        </Suspense>
      </main>
    </div>
  );
}
