import { useState } from 'react';
import {
  Search,
  Download,
  MailWarning,
  Ticket,
  CheckCircle2,
  MailCheck,
  Clock,
  MailX,
  Ban,
  Users,
  Wand2
} from 'lucide-react';
import { api, clean, download } from '../../lib/api';
import { useAction, useEventQuery, useTeamOptions, withToast } from '../../lib/hooks';
import { fmtDateTime } from '../../lib/format';
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  Input,
  Loading,
  PageHeader,
  Pagination,
  Select,
  SortHeader,
  StatCard,
  Table,
  Td,
  Th,
  useDebounced
} from '../../components/ui';
import TicketDetailModal from '../../components/TicketDetailModal';
import type { Json } from '../../lib/types';

const INV = ['tickets', 'tickets-stats', 'dashboard', 'email-logs', 'participants'];

export default function Tickets() {
  const [q, setQ] = useState('');
  const search = useDebounced(q);
  const [status, setStatus] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [teamId, setTeamId] = useState('');
  const [sort, setSort] = useState('-generatedAt');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [openId, setOpenId] = useState<string | null>(null);
  const [zipTeam, setZipTeam] = useState('');
  const [zipping, setZipping] = useState(false);
  const [confirm, setConfirm] = useState<'resend' | 'issue' | null>(null);
  const teams = useTeamOptions();
  const stats = useEventQuery('tickets-stats', '/tickets/stats', undefined, {
    refetchInterval: 15000
  });
  const list = useEventQuery(
    'tickets',
    '/tickets',
    clean({ q: search, status, emailStatus, teamId, sort, page, limit }),
    { refetchInterval: 15000 }
  );
  const resendFailed = useAction<Json, void>(
    () => api.post('/tickets/resend-failed').then((r) => r.data),
    {
      invalidate: INV,
      success: (d) => `Queued ${d.queued} ticket email(s) — same QR codes`,
      onSuccess: () => setConfirm(null)
    }
  );
  const issueMissing = useAction<Json, void>(
    () => api.post('/tickets/issue-missing').then((r) => r.data),
    {
      invalidate: INV,
      success: (d) =>
        d.issued
          ? `Issued ${d.issued} missing ticket(s)`
          : 'Every confirmed participant already has a ticket',
      onSuccess: () => setConfirm(null)
    }
  );
  const onSort = (s: string) => {
    setSort(s);
    setPage(1);
  };
  const s = stats.data;

  async function zip(team: string) {
    setZipping(true);
    try {
      await withToast(
        download('/tickets/export/zip', team ? { teamId: team } : {}, 'qr-tickets.zip')
      );
    } catch {
      /* toasted */
    } finally {
      setZipping(false);
    }
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title='QR Tickets'
        description='One ticket per confirmed participant. Tickets are generated automatically on a YES response.'
        actions={
          <>
            <Button variant='secondary' icon={Wand2} onClick={() => setConfirm('issue')}>
              Issue missing
            </Button>
            <Button
              variant='secondary'
              icon={MailWarning}
              disabled={!s?.failed}
              onClick={() => setConfirm('resend')}
            >
              Resend failed ({s?.failed ?? 0})
            </Button>
            <Button
              icon={Download}
              loading={zipping && !zipTeam}
              disabled={!s?.active}
              onClick={() => zip('')}
            >
              All QR codes (ZIP)
            </Button>
          </>
        }
      />

      {stats.isError ? (
        <ErrorState error={stats.error} onRetry={stats.refetch} />
      ) : (
        <div className='grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7'>
          <StatCard
            label='Confirmed'
            value={s?.confirmedParticipants}
            icon={CheckCircle2}
            tone='green'
          />
          <StatCard
            label='Generated'
            value={s?.generated}
            sub={s && `${s.active} active`}
            icon={Ticket}
            tone='violet'
          />
          <StatCard label='Sent' value={s?.sent} icon={MailCheck} tone='teal' />
          <StatCard
            label='Delivered'
            value={s?.delivered}
            sub='via provider webhook'
            icon={MailCheck}
            tone='green'
          />
          <StatCard
            label='Awaiting delivery'
            value={s?.awaitingDelivery}
            icon={Clock}
            tone='blue'
          />
          <StatCard
            label='Failed emails'
            value={s?.failed}
            icon={MailX}
            tone={s?.failed ? 'red' : 'slate'}
          />
          <StatCard label='Revoked' value={s?.revoked} icon={Ban} tone='slate' />
        </div>
      )}

      <Card bodyClass='p-0'>
        <div className='flex flex-wrap items-center gap-3 border-b border-[#F2F4F7] p-4'>
          <div className='relative min-w-56 flex-1'>
            <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98A2B3]' />
            <Input
              className='pl-9'
              placeholder='Search ticket ID, name or email…'
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            className='w-48'
            value={teamId}
            onChange={(e) => {
              setTeamId(e.target.value);
              setPage(1);
            }}
            placeholder='All teams'
            options={teams.options}
          />
          <Select
            className='w-40'
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            placeholder='Any status'
            options={['ACTIVE', 'REVOKED']}
          />
          <Select
            className='w-44'
            value={emailStatus}
            onChange={(e) => {
              setEmailStatus(e.target.value);
              setPage(1);
            }}
            placeholder='Any email status'
            options={['NOT_SENT', 'QUEUED', 'SENT', 'DELIVERED', 'FAILED', 'BOUNCED']}
          />
        </div>
        {list.isLoading ? (
          <Loading />
        ) : list.isError ? (
          <ErrorState error={list.error} onRetry={list.refetch} />
        ) : !list.data.items.length ? (
          <EmptyState
            icon={Ticket}
            title='No tickets'
            description='Tickets appear here once participants confirm their RSVP.'
          />
        ) : (
          <>
            <Table
              head={
                <>
                  <SortHeader label='Ticket ID' field='ticketId' sort={sort} onSort={onSort} />
                  <Th>Participant</Th>
                  <Th>Team</Th>
                  <SortHeader label='Status' field='status' sort={sort} onSort={onSort} />
                  <SortHeader label='Email' field='emailStatus' sort={sort} onSort={onSort} />
                  <SortHeader label='Generated' field='generatedAt' sort={sort} onSort={onSort} />
                  <Th className='text-right' />
                </>
              }
            >
              {list.data.items.map((t: Json) => (
                <tr
                  key={t._id}
                  className='cursor-pointer hover:bg-[#F9FAFB]'
                  onClick={() => setOpenId(t._id)}
                >
                  <Td className='font-mono text-xs font-semibold'>{t.ticketId}</Td>
                  <Td>
                    <b>{t.participantId?.fullName}</b>
                    <span className='block text-xs text-[#667085]'>{t.participantId?.email}</span>
                  </Td>
                  <Td>{t.teamId?.name}</Td>
                  <Td>
                    <Badge status={t.status} />
                  </Td>
                  <Td>
                    <Badge status={t.emailStatus} />
                    {t.emailError && (
                      <span
                        className='block max-w-56 truncate text-xs text-red-600'
                        title={t.emailError}
                      >
                        {t.emailError}
                      </span>
                    )}
                  </Td>
                  <Td className='whitespace-nowrap text-xs'>{fmtDateTime(t.generatedAt)}</Td>
                  <Td className='text-right'>
                    <Button size='sm' variant='ghost'>
                      Open
                    </Button>
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

      <Card
        title='Download QR codes for a team'
        description="ZIP of every active ticket's QR code for the team, plus a manifest.csv."
      >
        <div className='flex flex-wrap gap-3'>
          <Select
            className='w-72'
            value={zipTeam}
            onChange={(e) => setZipTeam(e.target.value)}
            placeholder='Select team'
            options={teams.options}
          />
          <Button
            variant='secondary'
            icon={Users}
            disabled={!zipTeam}
            loading={zipping && !!zipTeam}
            onClick={() => zip(zipTeam)}
          >
            Download team ZIP
          </Button>
        </div>
      </Card>

      <TicketDetailModal ticketId={openId} onClose={() => setOpenId(null)} />
      <ConfirmDialog
        open={confirm === 'resend'}
        onClose={() => setConfirm(null)}
        title='Resend failed ticket emails?'
        confirmLabel='Resend'
        loading={resendFailed.isPending}
        onConfirm={() => resendFailed.mutate()}
        message='Every active ticket whose email failed or bounced is emailed again with the same QR code. No new tickets are generated.'
      />
      <ConfirmDialog
        open={confirm === 'issue'}
        onClose={() => setConfirm(null)}
        title='Issue missing tickets?'
        confirmLabel='Issue tickets'
        loading={issueMissing.isPending}
        onConfirm={() => issueMissing.mutate()}
        message='Safety net: any confirmed, active participant without an active ticket gets one (and it is emailed). Participants who already have a ticket are untouched.'
      />
    </div>
  );
}
