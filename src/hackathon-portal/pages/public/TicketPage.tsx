import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, MapPin, Users, Download, Printer, Ban, Loader2, AlertTriangle } from 'lucide-react';
import { api, errMsg, PUBLIC_TIMEOUT } from '../../lib/api';
import { useSlow } from '../../lib/hooks';
import { fmtDate } from '../../lib/format';
import { Button } from '../../components/ui';
import PublicShell from './PublicShell';
import type { Json } from '../../lib/types';

export default function TicketPage() {
  const { credential } = useParams();
  const q = useQuery<Json, Json>({ queryKey: ['public-ticket', credential], queryFn: () => api.get(`/public/ticket/${credential}`, { timeout: PUBLIC_TIMEOUT }).then((r) => r.data), retry: (n, e) => n < 2 && !e?.response });
  const [qr, setQr] = useState<string | null>(null);
  const valid = q.data?.ticket.status === 'VALID';
  const slowLoad = useSlow(q.isLoading);

  useEffect(() => {
    if (!valid) return undefined;
    let url: string | undefined;
    api.get(`/public/ticket/${credential}/qr.png`, { responseType: 'blob', timeout: PUBLIC_TIMEOUT }).then((r) => { url = URL.createObjectURL(r.data); setQr(url); }).catch(() => setQr(null));
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [valid, credential]);

  if (q.isLoading) return <PublicShell><div className="rounded-2xl bg-white p-10 text-center text-[#667085] shadow-xl"><p className="flex items-center justify-center gap-2"><Loader2 className="size-5 animate-spin" /> Loading ticket…</p>{slowLoad && <p className="mt-3 text-sm">This can take up to a minute the first time. Please keep this page open.</p>}</div></PublicShell>;
  if (q.isError) return (
    <PublicShell>
      <div className="rounded-3xl bg-white p-8 text-center shadow-xl">
        <AlertTriangle className="mx-auto size-10 text-red-500" />
        <h1 className="platypi-gf mt-3 text-xl font-bold text-[#0B4822]">Ticket not found</h1>
        <p className="mt-1 text-sm text-[#475467]">{errMsg(q.error)}</p>
      </div>
    </PublicShell>
  );

  const { ticket, participant, team, event } = q.data;
  const tz = event.timezone;
  return (
    <PublicShell eventName={event.shortName || event.name}>
      <div className="overflow-hidden rounded-3xl border border-[#EAECF0] bg-white shadow-xl print:shadow-none">
        <div className="border-b border-dashed border-[#D0D5DD] px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#009E49]">Official ticket</p>
        </div>
        <div className="p-6">
          {valid ? (
            <div className="flex flex-col items-center">
              <div className="rounded-2xl border-2 border-dashed border-[#EAECF0] p-3">
                {qr ? <img src={qr} alt={`QR code for ticket ${ticket.ticketId}`} className="size-64 sm:size-72" /> : <div className="flex size-64 items-center justify-center sm:size-72"><Loader2 className="size-6 animate-spin text-[#98A2B3]" /></div>}
              </div>
              <p className="mt-3 font-mono text-lg font-semibold tracking-wider">{ticket.ticketId}</p>
              <p className="text-xs text-[#667085]">Present this QR code at the entrance</p>
            </div>
          ) : (
            <div className="rounded-xl bg-red-50 p-6 text-center">
              <Ban className="mx-auto size-10 text-red-600" />
              <p className="mt-2 text-lg font-bold text-red-700">{ticket.status === 'REVOKED' ? 'This ticket has been revoked' : 'This ticket is not valid'}</p>
              <p className="mt-1 text-sm text-red-700/80">{ticket.status === 'REVOKED' ? 'If a replacement was issued, use the QR code from your most recent ticket email.' : 'Please contact the organisers.'}</p>
              <p className="mt-2 font-mono text-sm text-red-700/70">{ticket.ticketId}</p>
            </div>
          )}
          <ul className="mt-6 space-y-3 border-t border-[#F2F4F7] pt-5 text-sm">
            <li className="flex gap-3"><Users className="mt-0.5 size-4 text-[#009E49]" /><span><span className="block text-xs text-[#667085]">Participant · Team</span><b>{participant.fullName}</b> · {team.name}</span></li>
            <li className="flex gap-3"><CalendarDays className="mt-0.5 size-4 text-[#009E49]" /><span><span className="block text-xs text-[#667085]">Date</span><b>{fmtDate(event.date, tz)}</b></span></li>
            <li className="flex gap-3"><MapPin className="mt-0.5 size-4 text-[#009E49]" /><span><span className="block text-xs text-[#667085]">Venue</span><b>{event.venue}</b></span></li>
          </ul>
          {valid && (
            <div className="no-print mt-6 grid grid-cols-2 gap-3">
              <Button variant="secondary" icon={Download} disabled={!qr} onClick={() => { if (!qr) return; const a = document.createElement('a'); a.href = qr; a.download = `${ticket.ticketId}.png`; a.click(); }}>Download QR</Button>
              <Button variant="dark" icon={Printer} onClick={() => window.print()}>Print ticket</Button>
            </div>
          )}
          <p className="mt-5 text-center text-xs text-[#667085]">This ticket is personal. Each team member has their own ticket.</p>
        </div>
      </div>
    </PublicShell>
  );
}
