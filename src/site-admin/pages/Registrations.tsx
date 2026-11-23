import { useEffect, useState, type ReactNode } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Download, Search, Inbox, ExternalLink } from 'lucide-react';
import { api, clean, download, get } from '../../hackathon-portal/lib/api';
import { useAction, withToast } from '../../hackathon-portal/lib/hooks';
import { fmtDateTime } from '../../hackathon-portal/lib/format';
import {
  Badge,
  Button,
  Card,
  Drawer,
  EmptyState,
  Field,
  Input,
  Loading,
  ErrorState,
  PageHeader,
  Pagination,
  QueryState,
  Select,
  Table,
  Td,
  Textarea,
  Th,
  useDebounced
} from '../../hackathon-portal/components/ui';
import type { Json } from '../../hackathon-portal/lib/types';
import { isIsoDate, isUrl } from '../lib';

const STATUS_TONE: Record<string, 'amber' | 'green' | 'red'> = {
  pending: 'amber',
  approved: 'green',
  rejected: 'red'
};

function Cell({ k, v }: { k: string; v: unknown }): ReactNode {
  if (v === '' || v === null || v === undefined) return <span className='text-[#98A2B3]'>—</span>;
  if (k === 'status' && typeof v === 'string' && STATUS_TONE[v])
    return (
      <Badge tone={STATUS_TONE[v]} className='capitalize'>
        {v}
      </Badge>
    );
  if (isIsoDate(v)) return <span className='whitespace-nowrap text-xs'>{fmtDateTime(v)}</span>;
  if (isUrl(v))
    return (
      <a
        href={v}
        target='_blank'
        rel='noreferrer'
        onClick={(e) => e.stopPropagation()}
        className='inline-flex items-center gap-1 break-all text-[#009E49] hover:underline'
      >
        {v.replace(/^https?:\/\//, '').slice(0, 60)} <ExternalLink className='size-3 shrink-0' />
      </a>
    );
  return <>{String(v)}</>;
}

function StartupReview({ record, onDone }: { record: Json; onDone: () => void }) {
  const [status, setStatus] = useState<string>(record.raw.status || 'pending');
  const [notes, setNotes] = useState<string>(record.raw.reviewNotes || '');
  const save = useAction(
    () =>
      api.patch(`/site/collections/startups/${record.raw._id}/review`, {
        status,
        reviewNotes: notes
      }),
    { invalidate: ['site'], success: 'Review saved', onSuccess: onDone }
  );
  return (
    <div className='mb-5 space-y-3 rounded-2xl border border-[#EAECF0] bg-[#F9FAFB] p-4'>
      <p className='text-sm font-semibold text-[#101828]'>Review</p>
      <Field label='Decision'>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: 'pending', label: 'Pending' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' }
          ]}
        />
      </Field>
      <Field label='Notes (internal)'>
        <Textarea
          rows={3}
          maxLength={2000}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Field>
      <div className='flex justify-end'>
        <Button size='sm' loading={save.isPending} onClick={() => save.mutate(null)}>
          Save review
        </Button>
      </div>
    </div>
  );
}

function RecordDrawer({
  collection,
  id,
  onClose
}: {
  collection: string;
  id: string;
  onClose: () => void;
}) {
  const q = useQuery({
    queryKey: ['site', 'record', collection, id],
    queryFn: () => get(`/site/collections/${collection}/${id}`)
  });
  return (
    <Drawer open onClose={onClose} title={q.data?.title || 'Details'}>
      {q.isLoading ? (
        <Loading />
      ) : q.isError ? (
        <ErrorState error={q.error} onRetry={() => q.refetch()} />
      ) : (
        <>
          {collection === 'startups' && (
            <StartupReview record={q.data} onDone={() => q.refetch()} />
          )}
          <dl className='divide-y divide-[#F2F4F7]'>
            {q.data.fields.map((f: Json) => (
              <div key={f.key} className='grid gap-1 py-2.5 sm:grid-cols-3 sm:gap-4'>
                <dt className='text-xs font-medium uppercase tracking-wide text-[#667085]'>
                  {f.header}
                </dt>
                <dd className='whitespace-pre-wrap break-words text-sm text-[#101828] sm:col-span-2'>
                  <Cell k={f.key} v={f.value} />
                </dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </Drawer>
  );
}

export default function Registrations() {
  const { collection = '' } = useParams();
  const [sp, setSp] = useSearchParams();
  const [q, setQ] = useState('');
  const search = useDebounced(q);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const openId = sp.get('open');

  // reset when switching between collections
  useEffect(() => {
    setQ('');
    setPage(1);
    setFilters({});
  }, [collection]);
  useEffect(() => setPage(1), [search, filters]);

  const params = clean({ q: search, page, limit, ...filters });
  const list = useQuery({
    queryKey: ['site', 'list', collection, params],
    queryFn: () => get(`/site/collections/${collection}`, params),
    placeholderData: (prev: Json) => prev
  });
  const setOpen = (id: string | null) => {
    const next = new URLSearchParams(sp);
    if (id) next.set('open', id);
    else next.delete('open');
    setSp(next, { replace: true });
  };

  return (
    <div>
      <PageHeader
        title={list.data?.label || 'Registrations'}
        description={
          list.data ? `${list.data.total} record${list.data.total === 1 ? '' : 's'}` : undefined
        }
        actions={
          <Button
            variant='secondary'
            icon={Download}
            onClick={() =>
              withToast(
                download(
                  `/site/collections/${collection}/export`,
                  clean({ q: search, ...filters }),
                  `${collection}.csv`
                ),
                'Export downloaded'
              )
            }
          >
            Export CSV
          </Button>
        }
      />
      <Card bodyClass='p-0'>
        <div className='flex flex-wrap gap-3 border-b border-[#F2F4F7] p-4'>
          <div className='relative min-w-56 flex-1'>
            <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98A2B3]' />
            <Input
              className='pl-9'
              placeholder='Search…'
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          {(list.data?.filters || []).map((f: Json) => (
            <Select
              key={f.key}
              className='w-52'
              value={filters[f.key] || ''}
              onChange={(e) => setFilters((p) => ({ ...p, [f.key]: e.target.value }))}
              placeholder={`All: ${f.label.toLowerCase()}`}
              options={f.options.map((o: string) => ({
                value: o,
                label: o.charAt(0).toUpperCase() + o.slice(1)
              }))}
            />
          ))}
        </div>
        <QueryState
          query={list}
          isEmpty={(d) => !d.items.length}
          empty={
            <EmptyState
              icon={Inbox}
              title={
                search || Object.values(filters).some(Boolean)
                  ? 'No matches'
                  : 'No registrations yet'
              }
            />
          }
        >
          {(d) => (
            <>
              <Table
                head={
                  <>
                    {d.columns.map((c: Json) => (
                      <Th key={c.key}>{c.header}</Th>
                    ))}
                  </>
                }
              >
                {d.items.map((row: Json) => (
                  <tr
                    key={row._id}
                    className='cursor-pointer hover:bg-[#F9FAFB]'
                    onClick={() => setOpen(row._id)}
                  >
                    {d.columns.map((c: Json, i: number) => (
                      <Td
                        key={c.key}
                        className={i === 0 ? 'font-medium text-[#101828]' : undefined}
                      >
                        <Cell k={c.key} v={row[c.key]} />
                      </Td>
                    ))}
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
      {openId && <RecordDrawer collection={collection} id={openId} onClose={() => setOpen(null)} />}
    </div>
  );
}
