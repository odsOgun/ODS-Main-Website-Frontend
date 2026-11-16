import { CalendarDays } from 'lucide-react';
import { useEvent } from '../context/EventContext';

export default function EventSelector({ dark }: { dark?: boolean }) {
  const { events, eventId, setEventId, eventsQuery } = useEvent();
  if (eventsQuery.isLoading) return <span className='text-sm text-[#98A2B3]'>Loading events…</span>;
  if (!events.length)
    return (
      <span className={`text-sm ${dark ? 'text-[#D0D5DD]' : 'text-[#667085]'}`}>No events yet</span>
    );
  return (
    <label className='flex min-w-0 items-center gap-2'>
      <CalendarDays className={`size-4 shrink-0 ${dark ? 'text-[#99DBB9]' : 'text-[#009E49]'}`} />
      <span className='sr-only'>Current event</span>
      <select
        value={eventId || ''}
        onChange={(e) => setEventId(e.target.value)}
        className={`min-w-0 max-w-[60vw] truncate rounded-lg border py-1.5 pl-2 pr-8 text-sm font-medium sm:max-w-md ${dark ? 'border-white/20 bg-white/10 text-white [&>option]:text-[#101828]' : 'border-[#D0D5DD] bg-white text-[#1D2939]'}`}
      >
        {events.map((e) => (
          <option key={e._id} value={e._id}>
            {e.name}
            {e.status !== 'ACTIVE' ? ` (${e.status.toLowerCase()})` : ''}
          </option>
        ))}
      </select>
    </label>
  );
}
