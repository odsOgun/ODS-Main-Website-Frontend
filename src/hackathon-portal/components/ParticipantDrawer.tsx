import { useState, type ReactNode } from 'react';
import type { Json } from '../lib/types';
import { useQuery } from '@tanstack/react-query';
import { Pencil, Send, RotateCcw, UserX, UserCheck, Trash2, Ticket } from 'lucide-react';
import { api, get } from '../lib/api';
import { useAction } from '../lib/hooks';
import { useEvent } from '../context/EventContext';
import { fmtDateTime } from '../lib/format';
import {
  Badge,
  Button,
  ConfirmDialog,
  Drawer,
  ErrorState,
  KeyValue,
  Loading,
  StatusBadge
} from './ui';
import ParticipantForm from './ParticipantForm';
import RsvpStatusDialog from './RsvpStatusDialog';
import TicketDetailModal from './TicketDetailModal';

const INV = [
  'participants',
  'participant',
  'team',
  'teams',
  'rsvp',
  'dashboard',
  'tickets',
  'tickets-stats',
  'email-logs'
];

function Section({
  title,
  children,
  actions
}: {
  title: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className='border-t border-[#F2F4F7] py-4 first:border-0 first:pt-0'>
      <div className='mb-3 flex flex-wrap items-center justify-between gap-2'>
        <h4 className='text-sm font-semibold text-[#101828]'>{title}</h4>
        {actions && <div className='flex flex-wrap gap-2'>{actions}</div>}
      </div>
      {children}
    </section>
  );
}

interface Props {
  participantId: string | null;
  onClose: () => void;
}

