import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { Json } from '../lib/types';
import { Button, Checkbox, Field, Input, Select, Textarea } from './ui';
import { fromLocalInput, toLocalInput } from '../lib/format';

const TIMEZONES = [
  'Africa/Lagos',
  'Africa/Accra',
  'Africa/Nairobi',
  'Africa/Johannesburg',
  'Africa/Cairo',
  'Europe/London',
  'UTC'
];

function initial(e?: Json) {
  const tz = e?.timezone || 'Africa/Lagos';
  const s = e?.settings || {};
  return {
    name: e?.name || '',
    shortName: e?.shortName || '',
    summitName: e?.summitName || '',
    organizerName: e?.organizerName || '',
    description: e?.description || '',
    date: toLocalInput(e?.date, tz),
    venue: e?.venue || '',
    timezone: tz,
    rsvpDeadline: toLocalInput(e?.rsvpDeadline, tz),
    status: e?.status || 'ACTIVE',
    preEnabled: s.preEventSession?.enabled ?? false,
    preDescription: s.preEventSession?.description || 'online pre-event session',
    preStartsAt: toLocalInput(s.preEventSession?.startsAt, tz),
    preEndsAt: toLocalInput(s.preEventSession?.endsAt, tz),
    whatsappLink: s.whatsappLink || '',
    registrationLink: s.registrationLink || '',
    replyToEmail: s.replyToEmail || '',
    ticketPrefix: s.ticketPrefix || 'TKT',
    qrSize: s.qrSize || 360
  };
}

type FormState = ReturnType<typeof initial>;

interface Props {
  event?: Json;
  onSubmit: (payload: Json) => void;
  onCancel?: () => void;
  submitting?: boolean;
  submitLabel?: string;
}

