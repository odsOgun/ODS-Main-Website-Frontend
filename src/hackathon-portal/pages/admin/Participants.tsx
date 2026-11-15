import { useState, type ChangeEvent } from 'react';
import { Plus, Search, UserRound, Download } from 'lucide-react';
import { clean, download } from '../../lib/api';
import { useEventQuery, useSessionOptions, useTeamOptions, withToast } from '../../lib/hooks';
import { fmtDateTime } from '../../lib/format';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Input,
  Loading,
  PageHeader,
  Pagination,
  Select,
  SortHeader,
  StatusBadge,
  Table,
  Td,
  Th,
  useDebounced
} from '../../components/ui';
import ParticipantForm from '../../components/ParticipantForm';
import ParticipantDrawer from '../../components/ParticipantDrawer';
import type { Json } from '../../lib/types';

export const RSVP_FILTER = [
  'NOT_INVITED',
  'PENDING',
  'CONFIRMED',
  'DECLINED',
  'EXPIRED',
  'CANCELLED'
];

export default function Participants() {
  const [q, setQ] = useState('');
  const search = useDebounced(q);
  const [f, setF] = useState({
    teamId: '',
    rsvpStatus: '',
    attendance: '',
    ticketStatus: '',
    active: '',
    sessionId: ''
  });
  const [sort, setSort] = useState('fullName');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [adding, setAdding] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const teams = useTeamOptions();
  const sessions = useSessionOptions();
  const params = clean({ q: search, ...f, sort, page, limit });
  const list = useEventQuery('participants', '/participants', params);
  const setFilter =
    (k: keyof typeof f) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setF((p) => ({ ...p, [k]: e.target.value }));
      setPage(1);
    };
  const onSort = (s: string) => {
    setSort(s);
    setPage(1);
  };

  async function exportCsv() {
    setExporting(true);
    try {
      await withToast(
        download(
          '/reports/participants',
          clean({ format: 'xlsx', q: search, ...f }),
          'participants.xlsx'
        )
      );
    } catch {
      /* toasted */
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title='Participants'
        description='Every participant RSVPs, receives a ticket and checks in individually.'
        actions={
          <>
            <Button variant='secondary' icon={Download} loading={exporting} onClick={exportCsv}>
              Export (Excel)
            </Button>
            <Button icon={Plus} onClick={() => setAdding(true)}>
              Add participant
            </Button>
          </>
        }
      />
      <Card bodyClass='p-0'>
        <div className='grid gap-3 border-b border-[#F2F4F7] p-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7'>
          <div className='relative sm:col-span-2 lg:col-span-4 xl:col-span-2'>
            <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98A2B3]' />
            <Input
              className='pl-9'
              placeholder='Search name, email, team, ID, ticket…'
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={f.teamId}
            onChange={setFilter('teamId')}
            placeholder='All teams'
            options={teams.options}
          />
          <Select
            value={f.rsvpStatus}
            onChange={setFilter('rsvpStatus')}
            placeholder='Any RSVP status'
            options={RSVP_FILTER}
          />
          <Select
            value={f.ticketStatus}
            onChange={setFilter('ticketStatus')}
            placeholder='Any ticket'
            options={[
              { value: 'ACTIVE', label: 'Ticket active' },
              { value: 'REVOKED', label: 'Ticket revoked' },
              { value: 'NONE', label: 'No ticket' }
            ]}
          />
          <Select
            value={f.sessionId}
            onChange={setFilter('sessionId')}
            placeholder='Attendance: any session'
            options={sessions.options}
          />
          <Select
            value={f.attendance}
            onChange={setFilter('attendance')}
            placeholder='Any attendance'
            options={[
              { value: 'CHECKED_IN', label: 'Checked in' },
              { value: 'NOT_CHECKED_IN', label: 'Not checked in' }
            ]}
          />
          <Select
            value={f.active}
            onChange={setFilter('active')}
            placeholder='Active & inactive'
            options={[
              { value: 'true', label: 'Active only' },
              { value: 'false', label: 'Inactive only' }
            ]}
          />
        </div>
        {list.isLoading ? (
          <Loading />
        ) : list.isError ? (
          <ErrorState error={list.error} onRetry={list.refetch} />
        ) : !list.data.items.length ? (
          <EmptyState
            icon={UserRound}
            title='No participants found'
            description='Adjust the filters, import a CSV or add participants manually.'
          />
        ) : (
          <>
            <Table
              head={
                <>
                  <SortHeader label='Participant' field='fullName' sort={sort} onSort={onSort} />
                  <SortHeader label='Email' field='email' sort={sort} onSort={onSort} />
                  <SortHeader label='Team' field='teamName' sort={sort} onSort={onSort} />
                  <SortHeader label='RSVP' field='rsvpStatus' sort={sort} onSort={onSort} />
                  <SortHeader label='Responded' field='responseDate' sort={sort} onSort={onSort} />
                  <SortHeader label='Ticket ID' field='ticketId' sort={sort} onSort={onSort} />
                  <Th>Ticket</Th>
                  <Th>Last email</Th>
                  <SortHeader label='Check-in' field='checkInTime' sort={sort} onSort={onSort} />
                  <Th>Session</Th>
                </>
              }
            >
              {list.data.items.map((p: Json) => (
                <tr
                  key={p.id}
                  className='cursor-pointer hover:bg-[#F9FAFB]'
                  onClick={() => setOpenId(p.id)}
                >
                  <Td>
                    <b>{p.fullName}</b>
                    {!p.isActive && (
                      <Badge tone='slate' className='ml-2'>
                        Inactive
                      </Badge>
                    )}
                    <span className='block text-xs text-[#98A2B3]'>
                      {p.memberId}
                      {p.teamRole ? ` · ${p.teamRole}` : ''}
                    </span>
                  </Td>
                  <Td className='max-w-56 truncate text-[#475467]'>
                    {p.email || <span className='text-amber-700'>No email</span>}
                  </Td>
                  <Td>{p.teamName}</Td>
                  <Td>
                    <StatusBadge status={p.rsvpStatus} />
                  </Td>
                  <Td className='whitespace-nowrap text-xs'>{fmtDateTime(p.responseDate)}</Td>
                  <Td className='font-mono text-xs'>{p.ticketId || '—'}</Td>
                  <Td>
                    {p.ticketStatus ? (
                      <span className='flex gap-1'>
                        <Badge status={p.ticketStatus} />
                        {p.ticketStatus === 'ACTIVE' && <Badge status={p.ticketEmailStatus} />}
                      </span>
                    ) : (
                      '—'
                    )}
                  </Td>
                  <Td>
                    {p.lastEmailStatus ? (
                      <span title={p.lastEmailType}>
                        <Badge status={p.lastEmailStatus} />
                      </span>
                    ) : (
                      '—'
                    )}
                  </Td>
                  <Td className='whitespace-nowrap text-xs'>
                    {p.checkedIn ? (
                      <span className='font-medium text-[#008A43]'>
                        {fmtDateTime(p.checkInTime)}
                      </span>
                    ) : (
                      <span className='text-[#98A2B3]'>Not checked in</span>
                    )}
                  </Td>
                  <Td className='text-xs'>
                    {p.checkInSession || '—'}
                    {p.sessionsAttended > 1 && (
                      <span className='text-[#98A2B3]'> (+{p.sessionsAttended - 1})</span>
                    )}
                  </Td>
                </tr>
              ))}
            </Table>
            <Pagination
              {...list.data}
              onPage={setPage}
              onLimit={(l) => {
                setLimit(l);
                setPage(1);
              }}
            />
          </>
        )}
      </Card>
      {adding && <ParticipantForm open onClose={() => setAdding(false)} />}
      <ParticipantDrawer participantId={openId} onClose={() => setOpenId(null)} />
    </div>
  );
}
