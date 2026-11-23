import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Ticket, ScanLine, Banknote, Hourglass } from 'lucide-react';
import { get } from '../../hackathon-portal/lib/api';
import { fmtDateTime, timeAgo } from '../../hackathon-portal/lib/format';
import {
  Card,
  ErrorState,
  Loading,
  PageHeader,
  StatCard,
  Badge
} from '../../hackathon-portal/components/ui';
import type { Json } from '../../hackathon-portal/lib/types';
import { naira, num } from '../lib';

const BRAND = '#009E49';

export default function Overview() {
  const q = useQuery({ queryKey: ['site', 'overview'], queryFn: () => get('/site/overview') });
  if (q.isLoading) return <Loading />;
  if (q.isError) return <ErrorState error={q.error} onRetry={() => q.refetch()} />;
  const d = q.data as Json;
  const keys: string[] = d.collections.map((c: Json) => c.key);
  const trend = d.trend.map((t: Json) => ({
    day: t.day,
    total: keys.reduce((n, k) => n + (t[k] || 0), 0),
    ...t
  }));
  const last30 = trend.reduce((n: number, t: Json) => n + t.total, 0);
  const labelOf = Object.fromEntries(d.collections.map((c: Json) => [c.key, c.label]));

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Overview'
        description='Sign-ups across every website form, and 2026 ticket sales.'
      />

      <section>
        <h2 className='mb-2 text-sm font-semibold uppercase tracking-wide text-[#667085]'>
          Tickets
        </h2>
        <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
          <StatCard
            label='Passes issued'
            value={num(d.tickets.attendees)}
            icon={Ticket}
            tone='teal'
          />
          <StatCard
            label='Checked in'
            value={num(d.tickets.checkedIn)}
            sub={
              d.tickets.attendees
                ? `${Math.round((d.tickets.checkedIn / d.tickets.attendees) * 100)}% of passes`
                : undefined
            }
            icon={ScanLine}
            tone='green'
          />
          <StatCard
            label='Ticket revenue'
            value={naira(d.tickets.revenue)}
            sub={`+ ${naira(d.tickets.serviceFees)} service fees`}
            icon={Banknote}
            tone='blue'
          />
          <Link to='/admin/orders?status=pending_payment'>
            <StatCard
              label='Unpaid orders'
              value={num(d.pendingOrders)}
              sub='Started checkout, not paid'
              icon={Hourglass}
              tone='amber'
            />
          </Link>
        </div>
      </section>

      <section>
        <h2 className='mb-2 text-sm font-semibold uppercase tracking-wide text-[#667085]'>
          Registrations
        </h2>
        <div className='grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7'>
          {d.collections.map((c: Json) => (
            <Link key={c.key} to={`/admin/registrations/${c.key}`} className='block'>
              <StatCard
                label={c.label}
                value={num(c.total)}
                sub={c.last7 ? `+${num(c.last7)} this week` : 'None this week'}
              />
            </Link>
          ))}
        </div>
      </section>

      <div className='grid gap-6 xl:grid-cols-3'>
        <Card
          className='xl:col-span-2'
          title='Sign-ups per day'
          description={`All registration forms, last 30 days · ${num(last30)} total`}
        >
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={trend} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                <CartesianGrid vertical={false} stroke='#F2F4F7' />
                <XAxis
                  dataKey='day'
                  tickFormatter={(v: string) => v.slice(8)}
                  tick={{ fontSize: 11, fill: '#667085' }}
                  tickLine={false}
                  axisLine={{ stroke: '#EAECF0' }}
                  interval='preserveStartEnd'
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#667085' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: '#F2F4F7' }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0].payload as Json;
                    const parts = keys.filter((k) => row[k]);
                    return (
                      <div className='rounded-xl border border-[#EAECF0] bg-white px-3 py-2 text-xs shadow-lg'>
                        <p className='mb-1 font-semibold text-[#101828]'>
                          {new Date(`${row.day}T12:00:00`).toLocaleDateString('en-GB', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short'
                          })}
                          : {row.total} sign-up{row.total === 1 ? '' : 's'}
                        </p>
                        {parts.map((k) => (
                          <p key={k} className='text-[#475467]'>
                            {labelOf[k]}: <b className='text-[#101828]'>{row[k]}</b>
                          </p>
                        ))}
                      </div>
                    );
                  }}
                />
                <Bar dataKey='total' fill={BRAND} radius={[4, 4, 0, 0]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title='Latest sign-ups' bodyClass='p-0'>
          <ul className='divide-y divide-[#F2F4F7]'>
            {d.recent.map((r: Json) => (
              <li key={`${r.collection}-${r._id}`}>
                <Link
                  to={`/admin/registrations/${r.collection}?open=${r._id}`}
                  className='flex items-start justify-between gap-3 px-4 py-3 hover:bg-[#F9FAFB]'
                >
                  <div className='min-w-0'>
                    <p className='truncate text-sm font-medium text-[#101828]'>{r.title || '—'}</p>
                    <p className='truncate text-xs text-[#667085]'>{r.subtitle}</p>
                  </div>
                  <div className='shrink-0 text-right'>
                    <Badge tone='slate'>{r.collectionLabel}</Badge>
                    <p className='mt-1 text-[11px] text-[#98A2B3]' title={fmtDateTime(r.createdAt)}>
                      {timeAgo(r.createdAt)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
            {!d.recent.length && (
              <li className='px-4 py-6 text-sm text-[#667085]'>No sign-ups yet.</li>
            )}
          </ul>
        </Card>
      </div>

      <Card title='Tickets by type' bodyClass='p-0'>
        <table className='min-w-full divide-y divide-[#EAECF0] text-sm'>
          <thead className='bg-[#F9FAFB] text-xs font-medium uppercase tracking-wide text-[#475467]'>
            <tr>
              <th className='px-4 py-2.5 text-left'>Ticket</th>
              <th className='px-4 py-2.5 text-right'>Sold</th>
              <th className='px-4 py-2.5 text-right'>Capacity</th>
              <th className='px-4 py-2.5 text-right'>Revenue</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-[#F2F4F7]'>
            {d.tickets.tickets.map((t: Json) => (
              <tr key={t.id}>
                <td className='px-4 py-2.5 font-medium'>{t.name}</td>
                <td className='px-4 py-2.5 text-right tabular-nums'>{num(t.sold)}</td>
                <td className='px-4 py-2.5 text-right tabular-nums text-[#667085]'>
                  {t.capacity ? num(t.capacity) : 'Unlimited'}
                </td>
                <td className='px-4 py-2.5 text-right tabular-nums'>{naira(t.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
