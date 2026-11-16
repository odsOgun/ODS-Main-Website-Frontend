import { useEffect, useState } from 'react';
import { Send, BellRing, Search, Download, RotateCcw, MailWarning, Megaphone } from 'lucide-react';
import { api, clean, download } from '../../lib/api';
import { useAction, useEventQuery, useTeamOptions, withToast } from '../../lib/hooks';
import { useEvent } from '../../context/EventContext';
import { fmtDateTime, timeAgo } from '../../lib/format';
import type { Json } from '../../lib/types';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  EmptyState,
  ErrorState,
  Field,
  Input,
  Loading,
  Modal,
  PageHeader,
  Pagination,
  Progress,
  Select,
  SortHeader,
  StatusBadge,
  Table,
  Tabs,
  Td,
  Th,
  useDebounced
} from '../../components/ui';
import RsvpStatusDialog from '../../components/RsvpStatusDialog';
import ParticipantDrawer from '../../components/ParticipantDrawer';

const STATUSES = ['PENDING', 'CONFIRMED', 'DECLINED', 'EXPIRED', 'CANCELLED', 'NOT_INVITED'];
const INV = ['rsvp', 'rsvp-campaigns', 'participants', 'teams', 'team', 'dashboard', 'email-logs'];

type CampaignKind = 'invite' | 'remind';

interface CampaignDialogProps {
  open: boolean;
  onClose: () => void;
  kind?: CampaignKind;
  selectedIds: string[];
  defaultScope: string;
}

function CampaignDialog({ open, onClose, kind, selectedIds, defaultScope }: CampaignDialogProps) {
  const teams = useTeamOptions();
  const [scope, setScope] = useState(defaultScope);
  const [teamId, setTeamId] = useState('');
  const [reissue, setReissue] = useState(false);
  useEffect(() => {
    if (open) {
      setScope(defaultScope);
      setTeamId('');
      setReissue(false);
    }
  }, [open, defaultScope]);
  const isInvite = kind === 'invite';
  const run = useAction<Json, void>(
    () =>
      api
        .post(isInvite ? '/rsvp/campaign' : '/rsvp/reminders', {
          scope,
          ...(scope === 'TEAM' && { teamId }),
          ...(scope === 'SELECTED' && { participantIds: selectedIds }),
          ...(isInvite && reissue && { reissue: true })
        })
        .then((r) => r.data),
    {
      invalidate: INV,
      success: (d) =>
        isInvite
          ? `Queued ${d.queued} invitation(s). Skipped ${d.skippedAlreadyInvited} already invited, ${d.skippedResponded} responded, ${d.skippedNoEmail} without email.`
          : `Queued ${d.queued} reminder(s) of ${d.eligible} eligible.${d.skippedRecentlyReminded ? ` ${d.skippedRecentlyReminded} reminded in the last 10 min were skipped.` : ''}`,
      onSuccess: onClose
    }
  );
  const scopes = [
    {
      value: 'ALL',
      label: isInvite ? 'All eligible participants' : 'Everyone who has not responded'
    },
    { value: 'TEAM', label: 'One team' },
    ...(selectedIds.length
      ? [{ value: 'SELECTED', label: `Selected participants (${selectedIds.length})` }]
      : []),
    ...(isInvite ? [{ value: 'FAILED', label: 'Resend failed / bounced invitations' }] : [])
  ];
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isInvite ? 'Send RSVP invitations' : 'Send RSVP reminders'}
      size='md'
      footer={
        <>
          <Button variant='secondary' onClick={onClose}>
            Cancel
          </Button>
          <Button
            icon={isInvite ? Send : BellRing}
            loading={run.isPending}
            disabled={scope === 'TEAM' && !teamId}
            onClick={() => run.mutate()}
          >
            {isInvite ? 'Queue invitations' : 'Queue reminders'}
          </Button>
        </>
      }
    >
      <div className='space-y-4'>
        <Field label='Recipients'>
          <Select value={scope} onChange={(e) => setScope(e.target.value)} options={scopes} />
        </Field>
        {scope === 'TEAM' && (
          <Field label='Team' required>
            <Select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              placeholder='Select team'
              options={teams.options}
            />
          </Field>
        )}
        {isInvite ? (
          <>
            <ul className='list-disc space-y-1 pl-5 text-sm text-[#475467]'>
              <li>Each participant gets their own email with a personal, secure RSVP link.</li>
              <li>
                Participants already invited, who have responded, or without an email are skipped.
              </li>
              <li>Failed invitations are retried with the same link.</li>
              <li>Emails are sent in the background — progress appears under Campaigns.</li>
            </ul>
            <Checkbox
              label='Issue new links to participants already invited (old links stop working; also reopens expired invitations)'
              checked={reissue}
              onChange={(e) => setReissue(e.target.checked)}
            />
          </>
        ) : (
          <p className='text-sm text-[#475467]'>
            Reminders go only to participants who were invited, have <b>not responded</b>, and whose
            link has not expired. Their existing link is reused.
          </p>
        )}
      </div>
    </Modal>
  );
}

