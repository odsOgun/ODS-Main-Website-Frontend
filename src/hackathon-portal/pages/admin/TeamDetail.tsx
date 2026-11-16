import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, BellRing, Download, Pencil, Trash2, UserPlus } from 'lucide-react';
import { api, download } from '../../lib/api';
import { useAction, useEventQuery, useSessionOptions, withToast } from '../../lib/hooks';
import { fmtDateTime } from '../../lib/format';
import { p } from '../../lib/paths';
import type { Json } from '../../lib/types';
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  Loading,
  PageHeader,
  Select,
  StatCard,
  StatusBadge,
  Table,
  Td,
  Th
} from '../../components/ui';
import { TeamFormModal } from './Teams';
import ParticipantForm from '../../components/ParticipantForm';
import ParticipantDrawer from '../../components/ParticipantDrawer';

export default function TeamDetail() {
  const { teamId } = useParams();
  const nav = useNavigate();
  const [sessionId, setSessionId] = useState('');
  const sessions = useSessionOptions();
  const q = useEventQuery('team', `/teams/${teamId}`, sessionId ? { sessionId } : {});
  const [edit, setEdit] = useState(false);
  const [del, setDel] = useState(false);
  const [add, setAdd] = useState(false);
  const [confirm, setConfirm] = useState<'invite' | 'remind' | null>(null); // 'invite' | 'remind'
  const [openP, setOpenP] = useState<string | null>(null);
  const [zipping, setZipping] = useState(false);

  const invite = useAction<Json, void>(
    () => api.post('/rsvp/campaign', { scope: 'TEAM', teamId }).then((r) => r.data),
    {
      invalidate: ['team', 'teams', 'rsvp', 'dashboard'],
      success: (d) =>
        `Queued ${d.queued} invitation(s). Skipped: ${d.skippedAlreadyInvited} already invited, ${d.skippedResponded} responded, ${d.skippedNoEmail} without email.`,
      onSuccess: () => setConfirm(null)
    }
  );
  const remind = useAction<Json, void>(
    () => api.post('/rsvp/reminders', { scope: 'TEAM', teamId }).then((r) => r.data),
    {
      invalidate: ['team', 'rsvp'],
      success: (d) => `Queued ${d.queued} reminder(s) to members who have not responded.`,
      onSuccess: () => setConfirm(null)
    }
  );
  const remove = useAction<unknown, void>(() => api.delete(`/teams/${teamId}`), {
    invalidate: ['teams', 'teams-options', 'dashboard'],
    success: 'Team deleted',
    onSuccess: () => nav(p('/teams'))
  });

  if (q.isLoading) return <Loading />;
  if (q.isError) return <ErrorState error={q.error} onRetry={q.refetch} />;
  const { team, stats, members } = q.data;

  return (
    <div className='space-y-6'>
      <Link
        to={p('/teams')}
        className='inline-flex items-center gap-1 text-sm text-[#667085] hover:text-[#101828]'
      >
        <ArrowLeft className='size-4' /> All teams
      </Link>
      <PageHeader
        title={team.name}
        description={team.description || `${stats?.members || 0} member(s)`}
        actions={
          <>
            <Button variant='secondary' icon={UserPlus} onClick={() => setAdd(true)}>
              Add member
            </Button>
            <Button variant='secondary' icon={Send} onClick={() => setConfirm('invite')}>
              Invite team
            </Button>
            <Button variant='secondary' icon={BellRing} onClick={() => setConfirm('remind')}>
              Remind non-responders
            </Button>
            <Button
              variant='secondary'
              icon={Download}
              loading={zipping}
              disabled={!stats?.ticketsGenerated}
              onClick={async () => {
                setZipping(true);
                try {
                  await withToast(download('/tickets/export/zip', { teamId }, 'team-qr.zip'));
                } catch {
                  /* toasted */
                } finally {
                  setZipping(false);
                }
              }}
            >
              QR codes (ZIP)
            </Button>
            <Button variant='ghost' icon={Pencil} onClick={() => setEdit(true)}>
              Edit
            </Button>
            <Button
              variant='ghost'
              icon={Trash2}
              className='text-red-600 hover:bg-red-50'
              onClick={() => setDel(true)}
            >
              Delete
            </Button>
          </>
        }
      />
      {stats && (
        <div className='grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8'>
          <StatCard label='Active members' value={stats.active} />
          <StatCard label='Confirmed' value={stats.confirmed} tone='green' />
          <StatCard label='Declined' value={stats.declined} />
          <StatCard label='Pending' value={stats.pending} />
          <StatCard label='Tickets gen.' value={stats.ticketsGenerated} />
          <StatCard label='Tickets sent' value={stats.ticketsSent} />
          <StatCard
            label='Checked in'
            value={stats.checkedIn}
            sub={`${stats.notCheckedIn} not checked in`}
          />
          <StatCard
            label='Attendance'
            value={`${stats.attendancePct}%`}
            sub={
              sessionId ? (stats.fullyCheckedIn ? 'Fully checked in' : 'Incomplete') : 'any session'
            }
          />
        </div>
      )}
      <Card
        title='Members'
        actions={
          <Select
            className='w-60'
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            placeholder='Attendance: any session'
            options={sessions.options.map((o) => ({ ...o, label: `Attendance: ${o.label}` }))}
          />
        }
        bodyClass='p-0'
      >
        {!members.length ? (
          <EmptyState
            title='No members in this team'
            action={
              <Button icon={UserPlus} onClick={() => setAdd(true)}>
                Add member
              </Button>
            }
          />
        ) : (
          <Table
            head={
              <>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>RSVP</Th>
                <Th>Responded</Th>
                <Th>Ticket</Th>
                <Th>Ticket email</Th>
                <Th>Attendance</Th>
              </>
            }
          >
            {members.map((m: Json) => (
              <tr
                key={m.id}
                className='cursor-pointer hover:bg-[#F9FAFB]'
                onClick={() => setOpenP(m.id)}
              >
                <Td>
                  <b>{m.fullName}</b>
                  {!m.isActive && (
                    <Badge className='ml-2' tone='slate'>
                      Inactive
                    </Badge>
                  )}
                  <span className='block text-xs text-[#98A2B3]'>{m.memberId}</span>
                </Td>
                <Td className='text-[#475467]'>
                  {m.email || <span className='text-amber-700'>No email</span>}
                </Td>
                <Td>{m.teamRole || '—'}</Td>
                <Td>
                  <StatusBadge status={m.rsvpStatus} />
                </Td>
                <Td className='text-xs'>{fmtDateTime(m.responseDate)}</Td>
                <Td className='font-mono text-xs'>
                  {m.ticketId ? (
                    <>
                      {m.ticketId} {m.ticketStatus === 'REVOKED' && <Badge status='REVOKED' />}
                    </>
                  ) : (
                    '—'
                  )}
                </Td>
                <Td>
                  <StatusBadge status={m.ticketEmailStatus} />
                </Td>
                <Td>
                  {m.checkedIn ? (
                    <Badge tone='green'>In · {fmtDateTime(m.checkInTime)}</Badge>
                  ) : (
                    <Badge tone='slate'>Not checked in</Badge>
                  )}
                </Td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
      {edit && <TeamFormModal open onClose={() => setEdit(false)} team={team} />}
      {add && <ParticipantForm open onClose={() => setAdd(false)} defaultTeamId={team._id} />}
      <ParticipantDrawer participantId={openP} onClose={() => setOpenP(null)} />
      <ConfirmDialog
        open={confirm === 'invite'}
        onClose={() => setConfirm(null)}
        title='Send RSVP invitations to this team?'
        confirmLabel='Send invitations'
        loading={invite.isPending}
        onConfirm={() => invite.mutate()}
        message='Each active member with an email receives their own personal RSVP link. Members already invited or who have responded are skipped.'
      />
      <ConfirmDialog
        open={confirm === 'remind'}
        onClose={() => setConfirm(null)}
        title='Send reminders?'
        confirmLabel='Send reminders'
        loading={remind.isPending}
        onConfirm={() => remind.mutate()}
        message='Reminders go only to members who were invited and have not responded yet (and whose link has not expired).'
      />
      <ConfirmDialog
        open={del}
        onClose={() => setDel(false)}
        title='Delete team?'
        tone='danger'
        confirmLabel='Delete'
        loading={remove.isPending}
        onConfirm={() => remove.mutate()}
        message={
          <>
            This deletes <b>{team.name}</b> and all its members, RSVPs and tickets. Not possible if
            any member has checked in.
          </>
        }
      />
    </div>
  );
}
