import { useState, type ChangeEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileSpreadsheet, FileText, FileBarChart, RefreshCw } from 'lucide-react';
import { clean, download, get } from '../../lib/api';
import { useEventQuery, useSessionOptions, useTeamOptions, withToast } from '../../lib/hooks';
import { useEvent } from '../../context/EventContext';
import { fromLocalInput } from '../../lib/format';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Field,
  Input,
  Loading,
  PageHeader,
  Select,
  Table,
  Td,
  Th,
  useDebounced
} from '../../components/ui';
import { RSVP_FILTER } from './Participants';
import type { Json } from '../../lib/types';

// which filters make sense for each report
const FILTERS: Record<string, string[]> = {
  teams: ['session', 'team'],
  participants: ['session', 'team', 'rsvp', 'attendance', 'q', 'dates'],
  rsvp: ['team', 'rsvp', 'q', 'dates'],
  confirmed: ['session', 'team', 'attendance', 'q', 'dates'],
  declined: ['team', 'q', 'dates'],
  pending: ['team', 'q', 'dates'],
  expired: ['team', 'q', 'dates'],
  tickets: ['team', 'ticket', 'dates'],
  'email-failures': ['team', 'dates'],
  attendance: ['session', 'team', 'q', 'dates'],
  'team-attendance': ['session', 'team'],
  'session-attendance': ['session', 'team']
};

export default function Reports() {
  const { events, eventId, setEventId, event } = useEvent();
  const types = useQuery({ queryKey: ['report-types'], queryFn: () => get('/reports') });
  const sessions = useSessionOptions();
  const teams = useTeamOptions();
  const [type, setType] = useState('participants');
  const [f, setF] = useState({
    sessionId: '',
    teamId: '',
    rsvpStatus: '',
    attendance: '',
    ticketStatus: '',
    q: '',
    from: '',
    to: ''
  });
  const q = useDebounced(f.q);
  const [busy, setBusy] = useState('');
  const allowed = FILTERS[type] || [];
  const params = clean({
    sessionId: allowed.includes('session') ? f.sessionId : '',
    teamId: allowed.includes('team') ? f.teamId : '',
    rsvpStatus: allowed.includes('rsvp') ? f.rsvpStatus : '',
    attendance: allowed.includes('attendance') ? f.attendance : '',
    ticketStatus: allowed.includes('ticket') ? f.ticketStatus : '',
    q: allowed.includes('q') ? q : '',
    from:
      allowed.includes('dates') && f.from ? fromLocalInput(`${f.from}T00:00`, event?.timezone) : '',
    to: allowed.includes('dates') && f.to ? fromLocalInput(`${f.to}T23:59`, event?.timezone) : ''
  });
  const preview = useEventQuery('report', `/reports/${type}`, {
    ...params,
    format: 'json',
    limit: 100
  });
  const set =
    (k: keyof typeof f) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setF((p) => ({ ...p, [k]: e.target.value }));

  async function exportAs(format: 'csv' | 'xlsx') {
    setBusy(format);
    try {
      await withToast(download(`/reports/${type}`, { ...params, format }, `${type}.${format}`));
    } catch {
      /* toasted */
    } finally {
      setBusy('');
    }
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Reports'
        description='Preview any report, then export exactly what you see (with the selected filters) to CSV or Excel.'
      />
      <Card>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <Field label='Report'>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={Object.entries<string>(
                types.data?.types || { participants: 'All participants' }
              ).map(([value, label]) => ({ value, label }))}
            />
          </Field>
          <Field label='Event'>
            <Select
              value={eventId || ''}
              onChange={(e) => setEventId(e.target.value)}
              options={events.map((e) => ({ value: e._id, label: e.name }))}
            />
          </Field>
          {allowed.includes('session') && (
            <Field label='Session'>
              <Select
                value={f.sessionId}
                onChange={set('sessionId')}
                placeholder='All / any session'
                options={sessions.options}
              />
            </Field>
          )}
          {allowed.includes('team') && (
            <Field label='Team'>
              <Select
                value={f.teamId}
                onChange={set('teamId')}
                placeholder='All teams'
                options={teams.options}
              />
            </Field>
          )}
          {allowed.includes('rsvp') && (
            <Field label='RSVP status'>
              <Select
                value={f.rsvpStatus}
                onChange={set('rsvpStatus')}
                placeholder='Any'
                options={RSVP_FILTER}
              />
            </Field>
          )}
          {allowed.includes('attendance') && (
            <Field label='Attendance'>
              <Select
                value={f.attendance}
                onChange={set('attendance')}
                placeholder='Any'
                options={[
                  { value: 'CHECKED_IN', label: 'Checked in' },
                  { value: 'NOT_CHECKED_IN', label: 'Not checked in' }
                ]}
              />
            </Field>
          )}
          {allowed.includes('ticket') && (
            <Field label='Ticket status'>
              <Select
                value={f.ticketStatus}
                onChange={set('ticketStatus')}
                placeholder='Any'
                options={['ACTIVE', 'REVOKED']}
              />
            </Field>
          )}
          {allowed.includes('q') && (
            <Field label='Participant / search'>
              <Input value={f.q} onChange={set('q')} placeholder='Name, email, team…' />
            </Field>
          )}
          {allowed.includes('dates') && (
            <>
              <Field label='From date'>
                <Input type='date' value={f.from} onChange={set('from')} />
              </Field>
              <Field label='To date'>
                <Input type='date' value={f.to} onChange={set('to')} />
              </Field>
            </>
          )}
        </div>
        <div className='mt-5 flex flex-wrap justify-end gap-2 border-t border-[#F2F4F7] pt-4'>
          <Button
            variant='ghost'
            onClick={() =>
              setF({
                sessionId: '',
                teamId: '',
                rsvpStatus: '',
                attendance: '',
                ticketStatus: '',
                q: '',
                from: '',
                to: ''
              })
            }
          >
            Clear filters
          </Button>
          <Button
            variant='secondary'
            icon={FileText}
            loading={busy === 'csv'}
            onClick={() => exportAs('csv')}
          >
            Export CSV
          </Button>
          <Button icon={FileSpreadsheet} loading={busy === 'xlsx'} onClick={() => exportAs('xlsx')}>
            Export Excel
          </Button>
        </div>
      </Card>

      <Card
        title={preview.data ? `${preview.data.title} — ${preview.data.total} row(s)` : 'Preview'}
        description={
          preview.data && preview.data.total > preview.data.rows.length
            ? `Showing the first ${preview.data.rows.length}; exports include all rows.`
            : undefined
        }
        actions={
          <Button
            size='sm'
            variant='ghost'
            icon={RefreshCw}
            loading={preview.isFetching}
            onClick={() => preview.refetch()}
          >
            Refresh
          </Button>
        }
        bodyClass='p-0'
      >
        {preview.isLoading ? (
          <Loading />
        ) : preview.isError ? (
          <ErrorState error={preview.error} onRetry={preview.refetch} />
        ) : !preview.data.rows.length ? (
          <EmptyState icon={FileBarChart} title='No rows match these filters' />
        ) : (
          <Table
            head={preview.data.columns.map((c: Json) => (
              <Th key={c.key} className='whitespace-nowrap'>
                {c.header}
              </Th>
            ))}
          >
            {preview.data.rows.map((r: Json, i: number) => (
              <tr key={i}>
                {preview.data.columns.map((c: Json) => (
                  <Td key={c.key} className='whitespace-nowrap text-xs'>
                    {r[c.key] === undefined || r[c.key] === null || r[c.key] === ''
                      ? '—'
                      : String(r[c.key])}
                  </Td>
                ))}
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
}