export default function ParticipantDrawer({ participantId, onClose }: Props) {
  const { eventId } = useEvent();
  const q = useQuery<Json>({
    queryKey: ['participant', eventId, participantId],
    queryFn: () => get(`/participants/${participantId}`),
    enabled: !!participantId
  });
  const [edit, setEdit] = useState(false);
  const [confirm, setConfirm] = useState<'reissue' | 'deactivate' | 'delete' | null>(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const resend = useAction(
    (reissue: boolean) => api.post(`/participants/${participantId}/resend-invitation`, { reissue }),
    {
      invalidate: INV,
      success: (_d, reissue) =>
        reissue
          ? 'New RSVP link issued and emailed — the old link no longer works'
          : 'Invitation queued (same RSVP link)',
      onSuccess: () => setConfirm(null)
    }
  );
  const toggleActive = useAction(
    (isActive: boolean) =>
      api.put(`/participants/${participantId}`, { isActive }).then((r) => r.data),
    {
      invalidate: INV,
      success: (d) =>
        d.participant.isActive
          ? 'Participant reactivated'
          : `Participant deactivated${d.rsvpCancelled ? ' · RSVP cancelled' : ''}${d.ticketRevoked ? ` · ticket ${d.ticketRevoked} revoked` : ''}`,
      onSuccess: () => setConfirm(null)
    }
  );
  const del = useAction<unknown, void>(() => api.delete(`/participants/${participantId}`), {
    invalidate: INV,
    success: 'Participant deleted',
    onSuccess: () => {
      setConfirm(null);
      onClose();
    }
  });

  const d = q.data;
  const p = d?.participant;
  const rsvp = d?.rsvp;
  const responded = !!rsvp && ['CONFIRMED', 'DECLINED', 'CANCELLED'].includes(rsvp.status);

  return (
    <Drawer open={!!participantId} onClose={onClose} title={p ? p.fullName : 'Participant'}>
      {q.isError ? (
        <ErrorState error={q.error} onRetry={() => q.refetch()} />
      ) : !q.data ? (
        <Loading />
      ) : (
        <div>
          <Section
            title='Details'
            actions={
              <>
                <Button size='sm' variant='secondary' icon={Pencil} onClick={() => setEdit(true)}>
                  Edit
                </Button>
                {p.isActive ? (
                  <Button
                    size='sm'
                    variant='secondary'
                    icon={UserX}
                    onClick={() => setConfirm('deactivate')}
                  >
                    Deactivate
                  </Button>
                ) : (
                  <Button
                    size='sm'
                    variant='secondary'
                    icon={UserCheck}
                    loading={toggleActive.isPending}
                    onClick={() => toggleActive.mutate(true)}
                  >
                    Reactivate
                  </Button>
                )}
                <Button
                  size='sm'
                  variant='ghost'
                  icon={Trash2}
                  className='text-red-600 hover:bg-red-50'
                  onClick={() => setConfirm('delete')}
                >
                  Delete
                </Button>
              </>
            }
          >
            <KeyValue
              items={[
                ['Member ID', p.memberId],
                [
                  'Status',
                  p.isActive ? (
                    <Badge key='a' tone='green'>
                      Active
                    </Badge>
                  ) : (
                    <Badge key='a' tone='slate'>
                      Inactive
                    </Badge>
                  )
                ],
                [
                  'Email',
                  p.email || (
                    <span key='e' className='text-amber-700'>
                      No email address
                    </span>
                  )
                ],
                ['Phone', p.phone || '—'],
                ['Team', p.teamId?.name],
                ['Team role', p.teamRole || '—'],
                ['Created', fmtDateTime(p.createdAt)],
                p.extra &&
                  Object.keys(p.extra).length > 0 && [
                    'Other CSV fields',
                    <span key='x' className='text-xs'>
                      {Object.entries(p.extra)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(' · ')}
                    </span>
                  ]
              ]}
            />
          </Section>

          <Section
            title='RSVP'
            actions={
              p.isActive &&
              p.email && (
                <>
                  {!responded && (
                    <Button
                      size='sm'
                      variant='secondary'
                      icon={Send}
                      loading={resend.isPending && !resend.variables}
                      onClick={() => resend.mutate(false)}
                    >
                      {rsvp ? 'Resend invitation' : 'Send invitation'}
                    </Button>
                  )}
                  {rsvp && !responded && (
                    <Button
                      size='sm'
                      variant='secondary'
                      icon={RotateCcw}
                      onClick={() => setConfirm('reissue')}
                    >
                      Issue new link
                    </Button>
                  )}
                  {rsvp && (
                    <Button size='sm' variant='secondary' onClick={() => setStatusOpen(true)}>
                      Change status
                    </Button>
                  )}
                </>
              )
            }
          >
            {!rsvp ? (
              <p className='text-sm text-[#667085]'>Not invited yet.</p>
            ) : (
              <KeyValue
                items={[
                  ['Status', <StatusBadge key='s' status={rsvp.status} />],
                  [
                    'Response date',
                    `${fmtDateTime(rsvp.responseDate)}${rsvp.respondedVia ? ` (via ${rsvp.respondedVia.toLowerCase()})` : ''}`
                  ],
                  ['Invitation email', <StatusBadge key='i' status={rsvp.invitationStatus} />],
                  ['Invitation sent', fmtDateTime(rsvp.invitationSentAt)],
                  ['Link expires', fmtDateTime(rsvp.expiresAt)],
                  ['Reminders sent', rsvp.reminderCount],
                  rsvp.invitationError && [
                    'Last error',
                    <span key='err' className='text-red-700'>
                      {rsvp.invitationError}
                    </span>
                  ]
                ]}
              />
            )}
            {!p.email && (
              <p className='mt-2 text-xs text-amber-700'>
                Add an email address to invite this participant.
              </p>
            )}
          </Section>

          <Section title='Tickets'>
            {!d.tickets.length ? (
              <p className='text-sm text-[#667085]'>
                No ticket. Tickets are generated only after the participant confirms (YES).
              </p>
            ) : (
              <ul className='space-y-2'>
                {d.tickets.map((t: Json) => (
                  <li
                    key={t._id}
                    className='flex items-center justify-between gap-2 rounded-lg border border-[#EAECF0] px-3 py-2 text-sm'
                  >
                    <span>
                      <span className='font-mono'>{t.ticketId}</span> <Badge status={t.status} />{' '}
                      <Badge status={t.emailStatus} />
                      <span className='block text-xs text-[#667085]'>
                        Generated {fmtDateTime(t.generatedAt)}
                        {t.revokeReason ? ` · revoked: ${t.revokeReason}` : ''}
                      </span>
                    </span>
                    <Button
                      size='sm'
                      variant='ghost'
                      icon={Ticket}
                      onClick={() => setTicketId(t._id)}
                    >
                      Open
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title='Attendance'>
            {!d.attendance.length ? (
              <p className='text-sm text-[#667085]'>Not checked in to any session.</p>
            ) : (
              <ul className='space-y-1.5 text-sm'>
                {d.attendance.map((a: Json) => (
                  <li key={a._id} className='flex justify-between gap-2'>
                    <span>
                      <b>{a.sessionId?.name}</b> <Badge status={a.method} />
                    </span>
                    <span className='text-xs text-[#667085]'>
                      {fmtDateTime(a.checkedInAt)} · {a.checkedInBy?.name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title='Emails'>
            {!d.emails.length ? (
              <p className='text-sm text-[#667085]'>No emails sent.</p>
            ) : (
              <ul className='space-y-1.5 text-sm'>
                {d.emails.map((e: Json) => (
                  <li key={e._id} className='flex flex-wrap justify-between gap-2'>
                    <span>
                      {e.emailType.replace(/_/g, ' ').toLowerCase()} <Badge status={e.status} />
                      {e.errorMessage && (
                        <span className='block text-xs text-red-600'>{e.errorMessage}</span>
                      )}
                    </span>
                    <span className='text-xs text-[#667085]'>
                      {e.recipient} · {fmtDateTime(e.sentAt || e.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>
      )}
      {edit && p && <ParticipantForm open onClose={() => setEdit(false)} participant={p} />}
      {rsvp && (
        <RsvpStatusDialog
          open={statusOpen}
          onClose={() => setStatusOpen(false)}
          rsvpId={rsvp._id}
          currentStatus={rsvp.status}
          participantName={p?.fullName}
        />
      )}
      <TicketDetailModal ticketId={ticketId} onClose={() => setTicketId(null)} />
      <ConfirmDialog
        open={confirm === 'reissue'}
        onClose={() => setConfirm(null)}
        title='Issue a new RSVP link?'
        confirmLabel='Issue & email new link'
        loading={resend.isPending}
        onConfirm={() => resend.mutate(true)}
        message="The participant's current RSVP link stops working immediately and a new personal link is emailed to them."
      />
      <ConfirmDialog
        open={confirm === 'deactivate'}
        onClose={() => setConfirm(null)}
        title='Deactivate participant?'
        tone='danger'
        confirmLabel='Deactivate'
        loading={toggleActive.isPending}
        onConfirm={() => toggleActive.mutate(false)}
        message='Their RSVP becomes CANCELLED and any active ticket is revoked. Attendance history is kept.'
      />
      <ConfirmDialog
        open={confirm === 'delete'}
        onClose={() => setConfirm(null)}
        title='Delete participant?'
        tone='danger'
        confirmLabel='Delete'
        loading={del.isPending}
        onConfirm={() => del.mutate()}
        message='Permanently deletes the participant with their RSVP and tickets. Not allowed if they have attendance records — deactivate instead.'
      />
    </Drawer>
  );
}
