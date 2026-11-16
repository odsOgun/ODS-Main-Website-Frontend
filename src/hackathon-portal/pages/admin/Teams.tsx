import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Users, Pencil, Trash2, FileUp } from 'lucide-react';
import { api, clean } from '../../lib/api';
import { useAction, useEventQuery, useSessionOptions } from '../../lib/hooks';
import { p } from '../../lib/paths';
import type { Json } from '../../lib/types';
import {
  Badge,
  Button,
  Card,
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
  SortHeader,
  Table,
  Td,
  Textarea,
  Th,
  useDebounced
} from '../../components/ui';

interface TeamFormModalProps {
  open: boolean;
  onClose: () => void;
  team?: Json | null;
}

// eslint-disable-next-line react-refresh/only-export-components
export function TeamFormModal({ open, onClose, team }: TeamFormModalProps) {
  const [f, setF] = useState({ name: team?.name || '', description: team?.description || '' });
  const save = useAction(
    (b: { name: string; description: string }) =>
      team ? api.put(`/teams/${team.id || team._id}`, b) : api.post('/teams', b),
    {
      invalidate: ['teams', 'team', 'teams-options', 'dashboard'],
      success: team ? 'Team updated' : 'Team created',
      onSuccess: onClose
    }
  );
  return (
    <Modal open={open} onClose={onClose} title={team ? 'Edit team' : 'New team'} size='sm'>
      <form
        className='space-y-4'
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate(f);
        }}
      >
        <Field label='Team name' required>
          <Input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        </Field>
        <Field label='Description'>
          <Textarea
            value={f.description}
            onChange={(e) => setF({ ...f, description: e.target.value })}
            className='min-h-16'
          />
        </Field>
        <div className='flex justify-end gap-2'>
          <Button variant='secondary' onClick={onClose}>
            Cancel
          </Button>
          <Button type='submit' loading={save.isPending}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default function Teams() {
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const search = useDebounced(q);
  const [sessionId, setSessionId] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [editing, setEditing] = useState<Json | 'new' | null>(null);
  const [deleting, setDeleting] = useState<Json | null>(null);
  const sessions = useSessionOptions();
  const params = clean({
    q: search,
    sessionId,
    status: sessionId ? status : '',
    sort,
    page,
    limit
  });
  const teams = useEventQuery('teams', '/teams', params);
  const del = useAction((id: string) => api.delete(`/teams/${id}`), {
    invalidate: ['teams', 'teams-options', 'dashboard', 'participants'],
    success: (r) => `Team deleted (${r.data.participantsDeleted} participant(s) removed)`,
    onSuccess: () => setDeleting(null)
  });
  const onSort = (s: string) => {
    setSort(s);
    setPage(1);
  };

  return (
    <div>
      <PageHeader
        title='Teams'
        description='Team-level RSVP, ticket and attendance monitoring. Click a team to see each member.'
        actions={
          <Button icon={Plus} onClick={() => setEditing('new')}>
            New team
          </Button>
        }
      />
      <Card bodyClass='p-0'>
        <div className='flex flex-wrap items-center gap-3 border-b border-[#F2F4F7] p-4'>
          <div className='relative min-w-56 flex-1'>
            <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98A2B3]' />
            <Input
              className='pl-9'
              placeholder='Search teams…'
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            className='w-60'
            value={sessionId}
            onChange={(e) => {
              setSessionId(e.target.value);
              setPage(1);
            }}
            placeholder='Attendance: any session'
            options={sessions.options.map((o) => ({ ...o, label: `Attendance: ${o.label}` }))}
          />
          {sessionId && (
            <Select
              className='w-48'
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              placeholder='All teams'
              options={[
                { value: 'FULL', label: 'Fully checked in' },
                { value: 'INCOMPLETE', label: 'Incomplete' }
              ]}
            />
          )}
        </div>
        {teams.isLoading ? (
          <Loading />
        ) : teams.isError ? (
          <ErrorState error={teams.error} onRetry={teams.refetch} />
        ) : !teams.data.items.length ? (
          <EmptyState
            icon={Users}
            title={search ? 'No teams match your search' : 'No teams yet'}
            description={search ? undefined : 'Import your CSV or create teams manually.'}
            action={
              !search && (
                <Button icon={FileUp} onClick={() => nav(p('/import'))}>
                  Import CSV
                </Button>
              )
            }
          />
        ) : (
          <>
            <Table
              head={
                <>
                  <SortHeader label='Team' field='name' sort={sort} onSort={onSort} />
                  <SortHeader label='Members' field='members' sort={sort} onSort={onSort} />
                  <SortHeader label='Confirmed' field='confirmed' sort={sort} onSort={onSort} />
                  <SortHeader label='Declined' field='declined' sort={sort} onSort={onSort} />
                  <SortHeader label='Pending' field='pending' sort={sort} onSort={onSort} />
                  <SortHeader
                    label='Tickets gen.'
                    field='ticketsGenerated'
                    sort={sort}
                    onSort={onSort}
                  />
                  <SortHeader
                    label='Tickets sent'
                    field='ticketsSent'
                    sort={sort}
                    onSort={onSort}
                  />
                  <SortHeader label='Checked in' field='checkedIn' sort={sort} onSort={onSort} />
                  <SortHeader label='Not in' field='notCheckedIn' sort={sort} onSort={onSort} />
                  <SortHeader
                    label='Attendance'
                    field='attendancePct'
                    sort={sort}
                    onSort={onSort}
                  />
                  <Th className='text-right'>Actions</Th>
                </>
              }
            >
              {teams.data.items.map((t: Json) => (
                <tr
                  key={t.id}
                  className='cursor-pointer hover:bg-[#F9FAFB]'
                  onClick={() => nav(p(`/teams/${t.id}`))}
                >
                  <Td>
                    <b>{t.name}</b>
                    {t.fullyCheckedIn && (
                      <Badge tone='green' className='ml-2'>
                        Fully checked in
                      </Badge>
                    )}
                    {(t.expired > 0 || t.notInvited > 0) && (
                      <span className='block text-xs text-[#667085]'>
                        {t.notInvited ? `${t.notInvited} not invited` : ''}
                        {t.notInvited && t.expired ? ' · ' : ''}
                        {t.expired ? `${t.expired} expired` : ''}
                      </span>
                    )}
                  </Td>
                  <Td className='tabular-nums'>
                    {t.active}
                    {t.members !== t.active && (
                      <span className='text-xs text-[#98A2B3]'> /{t.members}</span>
                    )}
                  </Td>
                  <Td className='tabular-nums text-[#008A43]'>{t.confirmed}</Td>
                  <Td className='tabular-nums text-red-700'>{t.declined}</Td>
                  <Td className='tabular-nums text-amber-700'>{t.pending}</Td>
                  <Td className='tabular-nums'>{t.ticketsGenerated}</Td>
                  <Td className='tabular-nums'>{t.ticketsSent}</Td>
                  <Td className='tabular-nums font-semibold'>{t.checkedIn}</Td>
                  <Td className='tabular-nums'>{t.notCheckedIn}</Td>
                  <Td className='tabular-nums'>{t.attendancePct}%</Td>
                  <Td className='whitespace-nowrap text-right' onClick={(e) => e.stopPropagation()}>
                    <IconButton icon={Pencil} label='Edit team' onClick={() => setEditing(t)} />
                    <IconButton
                      icon={Trash2}
                      label='Delete team'
                      className='hover:text-red-600'
                      onClick={() => setDeleting(t)}
                    />
                  </Td>
                </tr>
              ))}
            </Table>
            <Pagination
              {...teams.data}
              onPage={setPage}
              onLimit={(l) => {
                setLimit(l);
                setPage(1);
              }}
            />
          </>
        )}
      </Card>
      {editing && (
        <TeamFormModal
          open
          onClose={() => setEditing(null)}
          team={editing === 'new' ? null : editing}
        />
      )}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title='Delete team?'
        tone='danger'
        confirmLabel='Delete team and members'
        loading={del.isPending}
        message={
          <>
            This permanently deletes <b>{deleting?.name}</b> and its {deleting?.members} member(s),
            including their RSVPs and tickets. Teams with check-in records cannot be deleted —
            deactivate members instead.
          </>
        }
        onConfirm={() => del.mutate(deleting.id)}
      />
    </div>
  );
}
