import { useState } from 'react';
import { Search, Mail, RotateCw } from 'lucide-react';
import { api, clean } from '../../lib/api';
import { useAction, useEventQuery } from '../../lib/hooks';
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
  Table,
  Tabs,
  Td,
  Th,
  useDebounced
} from '../../components/ui';
import type { Json } from '../../lib/types';

const STATUSES = ['QUEUED', 'SENT', 'DELIVERED', 'FAILED', 'BOUNCED', 'COMPLAINED', 'SKIPPED'];

export default function EmailLogs() {
  const [status, setStatus] = useState('');
  const [emailType, setEmailType] = useState('');
  const [q, setQ] = useState('');
  const search = useDebounced(q);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const list = useEventQuery(
    'email-logs',
    '/email-logs',
    clean({ status, emailType, q: search, page, limit }),
    { refetchInterval: 10000 }
  );
  const queue = useEventQuery('jobs', '/jobs/status', undefined, { refetchInterval: 10000 });
  const retry = useAction((id: string) => api.post(`/email-logs/${id}/retry`), {
    invalidate: ['email-logs', 'tickets', 'rsvp', 'dashboard'],
    success: 'Email re-queued (same link / QR code)'
  });
  const counts: Record<string, number> = list.data?.counts || {};
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const qs = queue.data || {};

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Email Logs'
        description='Every invitation, reminder and ticket email with its delivery status. Delivered/bounced statuses come from provider webhooks.'
      />
      <div className='flex flex-wrap items-center gap-2 text-sm text-[#475467]'>
        <span className='font-medium'>Background queue:</span>
        <Badge status='QUEUED'>{qs.QUEUED || 0} queued</Badge>
        <Badge status='PROCESSING'>{qs.PROCESSING || 0} processing</Badge>
        <Badge status='COMPLETED'>{qs.COMPLETED || 0} completed</Badge>
        <Badge status='FAILED'>{qs.FAILED || 0} failed</Badge>
      </div>
      <Tabs
        value={status}
        onChange={(v) => {
          setStatus(v);
          setPage(1);
        }}
        tabs={[
          { value: '', label: 'All', count: total },
          ...STATUSES.map((s) => ({
            value: s,
            label: s.charAt(0) + s.slice(1).toLowerCase(),
            count: counts[s] || 0
          }))
        ]}
      />
      <Card bodyClass='p-0'>
        <div className='flex flex-wrap gap-3 border-b border-[#F2F4F7] p-4'>
          <div className='relative min-w-56 flex-1'>
            <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98A2B3]' />
            <Input
              className='pl-9'
              placeholder='Search recipient or participant name…'
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            className='w-52'
            value={emailType}
            onChange={(e) => {
              setEmailType(e.target.value);
              setPage(1);
            }}
            placeholder='All email types'
            options={['RSVP_INVITATION', 'RSVP_REMINDER', 'TICKET']}
          />
        </div>
        {list.isLoading ? (
          <Loading />
        ) : list.isError ? (
          <ErrorState error={list.error} onRetry={list.refetch} />
        ) : !list.data.items.length ? (
          <EmptyState icon={Mail} title='No emails' />
        ) : (
          <>
            <Table
              head={
                <>
                  <Th>Created</Th>
                  <Th>Type</Th>
                  <Th>Recipient</Th>
                  <Th>Subject</Th>
                  <Th>Status</Th>
                  <Th>Attempts</Th>
                  <Th>Sent / delivered</Th>
                  <Th />
                </>
              }
            >
              {list.data.items.map((e: Json) => (
                <tr key={e._id}>
                  <Td className='whitespace-nowrap text-xs'>{fmtDateTime(e.createdAt)}</Td>
                  <Td className='whitespace-nowrap text-xs'>
                    {e.emailType.replace(/_/g, ' ').toLowerCase()}
                  </Td>
                  <Td>
                    <b className='block'>{e.participantId?.fullName || '—'}</b>
                    <span className='text-xs text-[#667085]'>{e.recipient}</span>
                  </Td>
                  <Td className='max-w-64 truncate text-xs' title={e.subject}>
                    {e.subject || '—'}
                  </Td>
                  <Td>
                    <Badge status={e.status} />
                    {e.errorMessage && (
                      <span
                        className='block max-w-64 truncate text-xs text-red-600'
                        title={e.errorMessage}
                      >
                        {e.errorMessage}
                      </span>
                    )}
                  </Td>
                  <Td className='tabular-nums'>{e.attempts}</Td>
                  <Td className='whitespace-nowrap text-xs'>
                    {fmtDateTime(e.sentAt)}
                    {e.deliveredAt && (
                      <span className='block text-[#008A43]'>{fmtDateTime(e.deliveredAt)}</span>
                    )}
                  </Td>
                  <Td className='text-right'>
                    {['FAILED', 'BOUNCED'].includes(e.status) && (
                      <Button
                        size='sm'
                        variant='secondary'
                        icon={RotateCw}
                        loading={retry.isPending && retry.variables === e._id}
                        onClick={() => retry.mutate(e._id)}
                      >
                        Retry
                      </Button>
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
    </div>
  );
}
