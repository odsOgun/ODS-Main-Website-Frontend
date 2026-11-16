import { useState } from 'react';
import { CalendarDays, Plus, Pencil, Trash2, CheckCircle2 } from 'lucide-react';
import { api } from '../../lib/api';
import { useEvent } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import { useAction } from '../../lib/hooks';
import { fmtDate, fmtDateTime } from '../../lib/format';
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  IconButton,
  Modal,
  PageHeader,
  QueryState,
  Table,
  Td,
  Th
} from '../../components/ui';
import EventForm from '../../components/EventForm';
import type { Json } from '../../lib/types';

export default function Events() {
  const { eventsQuery, eventId, setEventId } = useEvent();
  const { isSuper } = useAuth();
  const [editing, setEditing] = useState<Json>(null); // null | 'new' | event
  const [deleting, setDeleting] = useState<Json>(null);

  const save = useAction(
    (payload: Json) =>
      (editing === 'new'
        ? api.post('/events', payload)
        : api.put(`/events/${editing._id}`, payload)
      ).then((r) => r.data),
    {
      invalidate: ['events', 'dashboard', 'rsvp'],
      success: (d) =>
        editing === 'new'
          ? 'Event created'
          : d.deadline
            ? `Event saved · ${d.deadline.pendingUpdated} pending RSVP(s) updated, ${d.deadline.expiredReopened} reopened`
            : 'Event saved',
      onSuccess: (d) => {
        if (editing === 'new' && d?._id) setEventId(d._id);
        setEditing(null);
      }
    }
  );
  const del = useAction((id: string) => api.delete(`/events/${id}`), {
    invalidate: ['events'],
    success: 'Event deleted',
    onSuccess: () => setDeleting(null)
  });

  return (
    <div>
      <PageHeader
        title='Events'
        description='Each event has its own teams, RSVPs, tickets, sessions and email templates.'
        actions={
          <Button icon={Plus} onClick={() => setEditing('new')}>
            New event
          </Button>
        }
      />
      <Card bodyClass='p-0'>
        <QueryState
          query={eventsQuery}
          isEmpty={(d) => !d.items.length}
          empty={
            <EmptyState
              icon={CalendarDays}
              title='No events yet'
              description='Create the event first, then import teams.'
              action={
                <Button icon={Plus} onClick={() => setEditing('new')}>
                  Create event
                </Button>
              }
            />
          }
        >
          {(d) => (
            <Table
              head={
                <>
                  <Th>Event</Th>
                  <Th>Date</Th>
                  <Th>Venue</Th>
                  <Th>RSVP deadline</Th>
                  <Th>Status</Th>
                  <Th className='text-right'>Actions</Th>
                </>
              }
            >
              {d.items.map((e: Json) => (
                <tr key={e._id} className={e._id === eventId ? 'bg-[#E6F6EC]/40' : undefined}>
                  <Td>
                    <b>{e.name}</b>
                    {e._id === eventId && (
                      <Badge tone='teal' className='ml-2'>
                        Current
                      </Badge>
                    )}
                  </Td>
                  <Td>{fmtDate(e.date, e.timezone)}</Td>
                  <Td className='max-w-56 truncate'>{e.venue}</Td>
                  <Td>{fmtDateTime(e.rsvpDeadline, e.timezone)}</Td>
                  <Td>
                    <Badge status={e.status} />
                  </Td>
                  <Td className='text-right whitespace-nowrap'>
                    {e._id !== eventId && (
                      <Button
                        size='sm'
                        variant='ghost'
                        icon={CheckCircle2}
                        onClick={() => setEventId(e._id)}
                      >
                        Select
                      </Button>
                    )}
                    <IconButton icon={Pencil} label='Edit' onClick={() => setEditing(e)} />
                    {isSuper && (
                      <IconButton
                        icon={Trash2}
                        label='Delete'
                        className='hover:text-red-600'
                        onClick={() => setDeleting(e)}
                      />
                    )}
                  </Td>
                </tr>
              ))}
            </Table>
          )}
        </QueryState>
      </Card>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'New event' : 'Edit event'}
        size='lg'
      >
        {editing && (
          <EventForm
            key={editing === 'new' ? 'new' : editing._id}
            event={editing === 'new' ? null : editing}
            onSubmit={(p: Json) => save.mutate(p)}
            onCancel={() => setEditing(null)}
            submitting={save.isPending}
            submitLabel={editing === 'new' ? 'Create event' : 'Save changes'}
          />
        )}
      </Modal>
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title='Delete event?'
        tone='danger'
        confirmLabel='Delete'
        loading={del.isPending}
        message={
          <>
            Delete <b>{deleting?.name}</b>? Only events with no teams, participants or sessions can
            be deleted — otherwise archive the event instead.
          </>
        }
        onConfirm={() => del.mutate(deleting._id)}
      />
    </div>
  );
}
