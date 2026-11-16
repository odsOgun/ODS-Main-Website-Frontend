import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ScanLine, Search, History, Keyboard, Volume2, VolumeX } from 'lucide-react';
import { api, get, errMsg } from '../../lib/api';
import { useEvent } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import { fmtDateTime, fmtTime } from '../../lib/format';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  EmptyState,
  ErrorState,
  Input,
  Loading,
  Select,
  Tabs,
  Textarea,
  useDebounced,
  Pagination
} from '../ui';
import QrScanner from './QrScanner';
import ResultPanel, { kindOf } from './ResultPanel';
import { feedback } from './feedback';
import type { Json } from '../../lib/types';

const RESUME_MS = 3000;
const SESSION_KEY = 'portal.sessionId';

interface ManualLookupProps {
  sessionId: string;
  isAdmin: boolean;
  onResult: (r: Json) => void;
}

function ManualLookup({ sessionId, isAdmin, onResult }: ManualLookupProps) {
  const [q, setQ] = useState('');
  const term = useDebounced(q.trim(), 300);
  const [busy, setBusy] = useState<string | null>(null);
  const [target, setTarget] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [override, setOverride] = useState(false);
  const res = useQuery<Json>({
    queryKey: ['lookup', sessionId, term],
    queryFn: () => get('/attendance/lookup', { sessionId, q: term }),
    enabled: term.length >= 2 && !!sessionId
  });

  async function checkIn(p: Json) {
    setBusy(p.id);
    try {
      const { data } = await api.post('/attendance/manual', {
        sessionId,
        participantId: p.id,
        reason: reason.trim() || undefined,
        override: isAdmin && override ? true : undefined
      });
      onResult(data);
      setTarget(null);
      setReason('');
      setOverride(false);
      res.refetch();
    } catch (err) {
      onResult({
        result: (err as Json)?.response ? 'ERROR' : 'NETWORK_ERROR',
        message: errMsg(err)
      });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className='space-y-3'>
      <div className='relative'>
        <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98A2B3]' />
        <Input
          className='pl-9'
          placeholder='Search name, email, team, member or ticket ID…'
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      {term.length < 2 ? (
        <p className='text-sm text-[#667085]'>Type at least 2 characters.</p>
      ) : res.isLoading ? (
        <Loading />
      ) : res.isError ? (
        <ErrorState error={res.error} onRetry={() => res.refetch()} />
      ) : !res.data.items.length ? (
        <EmptyState title='No matching participants' />
      ) : (
        <ul className='divide-y divide-[#F2F4F7] rounded-xl border border-[#EAECF0] bg-white'>
          {res.data.items.map((p: Json) => (
            <li key={p.id} className='p-3'>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <div className='min-w-0'>
                  <p className='font-medium text-[#101828]'>
                    {p.fullName} {!p.isActive && <Badge tone='slate'>Inactive</Badge>}
                  </p>
                  <p className='text-xs text-[#667085]'>
                    {p.teamName} · {p.memberId}
                    {p.ticketId ? ` · ${p.ticketId}` : ''}
                  </p>
                  <div className='mt-1 flex flex-wrap gap-1.5'>
                    <Badge status={p.rsvpStatus} />
                    {p.checkedInAt ? (
                      <Badge tone='green'>Checked in {fmtTime(p.checkedInAt)}</Badge>
                    ) : (
                      <Badge tone='slate'>Not checked in</Badge>
                    )}
                  </div>
                </div>
                {!p.checkedInAt && !isAdmin && p.rsvpStatus !== 'CONFIRMED' && (
                  <span className='shrink-0 text-right text-xs font-medium text-[#B42318]'>
                    Not eligible
                    <br />
                    <span className='font-normal text-[#667085]'>RSVP not confirmed</span>
                  </span>
                )}
                {!p.checkedInAt && (isAdmin || p.rsvpStatus === 'CONFIRMED') && (
                  <Button
                    size='sm'
                    variant={target === p.id ? 'secondary' : 'primary'}
                    onClick={() => {
                      setTarget(target === p.id ? null : p.id);
                      setOverride(false);
                      setReason('');
                    }}
                  >
                    {target === p.id ? 'Cancel' : 'Check in'}
                  </Button>
                )}
              </div>
              {target === p.id && (
                <div className='mt-3 space-y-2 rounded-lg bg-[#F9FAFB] p-3'>
                  <Textarea
                    className='min-h-16'
                    placeholder={
                      isAdmin && override
                        ? 'Reason (required for override)'
                        : 'Reason / note (e.g. QR would not scan)'
                    }
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    maxLength={500}
                  />
                  {isAdmin && p.rsvpStatus !== 'CONFIRMED' && (
                    <Checkbox
                      label='Override eligibility (admin) — participant is not confirmed'
                      checked={override}
                      onChange={(e) => setOverride(e.target.checked)}
                    />
                  )}
                  <Button
                    size='sm'
                    loading={busy === p.id}
                    disabled={
                      (p.rsvpStatus !== 'CONFIRMED' && !override) ||
                      (override && reason.trim().length < 3)
                    }
                    onClick={() => checkIn(p)}
                  >
                    Confirm manual check-in
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MyCheckIns({ sessionId }: { sessionId: string }) {
  const [page, setPage] = useState(1);
  const q = useQuery<Json>({
    queryKey: ['my-checkins', sessionId, page],
    queryFn: () => get('/attendance', { sessionId, mine: 'true', page, limit: 20 }),
    refetchInterval: 15000,
    placeholderData: (prev: Json) => prev
  });
  if (q.isLoading) return <Loading />;
  if (q.isError) return <ErrorState error={q.error} onRetry={() => q.refetch()} />;
  if (!q.data.items.length)
    return (
      <EmptyState
        icon={History}
        title='No check-ins yet'
        description='Check-ins you record for this session appear here.'
      />
    );
  return (
    <div className='rounded-xl border border-[#EAECF0] bg-white'>
      <p className='border-b border-[#F2F4F7] px-4 py-2.5 text-sm text-[#475467]'>
        You have recorded <b>{q.data.total}</b> check-in(s) in this session.
      </p>
      <ul className='divide-y divide-[#F2F4F7]'>
        {q.data.items.map((a: Json) => (
          <li key={a._id} className='flex items-center justify-between gap-2 px-4 py-2.5 text-sm'>
            <span className='min-w-0'>
              <b className='block truncate'>{a.participantId?.fullName || 'Deleted participant'}</b>
              <span className='text-xs text-[#667085]'>
                {a.teamId?.name} · {a.ticketCode || 'no ticket'}
              </span>
            </span>
            <span className='text-right'>
              <Badge status={a.method} />
              <span className='block text-xs text-[#667085]'>{fmtDateTime(a.checkedInAt)}</span>
            </span>
          </li>
        ))}
      </ul>
      <Pagination
        page={q.data.page}
        pages={q.data.pages}
        total={q.data.total}
        limit={q.data.limit}
        onPage={setPage}
      />
    </div>
  );
}

export default function CheckInConsole() {
  const { eventId } = useEvent();
  const { isAdmin } = useAuth();
  const qc = useQueryClient();
  const sessionsQ = useQuery<Json>({
    queryKey: ['sessions', eventId],
    queryFn: () => get('/sessions'),
    enabled: !!eventId,
    refetchInterval: 30000
  });
  const sessions: Json[] = sessionsQ.data?.items || [];
  const [sessionId, setSessionIdState] = useState<string>(() => {
    try {
      return localStorage.getItem(SESSION_KEY) || '';
    } catch {
      return '';
    }
  });
  const [tab, setTab] = useState<'scan' | 'lookup' | 'mine'>('scan');
  const [result, setResult] = useState<Json | null>(null);
  const [processing, setProcessing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [sound, setSound] = useState(true);
  const [manualCode, setManualCode] = useState('');
  const lockRef = useRef(false);
  const lastRef = useRef({ text: '', at: 0 });
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const setSessionId = (id: string) => {
    setSessionIdState(id);
    try {
      localStorage.setItem(SESSION_KEY, id);
    } catch {
      /* ignore */
    }
    setResult(null);
    lockRef.current = false;
  };

  // default to an open session when the saved one isn't in this event
  useEffect(() => {
    if (!sessions.length) return;
    if (!sessions.some((s) => s._id === sessionId))
      setSessionIdState(sessions.find((s) => s.openState?.open)?._id || '');
  }, [sessions]); // eslint-disable-line react-hooks/exhaustive-deps

  const session = sessions.find((s) => s._id === sessionId);

  const next = useCallback(() => {
    clearInterval(timerRef.current);
    setCountdown(0);
    setResult(null);
    lockRef.current = false;
  }, []);

  const scheduleResume = useCallback(() => {
    clearInterval(timerRef.current);
    let left = Math.round(RESUME_MS / 1000);
    setCountdown(left);
    timerRef.current = setInterval(() => {
      left -= 1;
      setCountdown(left);
      if (left <= 0) next();
    }, 1000);
  }, [next]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const submit = useCallback(
    async (credential: string) => {
      if (!sessionId) return;
      lockRef.current = true;
      setProcessing(true);
      try {
        const { data } = await api.post('/attendance/scan', { sessionId, credential });
        setResult(data);
        feedback(kindOf(data.result), sound);
        qc.invalidateQueries({ queryKey: ['my-checkins'] });
        qc.invalidateQueries({ queryKey: ['sessions'] });
        scheduleResume();
      } catch (err) {
        if (!(err as Json)?.response) {
          // Do not auto-resume: officer must retry so the check-in isn't silently lost
          setResult({
            result: 'NETWORK_ERROR',
            message: 'Could not reach the server. This check-in was NOT recorded.',
            credential
          });
        } else {
          setResult({ result: 'ERROR', message: errMsg(err) });
          scheduleResume();
        }
        feedback('err', sound);
      } finally {
        setProcessing(false);
      }
    },
    [sessionId, sound, qc, scheduleResume]
  );

  const onScan = useCallback(
    (text: string) => {
      const now = Date.now();
      if (lockRef.current) return;
      if (text === lastRef.current.text && now - lastRef.current.at < RESUME_MS + 1000) return; // same QR still in view
      lastRef.current = { text, at: now };
      submit(text.trim());
    },
    [submit]
  );

  const onManualResult = (r: Json) => {
    setResult(r);
    feedback(kindOf(r.result), sound);
    qc.invalidateQueries({ queryKey: ['my-checkins'] });
    qc.invalidateQueries({ queryKey: ['sessions'] });
  };

  if (sessionsQ.isLoading) return <Loading label='Loading sessions…' />;
  if (sessionsQ.isError)
    return <ErrorState error={sessionsQ.error} onRetry={() => sessionsQ.refetch()} />;
  if (!sessions.length) {
    return (
      <EmptyState
        icon={ScanLine}
        title='No attendance sessions'
        description={
          isAdmin
            ? 'Create a session under Attendance Sessions and set it to ACTIVE.'
            : 'An administrator needs to create and activate a session.'
        }
      />
    );
  }

  return (
    <div className='space-y-4'>
      <Card bodyClass='p-4'>
        <div className='flex items-center gap-3'>
          <div className='min-w-0 flex-1'>
            <Select
              value={sessionId || ''}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder='Select attendance session…'
              options={sessions.map((s) => ({
                value: s._id,
                label: `${s.name} — ${s.openState?.open ? 'OPEN' : s.status}`
              }))}
            />
          </div>
          <button
            type='button'
            onClick={() => setSound((s) => !s)}
            className='rounded-lg p-2 text-[#667085] hover:bg-[#F2F4F7]'
            title={sound ? 'Mute sounds' : 'Enable sounds'}
          >
            {sound ? <Volume2 className='size-5' /> : <VolumeX className='size-5' />}
          </button>
        </div>
        {session ? (
          <p className='mt-2 text-xs text-[#667085]'>
            {session.openState?.open ? (
              <span className='font-semibold text-[#008A43]'>● Open for check-in</span>
            ) : (
              <span className='font-semibold text-red-700'>
                ● Not open: {session.openState?.reason}
              </span>
            )}
            {' · '}
            {fmtDateTime(session.startTime)} – {fmtDateTime(session.endTime)} · {session.checkedIn}{' '}
            checked in
          </p>
        ) : (
          sessions.every((s) => !s.openState?.open) && (
            <p className='mt-2 text-xs text-amber-700'>
              No session is open right now.
              {isAdmin
                ? ' Activate one under Attendance Sessions.'
                : ' Ask an administrator to activate one.'}
            </p>
          )
        )}
      </Card>

      {!sessionId ? (
        <EmptyState icon={ScanLine} title='Select a session to start' />
      ) : (
        <>
          <Tabs
            value={tab}
            onChange={(t) => {
              setTab(t);
              next();
            }}
            tabs={[
              { value: 'scan', label: 'Scan QR' },
              { value: 'lookup', label: 'Manual lookup' },
              { value: 'mine', label: 'My check-ins' }
            ]}
          />
          {tab === 'scan' && (
            <div className='space-y-4'>
              <QrScanner key={sessionId} onScan={onScan} paused={!!result || processing} />
              {processing && (
                <div className='rounded-2xl bg-[#1D2939] p-5 text-center text-white'>
                  <p className='animate-pulse text-lg font-semibold'>Validating ticket…</p>
                </div>
              )}
              <ResultPanel
                result={result}
                countdown={result?.result === 'NETWORK_ERROR' ? 0 : countdown}
                onNext={next}
                onRetry={
                  result?.credential
                    ? () => {
                        const c = result.credential;
                        clearInterval(timerRef.current);
                        setResult(null);
                        submit(c);
                      }
                    : undefined
                }
              />
              <form
                className='flex gap-2'
                onSubmit={(e) => {
                  e.preventDefault();
                  if (manualCode.trim() && !lockRef.current) {
                    submit(manualCode.trim());
                    setManualCode('');
                  }
                }}
              >
                <div className='relative flex-1'>
                  <Keyboard className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98A2B3]' />
                  <Input
                    className='pl-9'
                    placeholder='Paste code / hardware scanner input'
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    autoComplete='off'
                  />
                </div>
                <Button
                  type='submit'
                  variant='secondary'
                  disabled={!manualCode.trim() || processing || !!result}
                >
                  Submit
                </Button>
              </form>
            </div>
          )}
          {tab === 'lookup' && (
            <div className='space-y-4'>
              <ResultPanel result={result} onNext={next} />
              <ManualLookup sessionId={sessionId} isAdmin={isAdmin} onResult={onManualResult} />
            </div>
          )}
          {tab === 'mine' && <MyCheckIns sessionId={sessionId} />}
        </>
      )}
    </div>
  );
}