function Campaigns() {
  const q = useEventQuery('rsvp-campaigns', '/rsvp/campaigns', undefined, {
    refetchInterval: (query) =>
      query.state.data?.items?.some((c: Json) => c.status === 'RUNNING') ? 3000 : 20000
  });
  return (
    <Card title='Campaigns' description='Background email jobs and their progress' bodyClass='p-0'>
      {q.isLoading ? (
        <Loading />
      ) : q.isError ? (
        <ErrorState error={q.error} onRetry={q.refetch} />
      ) : !q.data.items.length ? (
        <EmptyState
          icon={Megaphone}
          title='No campaigns yet'
          description='Importing a CSV never sends emails. Start the invitation campaign when ready.'
        />
      ) : (
        <ul className='divide-y divide-[#F2F4F7]'>
          {q.data.items.slice(0, 10).map((c: Json) => {
            const done = c.sent + c.failed + c.skipped;
            return (
              <li key={c._id} className='px-5 py-3'>
                <div className='flex flex-wrap items-center justify-between gap-2 text-sm'>
                  <span>
                    <b>{c.type.replace(/_/g, ' ').toLowerCase()}</b>{' '}
                    <span className='text-[#667085]'>
                      · {c.scope?.toLowerCase()} · by {c.createdBy?.name || '—'} ·{' '}
                      {timeAgo(c.createdAt)}
                    </span>
                  </span>
                  <Badge status={c.status} />
                </div>
                <div className='mt-2 flex items-center gap-3'>
                  <Progress value={done} max={c.total || 1} tone={c.failed ? 'amber' : 'teal'} />
                  <span className='whitespace-nowrap text-xs tabular-nums text-[#475467]'>
                    {c.sent} sent · {c.failed} failed · {c.skipped} skipped / {c.total}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

export default function Rsvp() {
  const { event } = useEvent();
  const [tab, setTab] = useState('');
  const [q, setQ] = useState('');
  const search = useDebounced(q);
  const [teamId, setTeamId] = useState('');
  const [invitationStatus, setInvitationStatus] = useState('');
  const [sort, setSort] = useState('-responseDate');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [selected, setSelected] = useState<string[]>([]);
  const [campaign, setCampaign] = useState<{ kind: CampaignKind; scope: string } | null>(null);
  const [statusFor, setStatusFor] = useState<Json | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const teams = useTeamOptions();
  const filters = clean({ q: search, teamId, rsvpStatus: tab, invitationStatus });
  const list = useEventQuery(
    'rsvp',
    '/rsvp',
    { ...filters, sort, page, limit },
    { refetchInterval: 15000 }
  );
  const items: Json[] = list.data?.items || [];
  const counts: Record<string, number> = list.data?.counts || {};
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const pageIds = items.filter((r) => r.isActive && r.email).map((r) => String(r.id));
  const allOnPage = pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const onSort = (s: string) => {
    setSort(s);
    setPage(1);
  };
  const reset = () => setPage(1);

  return (
    <div className='space-y-6'>
      <PageHeader
        title='RSVP Management'
        description={
          event
            ? `Deadline: ${fmtDateTime(event.rsvpDeadline, event.timezone)} · unanswered invitations expire automatically`
            : undefined
        }
        actions={
          <>
            <Button
              variant='secondary'
              icon={Download}
              loading={exporting}
              onClick={async () => {
                setExporting(true);
                try {
                  await withToast(
                    download('/reports/rsvp', { format: 'xlsx', ...filters }, 'rsvp.xlsx')
                  );
                } catch {
                  /* toasted */
                } finally {
                  setExporting(false);
                }
              }}
            >
              Export
            </Button>
            <Button
              variant='secondary'
              icon={MailWarning}
              onClick={() => setCampaign({ kind: 'invite', scope: 'FAILED' })}
            >
              Resend failed
            </Button>
            <Button
              variant='secondary'
              icon={BellRing}
              onClick={() =>
                setCampaign({ kind: 'remind', scope: selected.length ? 'SELECTED' : 'ALL' })
              }
            >
              Send reminders
            </Button>
            <Button
              icon={Send}
              onClick={() =>
                setCampaign({ kind: 'invite', scope: selected.length ? 'SELECTED' : 'ALL' })
              }
            >
              Send invitations
            </Button>
          </>
        }
      />

      <Tabs
        value={tab}
        onChange={(v) => {
          setTab(v);
          reset();
          setSelected([]);
        }}
        tabs={[
          { value: '', label: 'All', count: total },
          ...STATUSES.map((s) => ({
            value: s,
            label: s === 'NOT_INVITED' ? 'Not invited' : s.charAt(0) + s.slice(1).toLowerCase(),
            count: counts[s] || 0
          }))
        ]}
      />

      <Card bodyClass='p-0'>
        <div className='flex flex-wrap items-center gap-3 border-b border-[#F2F4F7] p-4'>
          <div className='relative min-w-56 flex-1'>
            <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98A2B3]' />
            <Input
              className='pl-9'
              placeholder='Search name or email…'
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                reset();
              }}
            />
          </div>
          <Select
            className='w-56'
            value={teamId}
            onChange={(e) => {
              setTeamId(e.target.value);
              reset();
            }}
            placeholder='All teams'
            options={teams.options}
          />
          <Select
            className='w-52'
            value={invitationStatus}
            onChange={(e) => {
              setInvitationStatus(e.target.value);
              reset();
            }}
            placeholder='Any invitation email'
            options={['NOT_SENT', 'QUEUED', 'SENT', 'DELIVERED', 'FAILED', 'BOUNCED']}
          />
        </div>
        {selected.length > 0 && (
          <div className='flex flex-wrap items-center gap-2 border-b border-[#CCEDDC] bg-[#E6F6EC] px-4 py-2 text-sm'>
            <b>{selected.length} selected</b>
            <Button
              size='sm'
              icon={Send}
              onClick={() => setCampaign({ kind: 'invite', scope: 'SELECTED' })}
            >
              Invite selected
            </Button>
            <Button
              size='sm'
              variant='secondary'
              icon={BellRing}
              onClick={() => setCampaign({ kind: 'remind', scope: 'SELECTED' })}
            >
              Remind selected
            </Button>
            <Button size='sm' variant='ghost' onClick={() => setSelected([])}>
              Clear
            </Button>
          </div>
        )}
        {list.isLoading ? (
          <Loading />
        ) : list.isError ? (
          <ErrorState error={list.error} onRetry={list.refetch} />
        ) : !items.length ? (
          <EmptyState title='No participants in this view' />
        ) : (
          <>
            <Table
              head={
                <>
                  <Th>
                    <input
                      type='checkbox'
                      aria-label='Select page'
                      className='size-4 rounded border-[#D0D5DD]'
                      checked={allOnPage}
                      onChange={() =>
                        setSelected((s) =>
                          allOnPage
                            ? s.filter((id) => !pageIds.includes(id))
                            : [...new Set([...s, ...pageIds])]
                        )
                      }
                    />
                  </Th>
                  <SortHeader label='Participant' field='fullName' sort={sort} onSort={onSort} />
                  <SortHeader label='Team' field='teamName' sort={sort} onSort={onSort} />
                  <SortHeader label='RSVP' field='rsvpStatus' sort={sort} onSort={onSort} />
                  <Th>Invitation</Th>
                  <SortHeader label='Responded' field='responseDate' sort={sort} onSort={onSort} />
                  <Th>Expires</Th>
                  <Th>Ticket</Th>
                  <Th className='text-right'>Actions</Th>
                </>
              }
            >
              {items.map((r) => (
                <tr key={r.id} className='hover:bg-[#F9FAFB]'>
                  <Td>
                    <input
                      type='checkbox'
                      aria-label={`Select ${r.fullName}`}
                      className='size-4 rounded border-[#D0D5DD]'
                      disabled={!r.isActive || !r.email}
                      checked={selected.includes(String(r.id))}
                      onChange={() => toggle(String(r.id))}
                    />
                  </Td>
                  <Td>
                    <button
                      type='button'
                      className='text-left hover:text-[#009E49]'
                      onClick={() => setOpenId(r.id)}
                    >
                      <b>{r.fullName}</b>
                      {!r.isActive && (
                        <Badge tone='slate' className='ml-2'>
                          Inactive
                        </Badge>
                      )}
                      <span className='block text-xs text-[#667085]'>
                        {r.email || <span className='text-amber-700'>No email</span>}
                      </span>
                    </button>
                  </Td>
                  <Td>{r.teamName}</Td>
                  <Td>
                    <StatusBadge status={r.rsvpStatus} />
                  </Td>
                  <Td>
                    <StatusBadge status={r.invitationStatus} />
                    <span className='block text-xs text-[#667085]'>
                      {r.invitationSentAt ? fmtDateTime(r.invitationSentAt) : ''}
                      {r.reminderCount ? ` · ${r.reminderCount} reminder(s)` : ''}
                    </span>
                  </Td>
                  <Td className='whitespace-nowrap text-xs'>{fmtDateTime(r.responseDate)}</Td>
                  <Td className='whitespace-nowrap text-xs'>
                    {r.rsvpStatus === 'PENDING' || r.rsvpStatus === 'EXPIRED'
                      ? fmtDateTime(r.rsvpExpiresAt)
                      : '—'}
                  </Td>
                  <Td className='font-mono text-xs'>{r.ticketId || '—'}</Td>
                  <Td className='whitespace-nowrap text-right'>
                    {r.rsvpId ? (
                      <Button
                        size='sm'
                        variant='ghost'
                        icon={RotateCcw}
                        onClick={() => setStatusFor(r)}
                      >
                        Change
                      </Button>
                    ) : (
                      <span className='text-xs text-[#98A2B3]'>not invited</span>
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
                reset();
              }}
            />
          </>
        )}
      </Card>

      <Campaigns />

      <CampaignDialog
        open={!!campaign}
        onClose={() => {
          setCampaign(null);
        }}
        kind={campaign?.kind}
        defaultScope={campaign?.scope || 'ALL'}
        selectedIds={selected}
      />
      {statusFor && (
        <RsvpStatusDialog
          open
          onClose={() => setStatusFor(null)}
          rsvpId={statusFor.rsvpId}
          currentStatus={statusFor.rsvpStatus}
          participantName={`${statusFor.fullName} · ${statusFor.teamName}`}
        />
      )}
      <ParticipantDrawer participantId={openId} onClose={() => setOpenId(null)} />
    </div>
  );
}
