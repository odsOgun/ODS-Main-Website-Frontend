import { Fragment, useState, type ChangeEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronRight, ScrollText } from 'lucide-react';
import { get, clean } from '../../lib/api';
import { useEvent } from '../../context/EventContext';
import { fmtDateTime, fromLocalInput } from '../../lib/format';
import {
  Badge,
  Card,
  Checkbox,
  EmptyState,
  ErrorState,
  Field,
  Input,
  Loading,
  PageHeader,
  Pagination,
  Select,
  Table,
  Td,
  Th
} from '../../components/ui';
import type { Json } from '../../lib/types';

const ENTITIES = [
  'Event',
  'Team',
  'Participant',
  'Rsvp',
  'Ticket',
  'Campaign',
  'ImportBatch',
  'AttendanceSession',
  'Attendance',
  'EmailLog',
  'User',
  'Report'
];

export default function AuditLogs() {
  const { eventId, event } = useEvent();
  const [f, setF] = useState({ action: '', entityType: '', from: '', to: '' });
  const [onlyEvent, setOnlyEvent] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const params = clean({
    ...f,
    from: f.from ? fromLocalInput(`${f.from}T00:00`, event?.timezone) : '',
    to: f.to ? fromLocalInput(`${f.to}T23:59`, event?.timezone) : '',
    eventId: onlyEvent ? eventId : '',
    page,
    limit
  });
  const q = useQuery({
    queryKey: ['audit', params],
    queryFn: () => get('/admin/audit-logs', params),
    placeholderData: (prev: Json) => prev,
    refetchInterval: 20000
  });
  const set =
    (k: keyof typeof f) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setF((p) => ({ ...p, [k]: e.target.value }));
      setPage(1);
    };

  return (
    <div>
      <PageHeader
        title='Audit Logs'
        description='Every administrative action, RSVP change, manual check-in and correction — who, what and when.'
      />
      <Card bodyClass='p-0'>
        <div className='grid gap-3 border-b border-[#F2F4F7] p-4 sm:grid-cols-2 lg:grid-cols-5'>
          <Field label='Action'>
            <Select
              value={f.action}
              onChange={set('action')}
              placeholder='All actions'
              options={(q.data?.actions || []).map((a: string) => ({ value: a, label: a }))}
            />
          </Field>
          <Field label='Entity'>
            <Select
              value={f.entityType}
              onChange={set('entityType')}
              placeholder='All entities'
              options={ENTITIES.map((e) => ({ value: e, label: e }))}
            />
          </Field>
          <Field label='From'>
            <Input type='date' value={f.from} onChange={set('from')} />
          </Field>
          <Field label='To'>
            <Input type='date' value={f.to} onChange={set('to')} />
          </Field>
          <div className='flex items-end pb-2'>
            <Checkbox
              label='Current event + global only'
              checked={onlyEvent}
              onChange={(e) => {
                setOnlyEvent(e.target.checked);
                setPage(1);
              }}
            />
          </div>
        </div>
        {q.isLoading ? (
          <Loading />
        ) : q.isError ? (
          <ErrorState error={q.error} onRetry={q.refetch} />
        ) : !q.data.items.length ? (
          <EmptyState icon={ScrollText} title='No audit entries' />
        ) : (
          <>
            <Table
              head={
                <>
                  <Th />
                  <Th>Time</Th>
                  <Th>User</Th>
                  <Th>Action</Th>
                  <Th>Entity</Th>
                  <Th>IP</Th>
                </>
              }
            >
              {q.data.items.map((a: Json) => (
                <Fragment key={a._id}>
                  <tr
                    className='cursor-pointer hover:bg-[#F9FAFB]'
                    onClick={() => setOpen((o) => ({ ...o, [a._id]: !o[a._id] }))}
                  >
                    <Td className='w-8'>
                      {a.details ? (
                        open[a._id] ? (
                          <ChevronDown className='size-4' />
                        ) : (
                          <ChevronRight className='size-4' />
                        )
                      ) : null}
                    </Td>
                    <Td className='whitespace-nowrap text-xs'>{fmtDateTime(a.timestamp)}</Td>
                    <Td className='text-xs'>
                      <span className='block max-w-56 truncate'>{a.userName}</span>
                      <Badge status={a.userRole} />
                    </Td>
                    <Td>
                      <span
                        className={`font-mono text-xs font-semibold ${/FAILED|DELETED|REVOKED|CORRECTED/.test(a.action) ? 'text-red-700' : 'text-[#1D2939]'}`}
                      >
                        {a.action}
                      </span>
                    </Td>
                    <Td className='text-xs'>
                      {a.entityType}
                      <span className='block font-mono text-[10px] text-[#98A2B3]'>
                        {a.entityId}
                      </span>
                    </Td>
                    <Td className='text-xs text-[#667085]'>{a.ip}</Td>
                  </tr>
                  {open[a._id] && a.details && (
                    <tr>
                      <td colSpan={6} className='bg-[#F9FAFB] px-4 py-3'>
                        <pre className='max-h-80 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-[#101612] p-3 text-xs text-[#F2F4F7]'>
                          {JSON.stringify(a.details, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </Table>
            <Pagination
              {...q.data}
              onPage={setPage}
              onLimit={(l: number) => {
                setLimit(l);
                setPage(1);
              }}
            />
          </>
        )}
      </Card>
    </div>
  );
}
