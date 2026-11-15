import { useEffect, useState } from 'react';
import type { Json } from '../lib/types';
import { useQuery } from '@tanstack/react-query';
import { Download, Send, Ban, RefreshCw } from 'lucide-react';
import { api, blobUrl, download, get } from '../lib/api';
import { useAction, withToast } from '../lib/hooks';
import { useEvent } from '../context/EventContext';
import { fmtDateTime } from '../lib/format';
import {
  Badge,
  Button,
  ConfirmDialog,
  ErrorState,
  KeyValue,
  Loading,
  Modal,
  Spinner,
  Table,
  Td,
  Th
} from './ui';

const INVALIDATE = [
  'tickets',
  'tickets-stats',
  'ticket',
  'participants',
  'participant',
  'team',
  'teams',
  'dashboard',
  'email-logs'
];

/** Ticket detail with QR preview and resend / revoke / regenerate. */
interface Props {
  ticketId: string | null;
  onClose: () => void;
}

export default function TicketDetailModal({ ticketId, onClose }: Props) {
  const { eventId } = useEvent();
  const q = useQuery<Json>({
    queryKey: ['ticket', eventId, ticketId],
    queryFn: () => get(`/tickets/${ticketId}`),
    enabled: !!ticketId
  });
  const [qr, setQr] = useState<string | null>(null);
  const [qrErr, setQrErr] = useState(false);
  const [confirm, setConfirm] = useState<'revoke' | 'regen' | null>(null);
  const [dl, setDl] = useState(false);
  const active = q.data?.ticket.status === 'ACTIVE';

  useEffect(() => {
    setQr(null);
    setQrErr(false);
    if (!ticketId || !active) return undefined;
    let url: string | undefined;
    blobUrl(`/tickets/${ticketId}/qr.png`)
      .then((u) => {
        url = u;
        setQr(u);
      })
      .catch(() => setQrErr(true));
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [ticketId, active]);

  const resend = useAction<Json, void>(
    () => api.post(`/tickets/${ticketId}/resend`).then((r) => r.data),
    {
      invalidate: INVALIDATE,
      success: (d) => (d.queued ? 'Ticket email queued (same QR code)' : `Not queued: ${d.reason}`)
    }
  );
  const revoke = useAction(
    (reason: string) => api.post(`/tickets/${ticketId}/revoke`, { reason }),
    {
      invalidate: INVALIDATE,
      success: 'Ticket revoked — it can no longer be used for check-in',
      onSuccess: () => setConfirm(null)
    }
  );
  const regen = useAction(
    (reason: string) => api.post(`/tickets/${ticketId}/regenerate`, { reason }).then((r) => r.data),
    {
      invalidate: INVALIDATE,
      success: (d) =>
        `New ticket ${d.ticket.ticketId} issued${d.email?.queued ? ' and emailed' : ''}. The old QR code no longer works.`,
      onSuccess: () => {
        setConfirm(null);
        onClose();
      }
    }
  );

  const t = q.data?.ticket;
  return (
    <Modal
      open={!!ticketId}
      onClose={onClose}
      title={t ? `Ticket ${t.ticketId}` : 'Ticket'}
      size='lg'
    >
      {q.isError ? (
        <ErrorState error={q.error} onRetry={() => q.refetch()} />
      ) : !q.data ? (
        <Loading />
      ) : (
        <div className='space-y-5'>
          <div className='flex flex-col gap-5 sm:flex-row'>
            <div className='flex size-52 shrink-0 items-center justify-center self-center rounded-xl border border-[#EAECF0] bg-white'>
              {!active ? (
                <div className='p-4 text-center text-sm text-red-600'>
                  <Ban className='mx-auto mb-1 size-8' />
                  Revoked
                </div>
              ) : qr ? (
                <img src={qr} alt='QR code' className='size-48' />
              ) : qrErr ? (
                <span className='text-xs text-red-600'>Could not load QR</span>
              ) : (
                <Spinner />
              )}
            </div>
            <KeyValue
              items={[
                ['Participant', t.participantId?.fullName],
                ['Email', t.participantId?.email || '—'],
                ['Team', t.teamId?.name],
                ['Status', <Badge key='s' status={t.status} />],
                ['Generated', fmtDateTime(t.generatedAt)],
                ['Email status', <Badge key='e' status={t.emailStatus} />],
                ['Email sent', fmtDateTime(t.emailSentAt)],
                t.emailError && [
                  'Email error',
                  <span key='err' className='text-red-700'>
                    {t.emailError}
                  </span>
                ],
                t.revokedAt && [
                  'Revoked',
                  `${fmtDateTime(t.revokedAt)} by ${t.revokedBy?.name || '—'}`
                ],
                t.revokeReason && ['Revoke reason', t.revokeReason]
              ]}
            />
          </div>
          <div className='flex flex-wrap gap-2'>
            <Button
              variant='secondary'
              icon={Download}
              disabled={!active}
              loading={dl}
              onClick={async () => {
                setDl(true);
                try {
                  await withToast(
                    download(`/tickets/${ticketId}/qr.png`, { download: 1 }, `${t.ticketId}.png`)
                  );
                } catch {
                  /* toasted */
                } finally {
                  setDl(false);
                }
              }}
            >
              Download PNG
            </Button>
            <Button
              variant='secondary'
              icon={Send}
              disabled={!active || !t.participantId?.email}
              loading={resend.isPending}
              onClick={() => resend.mutate()}
            >
              Resend ticket email
            </Button>
            <Button variant='secondary' icon={RefreshCw} onClick={() => setConfirm('regen')}>
              Regenerate
            </Button>
            <Button
              variant='danger'
              icon={Ban}
              disabled={!active}
              onClick={() => setConfirm('revoke')}
            >
              Revoke
            </Button>
          </div>
          {q.data.history.length > 1 && (
            <div>
              <h4 className='mb-2 text-sm font-semibold text-[#101828]'>
                Ticket history for this participant
              </h4>
              <Table
                head={
                  <>
                    <Th>Ticket ID</Th>
                    <Th>Status</Th>
                    <Th>Generated</Th>
                    <Th>Revoked</Th>
                    <Th>Reason</Th>
                  </>
                }
              >
                {q.data.history.map((h: Json) => (
                  <tr key={h._id}>
                    <Td className='font-mono text-xs'>{h.ticketId}</Td>
                    <Td>
                      <Badge status={h.status} />
                    </Td>
                    <Td className='text-xs'>{fmtDateTime(h.generatedAt)}</Td>
                    <Td className='text-xs'>{fmtDateTime(h.revokedAt)}</Td>
                    <Td className='text-xs'>{h.revokeReason || '—'}</Td>
                  </tr>
                ))}
              </Table>
            </div>
          )}
        </div>
      )}
      <ConfirmDialog
        open={confirm === 'revoke'}
        onClose={() => setConfirm(null)}
        title='Revoke ticket?'
        tone='danger'
        confirmLabel='Revoke ticket'
        reasonLabel='Reason'
        loading={revoke.isPending}
        onConfirm={(r) => revoke.mutate(r)}
        message="The QR code will be rejected at check-in (TICKET REVOKED). The participant's RSVP is not changed."
      />
      <ConfirmDialog
        open={confirm === 'regen'}
        onClose={() => setConfirm(null)}
        title='Regenerate ticket?'
        confirmLabel='Revoke & issue new ticket'
        reasonLabel='Reason'
        loading={regen.isPending}
        onConfirm={(r) => regen.mutate(r)}
        message='The current QR code is revoked and a new ticket with a new QR code is issued and emailed. Only possible for confirmed, active participants.'
      />
    </Modal>
  );
}
