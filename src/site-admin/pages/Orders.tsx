import { Fragment, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronRight, Receipt, Search } from 'lucide-react';
import { clean, get } from '../../hackathon-portal/lib/api';
import { fmtDateTime } from '../../hackathon-portal/lib/format';
import {
  Badge,
  Card,
  EmptyState,
  Input,
  PageHeader,
  Pagination,
  QueryState,
  Table,
  Tabs,
  Td,
  Th,
  useDebounced
} from '../../hackathon-portal/components/ui';
import type { Json } from '../../hackathon-portal/lib/types';
import { naira } from '../lib';

type Status = '' | 'confirmed' | 'pending_payment';

export default function Orders() {
  const [sp, setSp] = useSearchParams();
  const status = (sp.get('status') || '') as Status;
  const [q, setQ] = useState('');
  const search = useDebounced(q);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [expanded, setExpanded] = useState<string | null>(null);
  useEffect(() => setPage(1), [search, status]);

  const params = clean({ status, q: search, page, limit });
  const orders = useQuery({
    queryKey: ['site', 'orders', params],
    queryFn: () => get('/site/orders', params),
    placeholderData: (prev: Json) => prev
  });

  return (
    <div className='space-y-4'>
      <PageHeader
        title='Orders'
        description='Checkouts on the ticketing site. Unpaid orders are people who started checkout but never completed payment.'
      />
      <Tabs<Status>
        tabs={[
          { value: '', label: 'All' },
          { value: 'confirmed', label: 'Confirmed' },
          { value: 'pending_payment', label: 'Unpaid' }
        ]}
        value={status}
        onChange={(v) => setSp(v ? { status: v } : {}, { replace: true })}
      />
      <Card bodyClass='p-0'>
        <div className='border-b border-[#F2F4F7] p-4'>
          <div className='relative'>
            <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98A2B3]' />
            <Input
              className='pl-9'
              placeholder='Search order ID, buyer or attendee email, payment reference…'
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>
        <QueryState
          query={orders}
          isEmpty={(d) => !d.items.length}
          empty={<EmptyState icon={Receipt} title='No orders found' />}
        >
          {(d) => (
            <>
              <Table
                head={
                  <>
                    <Th />
                    <Th>Order</Th>
                    <Th>Buyer</Th>
                    <Th>Attendees</Th>
                    <Th>Total</Th>
                    <Th>Status</Th>
                    <Th>Created</Th>
                  </>
                }
              >
                {d.items.map((o: Json) => (
                  <Fragment key={o._id}>
                    <tr
                      className='cursor-pointer hover:bg-[#F9FAFB]'
                      onClick={() => setExpanded(expanded === o._id ? null : o._id)}
                    >
                      <Td className='w-8 text-[#98A2B3]'>
                        {expanded === o._id ? (
                          <ChevronDown className='size-4' />
                        ) : (
                          <ChevronRight className='size-4' />
                        )}
                      </Td>
                      <Td className='font-mono text-xs'>{o._id}</Td>
                      <Td>{o.buyerEmail}</Td>
                      <Td className='tabular-nums'>{o.attendees.length}</Td>
                      <Td className='whitespace-nowrap tabular-nums'>
                        {o.total ? naira(o.total) : 'Free'}
                      </Td>
                      <Td>
                        {o.status === 'confirmed' ? (
                          <Badge tone='green'>Confirmed</Badge>
                        ) : (
                          <Badge tone='amber'>Unpaid</Badge>
                        )}
                      </Td>
                      <Td className='whitespace-nowrap text-xs'>{fmtDateTime(o.createdAt)}</Td>
                    </tr>
                    {expanded === o._id && (
                      <tr className='bg-[#F9FAFB]'>
                        <td colSpan={7} className='px-4 py-3'>
                          <div className='mb-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-[#475467]'>
                            <span>
                              Tickets <b className='text-[#101828]'>{naira(o.ticketTotal)}</b>
                            </span>
                            <span>
                              Service fee <b className='text-[#101828]'>{naira(o.serviceFee)}</b>
                            </span>
                            <span>
                              Payment ref{' '}
                              <b className='font-mono text-[#101828]'>
                                {o.paymentReference || '—'}
                              </b>
                            </span>
                            <span>
                              Attended before <b className='text-[#101828]'>{o.attendedBefore}</b>
                            </span>
                          </div>
                          <ul className='divide-y divide-[#EAECF0] rounded-xl border border-[#EAECF0] bg-white'>
                            {o.attendees.map((a: Json, i: number) => (
                              <li
                                key={i}
                                className='flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm'
                              >
                                <span>
                                  <b>{a.name}</b>{' '}
                                  <span className='text-xs text-[#667085]'>
                                    {a.email} · {a.phone}
                                  </span>
                                </span>
                                <span className='flex items-center gap-2 text-xs'>
                                  {a.ticket}
                                  {a.passId && (
                                    <span className='font-mono text-[#667085]'>{a.passId}</span>
                                  )}
                                  {a.checkedInAt && <Badge tone='green'>Checked in</Badge>}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </Fragment>
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
    </div>
  );
}
