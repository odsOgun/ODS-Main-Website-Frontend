import { useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  Users,
  UserRound,
  Ratio,
  Send,
  CheckCircle2,
  XCircle,
  Hourglass,
  CalendarX,
  Ticket,
  MailCheck,
  MailX,
  Clock,
  Ban,
  ScanLine,
  UserX,
  Percent,
  ShieldCheck,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { get } from '../../lib/api';
import { useEvent } from '../../context/EventContext';
import { p } from '../../lib/paths';
import type { Json } from '../../lib/types';
import { fmtDateTime, timeAgo } from '../../lib/format';
import {
  Badge,
  Card,
  EmptyState,
  ErrorState,
  Loading,
  PageHeader,
  Select,
  StatCard,
  Button
} from '../../components/ui';

const RSVP_COLORS: Record<string, string> = {
  Confirmed: '#00A651',
  Declined: '#FF5C5C',
  Pending: '#F4D35E',
  Expired: '#98A2B3',
  'Not invited': '#8E44AD'
};

function Group({ title, children, to }: { title: ReactNode; children: ReactNode; to?: string }) {
  return (
    <div>
      <div className='mb-2 flex items-center justify-between'>
        <h2 className='text-sm font-semibold uppercase tracking-wide text-[#667085]'>{title}</h2>
        {to && (
          <Link to={to} className='text-xs font-medium text-[#009E49] hover:underline'>
            View details →
          </Link>
        )}
      </div>
      <div className='grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5'>{children}</div>
    </div>
  );
}

function ActivityList({
  items,
  render,
  empty
}: {
  items: Json[];
  render: (item: Json) => ReactNode;
  empty: string;
}) {
  if (!items.length) return <p className='py-6 text-center text-sm text-[#667085]'>{empty}</p>;
  return <ul className='divide-y divide-[#F2F4F7]'>{items.map(render)}</ul>;
}

export default function Dashboard() {
  const { eventId, event } = useEvent();
  const [sessionId, setSessionId] = useState('');
  const sessions = useQuery<Json>({
    queryKey: ['sessions', eventId],
    queryFn: () => get('/sessions'),
    enabled: !!eventId
  });
  const ov = useQuery<Json>({
    queryKey: ['dashboard', eventId, sessionId],
    queryFn: () => get('/dashboard/overview', sessionId ? { sessionId } : {}),
    enabled: !!eventId,
    refetchInterval: 15000,
    placeholderData: (prev: Json) => prev
  });
  const act = useQuery<Json>({
    queryKey: ['activity', eventId],
    queryFn: () => get('/dashboard/activity'),
    enabled: !!eventId,
    refetchInterval: 15000
  });

  if (ov.isLoading) return <Loading label='Loading dashboard…' />;
  if (ov.isError) return <ErrorState error={ov.error} onRetry={ov.refetch} />;
  const d: Json = ov.data;
  const rsvpData = [
    { name: 'Confirmed', value: d.rsvp.confirmed },
    { name: 'Declined', value: d.rsvp.declined },
    { name: 'Pending', value: d.rsvp.pending },
    { name: 'Expired', value: d.rsvp.expired },
    { name: 'Not invited', value: d.rsvp.notInvited }
  ].filter((x) => x.value > 0);
  const sessName = sessions.data?.items.find((s: Json) => s._id === sessionId)?.name;

  return (
    <div className='space-y-8'>
      <PageHeader
        title='Dashboard'
        description={
          event
            ? `${event.name} · live figures from the database, refreshed every 15 seconds`
            : undefined
        }
        actions={
          <>
            <Select
              className='w-64'
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder='Attendance: any session'
              options={(sessions.data?.items || []).map((s: Json) => ({
                value: s._id,
                label: `Attendance: ${s.name}`
              }))}
            />
            <Button
              variant='secondary'
              icon={RefreshCw}
              onClick={() => {
                ov.refetch();
                act.refetch();
              }}
              loading={ov.isFetching}
            >
              Refresh
            </Button>
          </>
        }
      />

      {d.teams.participants === 0 && (
        <Card>
          <EmptyState
            icon={Users}
            title='No participants yet'
            description='Import your teams CSV to get started. Importing never sends emails — you start the RSVP campaign separately.'
            action={
              <Link to={p('/import')}>
                <Button>Import CSV</Button>
              </Link>
            }
          />
        </Card>
      )}

      <Group title='Teams' to={p('/teams')}>
        <StatCard label='Total teams' value={d.teams.total} icon={Users} tone='teal' />
        <StatCard
          label='Participants'
          value={d.teams.participants}
          sub={
            d.teams.inactiveParticipants ? `${d.teams.inactiveParticipants} inactive` : 'all active'
          }
          icon={UserRound}
          tone='teal'
        />
        <StatCard label='Avg team size' value={d.teams.averageTeamSize} icon={Ratio} tone='teal' />
        <StatCard
          label='Without email'
          value={d.rsvp.withoutEmail}
          sub='cannot be invited'
          icon={MailX}
          tone={d.rsvp.withoutEmail ? 'amber' : 'slate'}
        />
      </Group>

      <Group title='RSVP' to={p('/rsvp')}>
        <StatCard
          label='Invitations sent'
          value={d.rsvp.invitationsSent}
          sub={`${d.rsvp.invitationsQueued} queued · ${d.rsvp.invitationsFailed} failed`}
          icon={Send}
          tone='blue'
        />
        <StatCard label='Confirmed' value={d.rsvp.confirmed} icon={CheckCircle2} tone='green' />
        <StatCard label='Declined' value={d.rsvp.declined} icon={XCircle} tone='red' />
        <StatCard
          label='Pending (no response)'
          value={d.rsvp.pending}
          sub={`${d.rsvp.notInvited} not yet invited`}
          icon={Hourglass}
          tone='amber'
        />
        <StatCard label='Expired' value={d.rsvp.expired} icon={CalendarX} tone='slate' />
      </Group>

      <Group title='QR tickets' to={p('/tickets')}>
        <StatCard
          label='Tickets generated'
          value={d.tickets.generated}
          sub={`${d.tickets.active} active`}
          icon={Ticket}
          tone='violet'
        />
        <StatCard
          label='Tickets sent'
          value={d.tickets.sent}
          sub={`${d.tickets.delivered} delivered (provider)`}
          icon={MailCheck}
          tone='green'
        />
        <StatCard
          label='Pending delivery'
          value={d.tickets.pendingDelivery}
          icon={Clock}
          tone='blue'
        />
        <StatCard
          label='Failed emails'
          value={d.tickets.failed}
          icon={MailX}
          tone={d.tickets.failed ? 'red' : 'slate'}
        />
        <StatCard
          label='Revoked'
          value={d.tickets.revoked}
          sub={
            d.tickets.confirmedWithoutTicket
              ? `${d.tickets.confirmedWithoutTicket} confirmed without ticket`
              : undefined
          }
          icon={Ban}
          tone='slate'
        />
      </Group>

      <Group title={`Attendance — ${sessName || 'any session'}`} to={p('/sessions')}>
        <StatCard
          label='Checked in'
          value={d.attendance.checkedIn}
          sub={`of ${d.attendance.eligible} confirmed`}
          icon={ScanLine}
          tone='green'
        />
        <StatCard
          label='Not checked in'
          value={d.attendance.notCheckedIn}
          icon={UserX}
          tone='amber'
        />
        <StatCard
          label='Attendance'
          value={`${d.attendance.attendancePct}%`}
          icon={Percent}
          tone='teal'
        />
        <StatCard
          label='Fully checked-in teams'
          value={d.attendance.fullyCheckedInTeams ?? '—'}
          sub={sessionId ? undefined : 'select a session'}
          icon={ShieldCheck}
          tone='green'
        />
        <StatCard
          label='Incomplete teams'
          value={d.attendance.incompleteTeams ?? '—'}
          sub={sessionId ? undefined : 'select a session'}
          icon={AlertTriangle}
          tone='amber'
        />
      </Group>
      <p className='-mt-6 text-xs text-[#667085]'>
        RSVP confirmation is not attendance — participants count as checked in only after their
        ticket is validated at the venue.
      </p>

      <div className='grid gap-6 xl:grid-cols-3'>
        <Card title='RSVP distribution'>
          {rsvpData.length ? (
            <ResponsiveContainer width='100%' height={260}>
              <PieChart>
                <Pie
                  data={rsvpData}
                  dataKey='value'
                  nameKey='name'
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={2}
                >
                  {rsvpData.map((e) => (
                    <Cell key={e.name} fill={RSVP_COLORS[e.name]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title='No RSVP data yet' />
          )}
        </Card>
        <Card title='Session attendance' className='xl:col-span-2'>
          {d.sessions.length ? (
            <ResponsiveContainer width='100%' height={260}>
              <BarChart
                data={d.sessions.map((s: Json) => ({
                  name: s.name,
                  'Checked in': s.checkedIn,
                  Confirmed: d.attendance.eligible
                }))}
              >
                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                <XAxis dataKey='name' tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey='Confirmed' fill='#CCEDDC' radius={[4, 4, 0, 0]} />
                <Bar dataKey='Checked in' fill='#009E49' radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              title='No attendance sessions'
              description='Create sessions under Attendance Sessions.'
            />
          )}
        </Card>
      </div>

      <Card
        title='Team attendance comparison'
        description={
          sessName ? `Session: ${sessName}` : 'Checked in during any session (top 30 teams by size)'
        }
      >
        {d.teamComparison.length ? (
          <div className='overflow-x-auto'>
            <div style={{ minWidth: Math.max(600, d.teamComparison.length * 48) }}>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={d.teamComparison}>
                  <CartesianGrid strokeDasharray='3 3' vertical={false} />
                  <XAxis
                    dataKey='name'
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-30}
                    textAnchor='end'
                    height={70}
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='members' name='Members' fill='#EAECF0' radius={[3, 3, 0, 0]} />
                  <Bar dataKey='confirmed' name='Confirmed' fill='#99DBB9' radius={[3, 3, 0, 0]} />
                  <Bar dataKey='checkedIn' name='Checked in' fill='#009E49' radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <EmptyState title='No teams yet' />
        )}
      </Card>

      <div className='grid gap-6 lg:grid-cols-3'>
        <Card title='Recent RSVP responses' bodyClass='p-0'>
          {act.isLoading ? (
            <Loading />
          ) : act.isError ? (
            <ErrorState error={act.error} onRetry={act.refetch} />
          ) : (
            <ActivityList
              items={act.data.responses}
              empty='No responses yet'
              render={(r) => (
                <li
                  key={r.id}
                  className='flex items-center justify-between gap-2 px-5 py-2.5 text-sm'
                >
                  <span className='min-w-0'>
                    <b className='block truncate'>{r.name}</b>
                    <span className='text-xs text-[#667085]'>
                      {r.team}
                      {r.via === 'ADMIN' ? ' · set by admin' : ''}
                    </span>
                  </span>
                  <span className='text-right'>
                    <Badge status={r.status} />
                    <span className='block text-xs text-[#98A2B3]' title={fmtDateTime(r.at)}>
                      {timeAgo(r.at)}
                    </span>
                  </span>
                </li>
              )}
            />
          )}
        </Card>
        <Card title='Recent check-ins' bodyClass='p-0'>
          {act.isLoading ? (
            <Loading />
          ) : act.isError ? (
            <ErrorState error={act.error} />
          ) : (
            <ActivityList
              items={act.data.checkins}
              empty='No check-ins yet'
              render={(c) => (
                <li
                  key={c.id}
                  className='flex items-center justify-between gap-2 px-5 py-2.5 text-sm'
                >
                  <span className='min-w-0'>
                    <b className='block truncate'>{c.name}</b>
                    <span className='text-xs text-[#667085]'>
                      {c.team} · {c.session}
                    </span>
                  </span>
                  <span className='text-right'>
                    <Badge status={c.method} />
                    <span
                      className='block text-xs text-[#98A2B3]'
                      title={`${fmtDateTime(c.at)} by ${c.by}`}
                    >
                      {timeAgo(c.at)}
                    </span>
                  </span>
                </li>
              )}
            />
          )}
        </Card>
        <Card title='Recent email activity' bodyClass='p-0'>
          {act.isLoading ? (
            <Loading />
          ) : act.isError ? (
            <ErrorState error={act.error} />
          ) : (
            <ActivityList
              items={act.data.emails}
              empty='No emails yet'
              render={(e) => (
                <li
                  key={e.id}
                  className='flex items-center justify-between gap-2 px-5 py-2.5 text-sm'
                >
                  <span className='min-w-0'>
                    <b className='block truncate'>{e.name || e.recipient}</b>
                    <span className='text-xs text-[#667085]'>
                      {e.type.replace(/_/g, ' ').toLowerCase()}
                    </span>
                  </span>
                  <span className='text-right'>
                    <Badge status={e.status} />
                    <span className='block text-xs text-[#98A2B3]'>{timeAgo(e.at)}</span>
                  </span>
                </li>
              )}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
