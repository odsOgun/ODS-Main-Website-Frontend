import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, Search, Ticket, CheckCircle2 } from 'lucide-react';
import { api, clean, download, get } from '../../hackathon-portal/lib/api';
import { useAction, withToast } from '../../hackathon-portal/lib/hooks';
import { fmtDateTime } from '../../hackathon-portal/lib/format';
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Input,
  PageHeader,
  Pagination,
  QueryState,
  Select,
  StatCard,
  Table,
  Td,
  Th,
  useDebounced
} from '../../hackathon-portal/components/ui';
import type { Json } from '../../hackathon-portal/lib/types';
import { naira, num } from '../lib';

export default function Tickets() {
  const [q, setQ] = useState('');
  const search = useDebounced(q);
  const [ticketType, setTicketType] = useState('');
  const [checkInStatus, setCheckInStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [confirm, setConfirm] = useState<Json>(null);
  useEffect(() => setPage(1), [search, ticketType, checkInStatus, paymentStatus]);

  const summary = useQuery({
    queryKey: ['site', 'tickets-summary'],
    queryFn: () => get('/site/tickets/summary')
  });
  const filters = clean({ q: search, ticketType, checkInStatus, paymentStatus });
  const passes = useQuery({
    queryKey: ['site', 'passes', filters, page, limit],
    queryFn: () => get('/site/tickets/passes', { ...filters, page, limit }),
    placeholderData: (prev: Json) => prev
  });
  const checkIn = useAction<Json, Json>(
    (pass) => api.post(`/site/tickets/passes/${encodeURIComponent(pass.id)}/check-in`),
    {
      invalidate: ['site'],
      success: (_d, pass) => `${pass.name} checked in`,
      onSuccess: () => setConfirm(null)
    }
  );
  const s = summary.data;

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Passes & check-in'
        description='ODS 2026 attendee passes from the ticketing site.'
        actions={
          <Button
            variant='secondary'
            icon={Download}
            onClick={() =>
              withToast(
                download('/site/tickets/passes/export', filters, 'ods-passes.csv'),
                'Export downloaded'
              )
            }
          >
            Export CSV
          </Button>
        }
      />
      <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
        <StatCard label='Passes issued' value={num(s?.attendees)} icon={Ticket} tone='teal' />
        <StatCard label='Checked in' value={num(s?.checkedIn)} icon={CheckCircle2} tone='green' />
        <StatCard label='Ticket revenue' value={naira(s?.revenue)} tone='blue' />
        <StatCard label='Service fees' value={naira(s?.serviceFees)} tone='slate' />
      </div>
      <Card bodyClass='p-0'>
        <div className='flex flex-wrap gap-3 border-b border-[#F2F4F7] p-4'>
          <div className='relative min-w-56 flex-1'>
            <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98A2B3]' />
            <Input
              className='pl-9'
              placeholder='Search name, email, pass ID, order, company…'
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <Select
            className='w-48'
            value={ticketType}
            onChange={(e) => setTicketType(e.target.value)}
            placeholder='All tickets'
            options={(s?.tickets || []).map((t: Json) => ({ value: t.id, label: t.name }))}
          />
          <Select
            className='w-40'
            value={checkInStatus}
            onChange={(e) => setCheckInStatus(e.target.value)}
            placeholder='Any check-in'
            options={[
              { value: 'checked_in', label: 'Checked in' },
              { value: 'pending', label: 'Not checked in' }
            ]}
          />
          <Select
            className='w-40'
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            placeholder='Paid & free'
            options={[
              { value: 'paid', label: 'Paid' },
              { value: 'not_required', label: 'Free' }
            ]}
          />
        </div>
        <QueryState
          query={passes}
          isEmpty={(d) => !d.items.length}
          empty={<EmptyState icon={Ticket} title='No passes found' />}
        >
          {(d) => (
            <>
              <Table
                head={
                  <>
                    <Th>Attendee</Th>
                    <Th>Ticket</Th>
                    <Th>Pass ID</Th>
                    <Th>Paid</Th>
                    <Th>Check-in</Th>
                    <Th>Issued</Th>
                    <Th />
                  </>
                }
              >
                {d.items.map((pass: Json) => (
                  <tr key={pass.id}>
                    <Td>
                      <p className='font-medium text-[#101828]'>{pass.name}</p>
                      <p className='text-xs text-[#667085]'>{pass.email}</p>
                    </Td>
                    <Td className='whitespace-nowrap'>{pass.type}</Td>
                    <Td className='font-mono text-xs'>{pass.id}</Td>
                    <Td className='whitespace-nowrap tabular-nums'>
                      {pass.paymentStatus === 'Paid' ? (
                        naira(pass.amount)
                      ) : (
                        <Badge tone='slate'>Free</Badge>
                      )}
                    </Td>
                    <Td>
                      {pass.checkedInAt ? (
                        <span title={`by ${pass.checkedInBy}`}>
                          <Badge tone='green'>Checked in</Badge>
                          <span className='ml-2 whitespace-nowrap text-xs text-[#667085]'>
                            {fmtDateTime(pass.checkedInAt)}
                          </span>
                        </span>
                      ) : (
                        <Badge tone='amber'>Not yet</Badge>
                      )}
                    </Td>
                    <Td className='whitespace-nowrap text-xs'>{fmtDateTime(pass.issuedAt)}</Td>
                    <Td className='text-right'>
                      {!pass.checkedInAt && (
                        <Button size='sm' variant='secondary' onClick={() => setConfirm(pass)}>
                          Check in
                        </Button>
                      )}
                    </Td>
                  </tr>
                ))}
              </Table>
              <Pagination
                page={d.page}
                pages={d.pages}
                total={d.total}
                limit={d.limit}
                onPage={setPage}
                onLimit={(n) => {
                  setLimit(n);
                  setPage(1);
                }}
              />
            </>
          )}
        </QueryState>
      </Card>
      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() => checkIn.mutate(confirm)}
        loading={checkIn.isPending}
        title='Check in manually?'
        message={
          confirm
            ? `Mark ${confirm.name} (${confirm.type}, ${confirm.id}) as checked in. This can't be undone here.`
            : undefined
        }
        confirmLabel='Check in'
      />
    </div>
  );
}
