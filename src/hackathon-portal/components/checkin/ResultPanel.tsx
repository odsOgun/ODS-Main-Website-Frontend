import { CheckCircle2, AlertTriangle, XCircle, WifiOff, Ban, Clock, UserX } from 'lucide-react';
import { fmtTime, fmtDateTime } from '../../lib/format';
import { Button, cx, type IconType } from '../ui';
import type { Json } from '../../lib/types';

const CONF: Record<
  string,
  { title: string; tone: string; icon: IconType; kind: 'ok' | 'warn' | 'err' }
> = {
  SUCCESS: { title: 'SUCCESS', tone: 'bg-[#00A651]', icon: CheckCircle2, kind: 'ok' },
  ALREADY_CHECKED_IN: {
    title: 'ALREADY CHECKED IN',
    tone: 'bg-amber-500',
    icon: AlertTriangle,
    kind: 'warn'
  },
  INVALID_TICKET: { title: 'INVALID TICKET', tone: 'bg-red-600', icon: XCircle, kind: 'err' },
  TICKET_REVOKED: { title: 'TICKET REVOKED', tone: 'bg-red-600', icon: Ban, kind: 'err' },
  RSVP_NOT_CONFIRMED: { title: 'RSVP NOT CONFIRMED', tone: 'bg-red-600', icon: UserX, kind: 'err' },
  PARTICIPANT_INACTIVE: {
    title: 'PARTICIPANT INACTIVE',
    tone: 'bg-red-600',
    icon: UserX,
    kind: 'err'
  },
  SESSION_CLOSED: { title: 'SESSION CLOSED', tone: 'bg-red-700', icon: Clock, kind: 'err' },
  NETWORK_ERROR: { title: 'NETWORK ERROR', tone: 'bg-[#344054]', icon: WifiOff, kind: 'err' },
  ERROR: { title: 'ERROR', tone: 'bg-[#344054]', icon: XCircle, kind: 'err' }
};
// eslint-disable-next-line react-refresh/only-export-components
export const kindOf = (r: string) => (CONF[r] || CONF.ERROR).kind;

interface Props {
  result: Json | null;
  onNext?: () => void;
  onRetry?: () => void;
  countdown?: number | null;
}

export default function ResultPanel({ result, onNext, onRetry, countdown }: Props) {
  if (!result) return null;
  const c = CONF[result.result] || CONF.ERROR;
  const Icon = c.icon;
  const already = result.result === 'ALREADY_CHECKED_IN';
  return (
    <div
      className={cx('rounded-2xl p-5 text-white shadow-lg', c.tone)}
      role='status'
      aria-live='assertive'
    >
      <div className='flex items-center gap-3'>
        <Icon className='size-10 shrink-0' />
        <div className='min-w-0'>
          <p className='text-2xl font-extrabold tracking-tight'>{c.title}</p>
          <p className='text-sm text-white/90'>
            {result.message}
            {result.detail ? ` — ${result.detail}` : ''}
          </p>
        </div>
      </div>
      {result.participant && (
        <div className='mt-4 rounded-xl bg-white/15 p-4'>
          <p className='text-xl font-bold'>{result.participant.fullName}</p>
          <p className='text-sm text-white/90'>
            Team: <b>{result.team?.name || '—'}</b>
          </p>
          <div className='mt-2 grid grid-cols-1 gap-1 text-sm sm:grid-cols-2'>
            <span>
              Ticket: <b className='font-mono'>{result.ticketId || '—'}</b>
            </span>
            {result.checkedInAt && (
              <span>
                {already ? 'Previously checked in' : 'Checked in'}:{' '}
                <b>{already ? fmtDateTime(result.checkedInAt) : fmtTime(result.checkedInAt)}</b>
              </span>
            )}
            {result.checkedInBy && (
              <span>
                By: <b>{result.checkedInBy}</b>
              </span>
            )}
            {result.rsvpStatus && (
              <span>
                RSVP: <b>{result.rsvpStatus.replace('_', ' ')}</b>
              </span>
            )}
            {result.method === 'MANUAL' && (
              <span>
                Method: <b>Manual</b>
              </span>
            )}
          </div>
        </div>
      )}
      <div className='mt-4 flex flex-wrap gap-2'>
        {result.result === 'NETWORK_ERROR' && onRetry && (
          <Button variant='secondary' onClick={onRetry}>
            Retry — not recorded yet
          </Button>
        )}
        {onNext && (
          <Button variant='dark' onClick={onNext} className='bg-black/30 hover:bg-black/40'>
            Scan next{countdown ? ` (${countdown})` : ''}
          </Button>
        )}
      </div>
    </div>
  );
}
