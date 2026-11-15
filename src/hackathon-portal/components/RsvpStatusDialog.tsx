import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAction } from '../lib/hooks';
import { useEvent } from '../context/EventContext';
import { fromLocalInput } from '../lib/format';
import type { Json } from '../lib/types';
import { Badge, Button, Field, Input, Modal, Select, Textarea } from './ui';

const OPTIONS = [
  { value: 'CONFIRMED', label: 'Confirmed — issues a ticket and emails it' },
  { value: 'DECLINED', label: 'Declined' },
  { value: 'PENDING', label: 'Pending — reopen so the participant can respond' },
  { value: 'CANCELLED', label: 'Cancelled' }
];

/** Admin correction of an RSVP (always requires a reason; audited server-side). */
interface Props {
  open: boolean;
  onClose: () => void;
  rsvpId: string;
  currentStatus?: string;
  participantName?: string;
}

export default function RsvpStatusDialog({
  open,
  onClose,
  rsvpId,
  currentStatus,
  participantName
}: Props) {
  const { event } = useEvent();
  const [status, setStatus] = useState('');
  const [reason, setReason] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  useEffect(() => {
    if (open) {
      setStatus('');
      setReason('');
      setExpiresAt('');
    }
  }, [open]);
  const save = useAction<Json, void>(
    () =>
      api
        .put(`/rsvp/${rsvpId}/status`, {
          status,
          reason: reason.trim(),
          ...(status === 'PENDING' && expiresAt
            ? { expiresAt: fromLocalInput(expiresAt, event?.timezone) }
            : {})
        })
        .then((r) => r.data),
    {
      invalidate: [
        'rsvp',
        'participants',
        'participant',
        'team',
        'teams',
        'tickets',
        'tickets-stats',
        'dashboard'
      ],
      success: (d) =>
        `RSVP updated${d.ticketId ? ` · ticket ${d.ticketId}${d.ticketEmailQueued ? ' emailed' : ''}` : ''}${d.revokedTicket ? ` · ticket ${d.revokedTicket} revoked` : ''}`,
      onSuccess: onClose
    }
  );
  const options = OPTIONS.filter((o) => o.value !== currentStatus || o.value === 'PENDING');
  return (
    <Modal
      open={open}
      onClose={onClose}
      title='Change RSVP status'
      description={participantName}
      size='sm'
      footer={
        <>
          <Button variant='secondary' onClick={onClose}>
            Cancel
          </Button>
          <Button
            loading={save.isPending}
            disabled={!status || reason.trim().length < 3}
            onClick={() => save.mutate()}
          >
            Update RSVP
          </Button>
        </>
      }
    >
      <div className='space-y-4'>
        <p className='text-sm text-[#475467]'>
          Current status: <Badge status={currentStatus} />
        </p>
        <Field label='New status' required>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder='Select…'
            options={options}
          />
        </Field>
        {currentStatus === 'CONFIRMED' && status && status !== 'CONFIRMED' && (
          <p className='rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800'>
            The participant's active QR ticket will be revoked.
          </p>
        )}
        {status === 'PENDING' && (
          <Field
            label='Link valid until (optional)'
            hint='Defaults to the event RSVP deadline; must be in the future.'
          >
            <Input
              type='datetime-local'
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </Field>
        )}
        <Field label='Reason' required hint='Recorded in the audit log.'>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className='min-h-20'
            maxLength={500}
          />
        </Field>
      </div>
    </Modal>
  );
}
