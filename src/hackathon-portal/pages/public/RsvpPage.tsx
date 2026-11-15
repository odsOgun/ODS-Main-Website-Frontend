import { useState, type ReactNode } from 'react';
import type { Json } from '../../lib/types';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, MapPin, Users, CheckCircle2, XCircle, Clock, AlertTriangle, Ban, Loader2, MessageCircle, Mail } from 'lucide-react';
import { api, errMsg } from '../../lib/api';
import { fmtDate, fmtDateTime } from '../../lib/format';
import { Button, type IconType } from '../../components/ui';
import PublicShell from './PublicShell';

type CardTone = 'green' | 'red' | 'amber' | 'slate';

function StateCard({ icon: Icon, tone, title, children }: { icon: IconType; tone: CardTone; title: ReactNode; children?: ReactNode }) {
  const tones: Record<CardTone, string> = { green: 'bg-[#CCEDDC] text-[#008A43]', red: 'bg-red-100 text-red-700', amber: 'bg-amber-100 text-amber-700', slate: 'bg-[#F2F4F7] text-[#475467]' };
  return (
    <div className="mt-6 rounded-2xl border border-[#EAECF0] bg-[#F9FAFB] p-5 text-center">
      <span className={`mx-auto flex size-14 items-center justify-center rounded-full ${tones[tone]}`}><Icon className="size-7" /></span>
      <h2 className="platypi-gf mt-3 text-xl font-bold text-[#0B4822]">{title}</h2>
      <div className="mt-2 space-y-2 text-sm text-[#475467]">{children}</div>
    </div>
  );
}

