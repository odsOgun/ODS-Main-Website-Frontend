import { useState, type ChangeEvent } from 'react';
import type { Json } from '../lib/types';
import { api } from '../lib/api';
import { useAction, useTeamOptions } from '../lib/hooks';
import { Button, Field, Input, Modal, Select } from './ui';

/** Create (participant undefined) or edit a participant. */
interface Props {
  open: boolean;
  onClose: () => void;
  participant?: Json;
  defaultTeamId?: string;
}

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  teamRole: string;
  teamId: string;
};

export default function ParticipantForm({ open, onClose, participant, defaultTeamId }: Props) {
  const teams = useTeamOptions();
  const [f, setF] = useState<FormState>(() => ({
    fullName: participant?.fullName || '',
    email: participant?.email || '',
    phone: participant?.phone || '',
    teamRole: participant?.teamRole || '',
    teamId: participant?.teamId?._id || participant?.teamId || defaultTeamId || ''
  }));
  const set = (k: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));
  const save = useAction(
    (body: FormState) =>
      participant
        ? api.put(`/participants/${participant.id || participant._id}`, body)
        : api.post('/participants', body),
    {
      invalidate: [
        'participants',
        'teams',
        'team',
        'rsvp',
        'dashboard',
        'teams-options',
        'participant'
      ],
      success: participant ? 'Participant updated' : 'Participant added',
      onSuccess: onClose
    }
  );
  const emailChanged = participant && participant.email && f.email.trim() !== participant.email;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={participant ? 'Edit participant' : 'Add participant'}
      size='md'
    >
      <form
        className='space-y-4'
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate({ ...f, fullName: f.fullName.trim(), email: f.email.trim() });
        }}
      >
        <Field label='Full name' required>
          <Input required value={f.fullName} onChange={set('fullName')} />
        </Field>
        <Field
          label='Email'
          hint={
            emailChanged
              ? 'Email changed — resend the invitation/ticket from the participant drawer so it reaches the new address.'
              : 'Required to receive the RSVP invitation and ticket.'
          }
        >
          <Input type='email' value={f.email} onChange={set('email')} />
        </Field>
        <div className='grid gap-4 sm:grid-cols-2'>
          <Field label='Phone'>
            <Input value={f.phone} onChange={set('phone')} />
          </Field>
          <Field label='Team role'>
            <Input value={f.teamRole} onChange={set('teamRole')} placeholder='e.g. Team Lead' />
          </Field>
        </div>
        <Field label='Team' required>
          <Select
            required
            value={f.teamId}
            onChange={set('teamId')}
            placeholder={teams.isLoading ? 'Loading teams…' : 'Select team'}
            options={teams.options}
          />
        </Field>
        <div className='flex justify-end gap-2 pt-2'>
          <Button variant='secondary' onClick={onClose}>
            Cancel
          </Button>
          <Button type='submit' loading={save.isPending}>
            {participant ? 'Save' : 'Add participant'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
