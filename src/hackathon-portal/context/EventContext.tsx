import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import { get, storage } from '../lib/api';
import { useAuth } from './AuthContext';
import type { PortalEvent } from '../lib/types';

interface EventValue {
  events: PortalEvent[];
  eventsQuery: UseQueryResult<{ items: PortalEvent[] }>;
  eventId: string | null;
  event: PortalEvent | null;
  setEventId: (id: string) => void;
}

const EventCtx = createContext<EventValue | null>(null);

export function EventProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [eventId, setEventIdState] = useState<string | null>(storage.eventId);
  const events = useQuery<{ items: PortalEvent[] }>({
    queryKey: ['events'],
    queryFn: () => get('/events'),
    enabled: !!user
  });
  const list = useMemo(() => events.data?.items || [], [events.data]);

  useEffect(() => {
    if (!events.data) return;
    if (!list.length) {
      if (eventId) {
        storage.eventId = null;
        setEventIdState(null);
      }
      return;
    }
    if (!eventId || !list.some((e) => e._id === eventId)) {
      const pick = list.find((e) => e.status === 'ACTIVE') || list[0];
      storage.eventId = pick._id;
      setEventIdState(pick._id);
    }
  }, [events.data]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo<EventValue>(
    () => ({
      events: list,
      eventsQuery: events,
      eventId: list.some((e) => e._id === eventId) ? eventId : null,
      event: list.find((e) => e._id === eventId) || null,
      setEventId: (id: string) => {
        storage.eventId = id;
        setEventIdState(id);
        // everything event-scoped must reload
        qc.removeQueries({ predicate: (q) => q.queryKey[0] !== 'events' });
      }
    }),
    [list, events, eventId, qc]
  );
  return <EventCtx.Provider value={value}>{children}</EventCtx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useEvent = () => {
  const v = useContext(EventCtx);
  if (!v) throw new Error('useEvent must be used inside <EventProvider>');
  return v;
};