export default function RsvpPage() {
  const { token } = useParams();
  const [confirming, setConfirming] = useState<'YES' | 'NO' | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [justResponded, setJustResponded] = useState<{ already: boolean; status: string } | null>(null);
  const q = useQuery<Json, Json>({ queryKey: ['public-rsvp', token], queryFn: () => api.get(`/public/rsvp/${token}`).then((r) => r.data), retry: (n, e) => n < 2 && !e?.response });

  async function respond(response: 'YES' | 'NO') {
    setSubmitting(true);
    setSubmitError('');
    try {
      const { data } = await api.post(`/public/rsvp/${token}/respond`, { response });
      setJustResponded({ already: data.alreadyResponded, status: data.status });
      q.refetch();
    } catch (err) {
      setSubmitError(errMsg(err, 'Could not save your response. Please try again.'));
    } finally {
      setSubmitting(false);
      setConfirming(null);
    }
  }

  if (q.isLoading) return <PublicShell><div className="flex items-center justify-center gap-2 rounded-3xl bg-white p-10 text-[#667085] shadow-xl"><Loader2 className="size-5 animate-spin" /> Loading your invitation…</div></PublicShell>;
  if (q.isError) {
    const notFound = q.error?.response?.status === 404;
    return (
      <PublicShell>
        <div className="rounded-3xl bg-white p-6 shadow-xl">
          <StateCard icon={notFound ? Ban : AlertTriangle} tone="red" title={notFound ? 'Invalid RSVP link' : 'Something went wrong'}>
            <p>{errMsg(q.error)}</p>
            {!notFound && <Button variant="secondary" onClick={() => q.refetch()}>Try again</Button>}
          </StateCard>
        </div>
      </PublicShell>
    );
  }

  const { rsvp, participant, team, event } = q.data;
  const tz = event.timezone;
  const status = rsvp.status;
  const cancelled = status === 'CANCELLED' || !participant.isActive;

  return (
    <PublicShell eventName={event.shortName || event.name}>
      <div className="overflow-hidden rounded-3xl border border-[#EAECF0] bg-white shadow-xl">
        <div className="border-b border-[#EAECF0] px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#009E49]">Personal RSVP</p>
          <h1 className="platypi-gf mt-1 text-2xl font-bold text-[#0B4822]">Hello, {participant.fullName}</h1>
          <p className="mt-1 text-sm text-[#667085]">{event.name}</p>
        </div>
        <div className="p-6">
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><Users className="mt-0.5 size-4 shrink-0 text-[#009E49]" /><span><span className="block text-xs text-[#667085]">Team</span><b>{team.name}</b></span></li>
            <li className="flex gap-3"><CalendarDays className="mt-0.5 size-4 shrink-0 text-[#009E49]" /><span><span className="block text-xs text-[#667085]">Date</span><b>{fmtDate(event.date, tz)}</b></span></li>
            <li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-[#009E49]" /><span><span className="block text-xs text-[#667085]">Venue</span><b>{event.venue}</b></span></li>
            {status === 'PENDING' && <li className="flex gap-3"><Clock className="mt-0.5 size-4 shrink-0 text-amber-600" /><span><span className="block text-xs text-[#667085]">Please respond by</span><b>{fmtDate(event.rsvpDeadline, tz)}</b></span></li>}
          </ul>

          {submitError && <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>}

          {cancelled ? (
            <StateCard icon={Ban} tone="slate" title="Invitation cancelled">
              <p>This invitation is no longer active. If you think this is a mistake, please reply to your invitation email.</p>
            </StateCard>
          ) : status === 'PENDING' ? (
            confirming ? (
              <div className="mt-6 rounded-2xl border-2 border-[#EAECF0] p-5">
                <p className="font-semibold text-[#101828]">{confirming === 'YES' ? 'Confirm that you will attend?' : 'Confirm that you cannot attend?'}</p>
                <p className="mt-1 text-sm text-[#475467]">{confirming === 'YES' ? 'Your personal QR ticket will be emailed to you right after you confirm.' : 'You will not receive a ticket. Contact the organisers if your plans change.'}</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button variant="secondary" size="lg" onClick={() => setConfirming(null)} disabled={submitting}>Back</Button>
                  <Button variant={confirming === 'YES' ? 'primary' : 'danger'} size="lg" loading={submitting} onClick={() => respond(confirming)}>Yes, confirm</Button>
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                <p className="text-sm text-[#475467]">Every team member must RSVP individually. Will you attend?</p>
                <button type="button" onClick={() => setConfirming('YES')} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#009E49] px-6 py-4 text-base font-bold text-white shadow-md transition hover:bg-[#00873E] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#99DBB9]">
                  <CheckCircle2 className="size-5" /> YES, I WILL ATTEND
                </button>
                <button type="button" onClick={() => setConfirming('NO')} className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#D0D5DD] bg-white px-6 py-4 text-base font-bold text-[#344054] transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-200">
                  <XCircle className="size-5" /> NO, I CANNOT ATTEND
                </button>
              </div>
            )
          ) : status === 'CONFIRMED' ? (
            <StateCard icon={CheckCircle2} tone="green" title={justResponded && !justResponded.already ? 'Thank you — you are confirmed!' : 'You have confirmed your attendance'}>
              <p>Your personal QR ticket {justResponded && !justResponded.already ? 'is being sent' : 'has been sent'} to your email in a separate message. Bring it on your phone or printed — each team member needs their own ticket.</p>
              {rsvp.responseDate && <p className="text-xs text-[#667085]">Confirmed on {fmtDateTime(rsvp.responseDate, tz)}</p>}
              <p className="flex items-center justify-center gap-1.5 text-xs text-[#667085]"><Mail className="size-3.5" /> Can't find it? Check your spam folder.</p>
            </StateCard>
          ) : status === 'DECLINED' ? (
            <StateCard icon={XCircle} tone="red" title={justResponded && !justResponded.already ? 'Thanks for letting us know' : 'You have declined this invitation'}>
              <p>We've recorded that you cannot attend. If your plans change, please reply to your invitation email and the organisers can reopen your RSVP.</p>
              {rsvp.responseDate && <p className="text-xs text-[#667085]">Responded on {fmtDateTime(rsvp.responseDate, tz)}</p>}
            </StateCard>
          ) : status === 'EXPIRED' ? (
            <StateCard icon={Clock} tone="amber" title="This RSVP link has expired">
              <p>The RSVP deadline ({fmtDate(rsvp.expiresAt, tz)}) has passed. Please reply to your invitation email if you still wish to attend.</p>
            </StateCard>
          ) : null}

          {justResponded?.already && <p className="mt-3 text-center text-xs text-[#667085]">You had already responded — your original response has been kept.</p>}

          {event.whatsappLink && status === 'CONFIRMED' && (
            <a href={event.whatsappLink} target="_blank" rel="noreferrer" className="mt-5 flex items-center justify-center gap-2 rounded-full bg-[#009E49] px-4 py-3 text-sm font-semibold text-white hover:bg-[#008A43]"><MessageCircle className="size-4" /> Join the participants' WhatsApp group</a>
          )}
        </div>
      </div>
    </PublicShell>
  );
}
