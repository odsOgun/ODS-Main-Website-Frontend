import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import { get, errMsg } from './api';
import { useEvent } from '../context/EventContext';
import type { Json, Option } from './types';

type QueryOpts = Omit<UseQueryOptions<Json, Error, Json, Json[]>, 'queryKey' | 'queryFn'>;

/** Event-scoped query: key includes eventId; disabled until an event is selected. */
export function useEventQuery(
  key: string,
  url: string,
  params?: Record<string, unknown>,
  opts: QueryOpts = {}
) {
  const { eventId } = useEvent();
  return useQuery<Json, Error, Json, Json[]>({
    queryKey: [key, eventId, params],
    queryFn: () => get(url, params),
    placeholderData: (prev: Json) => prev,
    ...opts,
    enabled: !!eventId && (opts.enabled ?? true)
  });
}

interface ActionOpts<TData, TVars> {
  success?: string | ((data: TData, vars: TVars) => string | undefined);
  /** query key prefixes to refresh on success */
  invalidate?: string[];
  onSuccess?: (data: TData, vars: TVars) => void;
  onError?: (err: unknown, vars: TVars) => void;
}

/** Mutation with toast + invalidation. */
export function useAction<TData = Json, TVars = Json>(
  fn: (vars: TVars) => Promise<TData>,
  { success, invalidate = [], onSuccess, onError }: ActionOpts<TData, TVars> = {}
) {
  const qc = useQueryClient();
  return useMutation<TData, unknown, TVars>({
    mutationFn: fn,
    onSuccess: (data, vars) => {
      const msg = typeof success === 'function' ? success(data, vars) : success;
      if (msg) toast.success(msg);
      invalidate.forEach((k) => qc.invalidateQueries({ queryKey: [k] }));
      onSuccess?.(data, vars);
    },
    onError: (err, vars) => {
      toast.error(errMsg(err));
      onError?.(err, vars);
    }
  });
}

/** Run an async action (e.g. download) with toast on failure */
export async function withToast<T>(promise: Promise<T>, success?: string) {
  try {
    const r = await promise;
    if (success) toast.success(success);
    return r;
  } catch (err) {
    toast.error(errMsg(err));
    throw err;
  }
}

/** All teams of the current event as select options */
export function useTeamOptions() {
  const q = useEventQuery('teams-options', '/teams', { limit: 1000, sort: 'name' });
  const options: Option[] = (q.data?.items || []).map((t: Json) => ({
    value: t.id,
    label: t.name
  }));
  return { ...q, options };
}

/** Sessions of the current event as select options */
export function useSessionOptions() {
  const q = useEventQuery('sessions', '/sessions');
  const options: Option[] = (q.data?.items || []).map((s: Json) => ({
    value: s._id,
    label: s.name
  }));
  return { ...q, options };
}

/** True once `active` has stayed true for `ms` — used to explain slow loads (e.g. API cold start). */
export function useSlow(active: boolean, ms = 6000) {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    if (!active) {
      setSlow(false);
      return undefined;
    }
    const t = setTimeout(() => setSlow(true), ms);
    return () => clearTimeout(t);
  }, [active, ms]);
  return slow;
}