/** Full event settings form. onSubmit receives the API payload. */
export default function EventForm({
  event,
  onSubmit,
  onCancel,
  submitting,
  submitLabel = 'Save'
}: Props) {
  const [f, setF] = useState<FormState>(() => initial(event));
  const set =
    (k: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setF((p) => ({
        ...p,
        [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
      }));
  const deadlineChanged = event && f.rsvpDeadline !== initial(event).rsvpDeadline;

  function submit(e: FormEvent) {
    e.preventDefault();
    const tz = f.timezone;
    onSubmit({
      name: f.name,
      shortName: f.shortName,
      summitName: f.summitName,
      organizerName: f.organizerName,
      description: f.description,
      date: fromLocalInput(f.date, tz),
      venue: f.venue,
      timezone: tz,
      rsvpDeadline: fromLocalInput(f.rsvpDeadline, tz),
      status: f.status,
      settings: {
        preEventSession: {
          enabled: f.preEnabled,
          description: f.preDescription,
          startsAt: f.preStartsAt ? fromLocalInput(f.preStartsAt, tz) : null,
          endsAt: f.preEndsAt ? fromLocalInput(f.preEndsAt, tz) : null
        },
        whatsappLink: f.whatsappLink.trim(),
        registrationLink: f.registrationLink.trim(),
        replyToEmail: f.replyToEmail.trim(),
        ticketPrefix: f.ticketPrefix.trim().toUpperCase(),
        qrSize: Number(f.qrSize)
      }
    });
  }

  return (
    <form onSubmit={submit} className='space-y-6'>
      <fieldset className='grid gap-4 sm:grid-cols-2'>
        <legend className='mb-2 text-sm font-semibold text-[#101828]'>Event</legend>
        <Field label='Full event name' required className='sm:col-span-2'>
          <Input
            required
            minLength={2}
            value={f.name}
            onChange={set('name')}
            placeholder='Ogun Innovate Hackathon – Ogun Digital Summit 2026'
          />
        </Field>
        <Field label='Short name' hint='Used in email subjects, e.g. “Ogun Innovate Hackathon”'>
          <Input value={f.shortName} onChange={set('shortName')} />
        </Field>
        <Field label='Summit / parent event' hint='e.g. “Ogun Digital Summit 2026”'>
          <Input value={f.summitName} onChange={set('summitName')} />
        </Field>
        <Field label='Email sign-off' hint='e.g. “The Ogun Digital Summit Team”'>
          <Input value={f.organizerName} onChange={set('organizerName')} />
        </Field>
        <Field label='Status'>
          <Select
            value={f.status}
            onChange={set('status')}
            options={['DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED']}
          />
        </Field>
        <Field label='Event date & time' required>
          <Input type='datetime-local' required value={f.date} onChange={set('date')} />
        </Field>
        <Field label='Timezone'>
          <Select
            value={f.timezone}
            onChange={set('timezone')}
            options={TIMEZONES.map((t) => ({ value: t, label: t }))}
          />
        </Field>
        <Field label='Venue' required className='sm:col-span-2'>
          <Input required minLength={2} value={f.venue} onChange={set('venue')} />
        </Field>
        <Field
          label='RSVP deadline'
          required
          className='sm:col-span-2'
          hint={
            event
              ? 'Changing the deadline moves the expiry of all pending invitations; expired invitations are reopened if the new deadline is in the future.'
              : 'Unanswered invitations expire after this time.'
          }
        >
          <Input
            type='datetime-local'
            required
            value={f.rsvpDeadline}
            onChange={set('rsvpDeadline')}
          />
          {deadlineChanged && (
            <span className='mt-1 block text-xs font-medium text-amber-700'>
              Deadline changed — pending/expired RSVPs will follow it when you save (audited).
            </span>
          )}
        </Field>
        <Field label='Description' className='sm:col-span-2'>
          <Textarea value={f.description} onChange={set('description')} className='min-h-16' />
        </Field>
      </fieldset>

      <fieldset className='grid gap-4 sm:grid-cols-2'>
        <legend className='mb-2 text-sm font-semibold text-[#101828]'>
          Pre-event session (shown in invitation email)
        </legend>
        <Checkbox
          className='sm:col-span-2'
          label='Include a pre-event session'
          checked={f.preEnabled}
          onChange={set('preEnabled')}
        />
        <Field label='Description' className='sm:col-span-2'>
          <Input
            value={f.preDescription}
            onChange={set('preDescription')}
            disabled={!f.preEnabled}
          />
        </Field>
        <Field label='Starts'>
          <Input
            type='datetime-local'
            value={f.preStartsAt}
            onChange={set('preStartsAt')}
            disabled={!f.preEnabled}
          />
        </Field>
        <Field label='Ends'>
          <Input
            type='datetime-local'
            value={f.preEndsAt}
            onChange={set('preEndsAt')}
            disabled={!f.preEnabled}
          />
        </Field>
      </fieldset>

      <fieldset className='grid gap-4 sm:grid-cols-2'>
        <legend className='mb-2 text-sm font-semibold text-[#101828]'>
          Links, email & tickets
        </legend>
        <Field label='WhatsApp group link'>
          <Input
            type='url'
            value={f.whatsappLink}
            onChange={set('whatsappLink')}
            placeholder='https://chat.whatsapp.com/…'
          />
        </Field>
        <Field label='Registration link (e.g. Nobus Cloud)'>
          <Input
            type='url'
            value={f.registrationLink}
            onChange={set('registrationLink')}
            placeholder='https://…'
          />
        </Field>
        <Field label='Reply-to email' hint="Participants' replies go here">
          <Input type='email' value={f.replyToEmail} onChange={set('replyToEmail')} />
        </Field>
        <Field label='Ticket ID prefix' hint='2–8 letters/digits, e.g. OIH → OIH-7K3M9QXA'>
          <Input value={f.ticketPrefix} onChange={set('ticketPrefix')} pattern='[A-Za-z0-9]{2,8}' />
        </Field>
        <Field label='QR image size (px)' hint='160–1024'>
          <Input type='number' min={160} max={1024} value={f.qrSize} onChange={set('qrSize')} />
        </Field>
      </fieldset>

      <div className='flex justify-end gap-2 border-t border-[#F2F4F7] pt-4'>
        {onCancel && (
          <Button variant='secondary' onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type='submit' loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
