import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { p } from '../../lib/paths';
import { Plus, Pencil, Trash2, Play, Square, Clock, ScanLine, UserMinus } from 'lucide-react';
import { api, clean } from '../../lib/api';
import { useAction, useEventQuery, useTeamOptions } from '../../lib/hooks';
import { useEvent } from '../../context/EventContext';
import { fmtDateTime, fromLocalInput, toLocalInput } from '../../lib/format';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  Field,
  IconButton,
  Input,
  Loading,
  Modal,
  PageHeader,
  Pagination,
  Select,
  Table,
  Td,
  Textarea,
  Th
} from '../../components/ui';
import type { Json } from '../../lib/types';

const INV = ['sessions', 'dashboard', 'attendance-records', 'teams'];

interface SessionFormProps {
  open: boolean;
  onClose: () => void;
  session: Json | null;
}

function SessionForm({ open, onClose, session }: SessionFormProps) {
  const { event } = useEvent();
  const tz = event?.timezone;
  const [f, setF] = useState(() => ({
    name: session?.name || '',
    description: session?.description || '',
    startTime: toLocalInput(session?.startTime || event?.date, tz),
    endTime: toLocalInput(session?.endTime, tz),
    status: session?.status || 'UPCOMING',
    enforceTimeWindow: session?.enforceTimeWindow ?? false,
    allowManualCheckIn: session?.allowManualCheckIn ?? true
  }));
  const set =
    (k: keyof typeof f) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setF((p) => ({
        ...p,
        [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
      }));
  const save = useAction(
    (b: Json) => (session ? api.put(`/sessions/${session._id}`, b) : api.post('/sessions', b)),
    {
      invalidate: INV,
      success: session ? 'Session updated' : 'Session created',
      onSuccess: onClose
    }
  );
  const bad = !!f.startTime && !!f.endTime && f.endTime <= f.startTime;
  function submit(e: FormEvent) {
    e.preventDefault();
    const start = fromLocalInput(f.startTime, tz);
    save.mutate({
      name: f.name,
      description: f.description,
      date: fromLocalInput(`${f.startTime.slice(0, 10)}T00:00`, tz),
      startTime: start,
      endTime: fromLocalInput(f.endTime, tz),
      status: f.status,
      enforceTimeWindow: f.enforceTimeWindow,
      allowManualCheckIn: f.allowManualCheckIn
    });
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={session ? 'Edit session' : 'New attendance session'}
      size='md'
    >
      <form onSubmit={submit} className='space-y-4'>
        <Field label='Session name' required>
          <Input
            required
            minLength={2}
            value={f.name}
            onChange={set('name')}
            placeholder='e.g. Day 1 – Opening & Registration'
          />
        </Field>
        <Field label='Description'>
          <Textarea className='min-h-16' value={f.description} onChange={set('description')} />
        </Field>
        <div className='grid gap-4 sm:grid-cols-2'>
          <Field label='Check-in opens' required hint={tz}>
            <Input type='datetime-local' required value={f.startTime} onChange={set('startTime')} />
          </Field>
          <Field
            label='Check-in closes'
            required
            error={bad ? 'Must be after opening time' : undefined}
          >
            <Input type='datetime-local' required value={f.endTime} onChange={set('endTime')} />
          </Field>
        </div>
        <Field label='Status' hint='Scans are accepted only while the session is ACTIVE.'>
          <Select
            value={f.status}
            onChange={set('status')}
            options={['UPCOMING', 'ACTIVE', 'CLOSED']}
          />
        </Field>
        <Checkbox
          label='Also reject scans outside the opening/closing times (even when ACTIVE)'
          checked={f.enforceTimeWindow}
          onChange={set('enforceTimeWindow')}
        />
        <Checkbox
          label='Allow officers to check in manually (lookup) for this session'
          checked={f.allowManualCheckIn}
          onChange={set('allowManualCheckIn')}
        />
        <div className='flex justify-end gap-2 pt-2'>
          <Button variant='secondary' onClick={onClose}>
            Cancel
          </Button>
          <Button type='submit' loading={save.isPending} disabled={bad}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function AttendanceRecords({ session }: { session: Json }) {
  const teams = useTeamOptions();
  const [teamId, setTeamId] = useState('');
  const [method, setMethod] = useState('');
  const [page, setPage] = useState(1);
  const [removing, setRemoving] = useState<Json>(null);
  const list = useEventQuery(
    'attendance-records',
    '/attendance',
    clean({ sessionId: session._id, teamId, method, page, limit: 25 }),
    { refetchInterval: 15000 }
  );
  const remove = useAction(
    (reason: string) => api.delete(`/attendance/${removing._id}`, { data: { reason } }),
    {
      invalidate: INV,
      success: 'Attendance record removed (audited)',
      onSuccess: () => setRemoving(null)
    }
  );
  return (
    <Card
      title={`Check-ins — ${session.name}`}
      description='Remove a record only to correct a mistake; the original is kept in the audit log.'
      actions={
        <>
          <Select
            className='w-48'
            value={teamId}
            onChange={(e) => {
              setTeamId(e.target.value);
              setPage(1);
            }}
            placeholder='All teams'
            options={teams.options}
          />
          <Select
            className='w-36'
            value={method}
            onChange={(e) => {
              setMethod(e.target.value);
              setPage(1);
            }}
            placeholder='Any method'
            options={['SCAN', 'MANUAL']}
          />
        </>
      }
      bodyClass='p-0'
    >
      {list.isLoading ? (
        <Loading />
      ) : list.isError ? (
        <ErrorState error={list.error} onRetry={list.refetch} />
      ) : !list.data.items.length ? (
        <EmptyState icon={ScanLine} title='No check-ins yet' />
      ) : (
        <>
          <Table
            head={
              <>
                <Th>Participant</Th>
                <Th>Team</Th>
                <Th>Ticket</Th>
                <Th>Checked in</Th>
                <Th>Method</Th>
                <Th>By</Th>
                <Th>Notes</Th>
                <Th />
              </>
            }
          >
            {list.data.items.map((a: Json) => (
              <tr key={a._id}>
                <Td>
                  <b>{a.participantId?.fullName || 'Deleted'}</b>
                  <span className='block text-xs text-[#98A2B3]'>{a.participantId?.memberId}</span>
                </Td>
                <Td>{a.teamId?.name}</Td>
                <Td className='font-mono text-xs'>{a.ticketCode || '—'}</Td>
                <Td className='whitespace-nowrap text-xs'>{fmtDateTime(a.checkedInAt)}</Td>
                <Td>
                  <Badge status={a.method} />
                </Td>
                <Td className='text-xs'>{a.checkedInBy?.name}</Td>
                <Td className='max-w-48 truncate text-xs' title={a.notes}>
                  {a.notes || '—'}
                </Td>
                <Td className='text-right'>
                  <IconButton
                    icon={UserMinus}
                    label='Remove (correction)'
                    className='hover:text-red-600'
                    onClick={() => setRemoving(a)}
                  />
                </Td>
              </tr>
            ))}
          </Table>
          <Pagination {...list.data} onPage={setPage} />
        </>
      )}
      <ConfirmDialog
        open={!!removing}
        onClose={() => setRemoving(null)}
        title='Remove attendance record?'
        tone='danger'
        confirmLabel='Remove record'
        reasonLabel='Reason for correction'
        loading={remove.isPending}
        onConfirm={(r) => remove.mutate(r)}
        message={
          <>
            Remove <b>{removing?.participantId?.fullName}</b>'s check-in for this session? They can
            be checked in again afterwards.
          </>
        }
      />
    </Card>
  );
}

export default function Sessions() {
  const { event } = useEvent();
  const list = useEventQuery('sessions', '/sessions', undefined, { refetchInterval: 15000 });
  const [editing, setEditing] = useState<Json>(null);
  const [deleting, setDeleting] = useState<Json>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const setStatus = useAction(
    ({ id, status }: { id: string; status: string }) => api.put(`/sessions/${id}`, { status }),
    { invalidate: INV, success: (_d, v) => `Session ${v.status.toLowerCase()}` }
  );
  const del = useAction((id: string) => api.delete(`/sessions/${id}`), {
    invalidate: INV,
    success: 'Session deleted',
    onSuccess: () => setDeleting(null)
  });
  const items: Json[] = list.data?.items || [];
  const selected =
    items.find((s) => s._id === selectedId) || items.find((s) => s.status === 'ACTIVE') || items[0];

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Attendance Sessions'
        description='Each participant can check in once per session; sessions are independent.'
        actions={
          <>
            <Link to={p('/check-in')}>
              <Button variant='secondary' icon={ScanLine}>
                Open scanner
              </Button>
            </Link>
            <Button icon={Plus} onClick={() => setEditing('new')}>
              New session
            </Button>
          </>
        }
      />
      <Card bodyClass='p-0'>
        {list.isLoading ? (
          <Loading />
        ) : list.isError ? (
          <ErrorState error={list.error} onRetry={list.refetch} />
        ) : !items.length ? (
          <EmptyState
            icon={Clock}
            title='No sessions yet'
            description='Create a session for each day or activity you want to track (e.g. Day 1 – Registration).'
            action={
              <Button icon={Plus} onClick={() => setEditing('new')}>
                New session
              </Button>
            }
          />
        ) : (
          <Table
            head={
              <>
                <Th>Session</Th>
                <Th>Opens</Th>
                <Th>Closes</Th>
                <Th>Status</Th>
                <Th>Check-in</Th>
                <Th>Checked in</Th>
                <Th className='text-right'>Actions</Th>
              </>
            }
          >
            {items.map((s) => (
              <tr
                key={s._id}
                className={`cursor-pointer hover:bg-[#F9FAFB] ${selected?._id === s._id ? 'bg-[#E6F6EC]/40' : ''}`}
                onClick={() => setSelectedId(s._id)}
              >
                <Td>
                  <b>{s.name}</b>
                  {s.description && (
                    <span className='block text-xs text-[#667085]'>{s.description}</span>
                  )}
                  <span className='block text-xs text-[#98A2B3]'>
                    {s.enforceTimeWindow ? 'Time window enforced' : 'Manual open/close'}
                    {s.allowManualCheckIn ? '' : ' · manual check-in off'}
                  </span>
                </Td>
                <Td className='whitespace-nowrap text-xs'>
                  {fmtDateTime(s.startTime, event?.timezone)}
                </Td>
                <Td className='whitespace-nowrap text-xs'>
                  {fmtDateTime(s.endTime, event?.timezone)}
                </Td>
                <Td>
                  <Badge status={s.status} />
                </Td>
                <Td>
                  {s.openState?.open ? (
                    <Badge tone='green'>Open</Badge>
                  ) : (
                    <span className='text-xs text-[#667085]'>{s.openState?.reason}</span>
                  )}
                </Td>
                <Td className='font-semibold tabular-nums'>{s.checkedIn}</Td>
                <Td className='whitespace-nowrap text-right' onClick={(e) => e.stopPropagation()}>
                  {s.status !== 'ACTIVE' && (
                    <Button
                      size='sm'
                      variant='secondary'
                      icon={Play}
                      loading={setStatus.isPending && setStatus.variables?.id === s._id}
                      onClick={() => setStatus.mutate({ id: s._id, status: 'ACTIVE' })}
                    >
                      Activate
                    </Button>
                  )}
                  {s.status === 'ACTIVE' && (
                    <Button
                      size='sm'
                      variant='secondary'
                      icon={Square}
                      loading={setStatus.isPending && setStatus.variables?.id === s._id}
                      onClick={() => setStatus.mutate({ id: s._id, status: 'CLOSED' })}
                    >
                      Close
                    </Button>
                  )}
                  <IconButton icon={Pencil} label='Edit' onClick={() => setEditing(s)} />
                  <IconButton
                    icon={Trash2}
                    label='Delete'
                    className='hover:text-red-600'
                    onClick={() => setDeleting(s)}
                  />
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
      {selected && <AttendanceRecords key={selected._id} session={selected} />}
      {editing && (
        <SessionForm
          open
          onClose={() => setEditing(null)}
          session={editing === 'new' ? null : editing}
        />
      )}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title='Delete session?'
        tone='danger'
        confirmLabel='Delete'
        loading={del.isPending}
        onConfirm={() => del.mutate(deleting._id)}
        message='Sessions that already have check-ins cannot be deleted — close them instead.'
      />
    </div>
  );
}
