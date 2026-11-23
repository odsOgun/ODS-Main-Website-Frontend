import { useState, type ChangeEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Pencil, ShieldCheck, Search, Send, Trash2 } from 'lucide-react';
import { api, get, clean } from '../../lib/api';
import { useAction } from '../../lib/hooks';
import { useAuth } from '../../context/AuthContext';
import { fmtDateTime } from '../../lib/format';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  ConfirmDialog,
  EmptyState,
  Field,
  IconButton,
  Input,
  Modal,
  PageHeader,
  QueryState,
  Select,
  Table,
  Td,
  Th,
  useDebounced
} from '../../components/ui';
import type { Json } from '../../lib/types';

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  user: Json | null;
}

function UserForm({ open, onClose, user }: UserFormProps) {
  const { isSuper, user: me } = useAuth();
  const roles = isSuper ? ['OFFICER', 'ADMIN', 'SUPER_ADMIN'] : ['OFFICER'];
  const [f, setF] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    role: user?.role || 'OFFICER',
    isActive: user?.isActive ?? true
  });
  const set =
    (k: keyof typeof f) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setF((p) => ({
        ...p,
        [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
      }));
  const self = !!user && user._id === me?._id;
  // People sign in with their email, so it can only change before they've accepted the invite.
  const emailEditable = !user || !!user.pendingSetup;
  const emailChanged = !!user && f.email.trim().toLowerCase() !== user.email;
  const save = useAction<Json, void>(
    () =>
      user
        ? api
            .put(
              `/admin/users/${user._id}`,
              clean({
                name: f.name,
                email: emailChanged ? f.email.trim() : undefined,
                phone: f.phone.trim() === (user.phone || '') ? undefined : f.phone.trim(),
                role: self ? undefined : f.role,
                isActive: self ? undefined : f.isActive,
                password: f.password || undefined
              })
            )
            .then((r) => r.data)
        : api
            .post(
              '/admin/users',
              clean({ name: f.name, email: f.email, phone: f.phone.trim(), role: f.role })
            )
            .then((r) => r.data),
    {
      invalidate: ['users'],
      success: (d) =>
        d?.inviteSent === false
          ? ''
          : !user
            ? `Account created. An invitation to set a password was emailed to ${f.email}.`
            : d?.inviteSent
              ? `Email updated. A new invitation was sent to ${d.email}.`
              : 'User updated',
      onSuccess: (d) => {
        if (d?.inviteSent === false)
          toast.warning(
            `${user ? 'Saved' : 'Account created'}, but the invitation email failed (${d.inviteError}). Use "Resend invite" to try again.`
          );
        onClose();
      }
    }
  );
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={user ? `Edit ${user.name}` : 'New staff account'}
      size='sm'
    >
      <form
        className='space-y-4'
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <Field label='Name' required>
          <Input required minLength={2} value={f.name} onChange={set('name')} />
        </Field>
        <Field
          label='Email'
          required
          hint={
            !user
              ? undefined
              : emailEditable
                ? emailChanged
                  ? 'A new invitation will go to this address; the old link stops working.'
                  : "They haven't accepted their invite yet, so you can still correct this."
                : "Can't be changed after they've set their password."
          }
        >
          <Input
            type='email'
            required
            disabled={!emailEditable}
            value={f.email}
            onChange={set('email')}
          />
        </Field>
        <Field label='Phone number'>
          <Input
            type='tel'
            autoComplete='tel'
            maxLength={50}
            placeholder='e.g. 0801 234 5678'
            value={f.phone}
            onChange={set('phone')}
          />
        </Field>
        {user ? (
          <Field
            label='Reset password (optional)'
            hint='At least 6 characters. Resetting signs the user out everywhere.'
          >
            <Input
              type='password'
              autoComplete='new-password'
              minLength={6}
              value={f.password}
              onChange={set('password')}
            />
          </Field>
        ) : (
          <p className='rounded-xl bg-[#F0FAF4] px-4 py-3 text-xs text-[#0B4822]'>
            We'll email them a link to set their own password. The link expires in 72 hours.
          </p>
        )}
        <Field
          label='Role'
          hint={!isSuper ? 'Admins can manage check-in officers only.' : undefined}
        >
          <Select
            value={f.role}
            onChange={set('role')}
            disabled={self}
            options={roles.map((r) => ({
              value: r,
              label:
                r === 'OFFICER'
                  ? 'Check-in officer'
                  : r === 'ADMIN'
                    ? 'Administrator'
                    : 'Super admin'
            }))}
          />
        </Field>
        {user && !self && (
          <Checkbox label='Account active' checked={f.isActive} onChange={set('isActive')} />
        )}
        <div className='flex justify-end gap-2'>
          <Button variant='secondary' onClick={onClose}>
            Cancel
          </Button>
          <Button type='submit' loading={save.isPending}>
            {user ? 'Save' : 'Create & send invite'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default function Users() {
  const { isSuper, user: me } = useAuth();
  const [deleting, setDeleting] = useState<Json>(null);
  const [role, setRole] = useState('');
  const [q, setQ] = useState('');
  const search = useDebounced(q);
  const [editing, setEditing] = useState<Json>(null);
  const users = useQuery({
    queryKey: ['users', role, search],
    queryFn: () => get('/admin/users', clean({ role, q: search })),
    placeholderData: (prev: Json) => prev
  });
  const canEdit = (u: Json) => isSuper || u.role === 'OFFICER';
  const resend = useAction<Json, Json>((u) => api.post(`/admin/users/${u._id}/resend-invite`), {
    invalidate: ['users'],
    success: (_d, u) => `Invitation re-sent to ${u.email}`
  });
  const remove = useAction<Json, Json>((u) => api.delete(`/admin/users/${u._id}`), {
    invalidate: ['users'],
    success: (_d, u) => `${u.name} was deleted`,
    onSuccess: () => setDeleting(null),
    onError: () => setDeleting(null)
  });
  return (
    <div>
      <PageHeader
        title='Check-in Officers & Staff'
        description='Officers can only scan tickets and look up participants. Administrators manage everything else.'
        actions={
          <Button icon={Plus} onClick={() => setEditing('new')}>
            New account
          </Button>
        }
      />
      <Card bodyClass='p-0'>
        <div className='flex flex-wrap gap-3 border-b border-[#F2F4F7] p-4'>
          <div className='relative min-w-56 flex-1'>
            <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98A2B3]' />
            <Input
              className='pl-9'
              placeholder='Search name or email…'
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <Select
            className='w-48'
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder='All roles'
            options={['OFFICER', 'ADMIN', 'SUPER_ADMIN']}
          />
        </div>
        <QueryState
          query={users}
          isEmpty={(d) => !d.items.length}
          empty={<EmptyState icon={ShieldCheck} title='No accounts found' />}
        >
          {(d) => (
            <Table
              head={
                <>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Phone</Th>
                  <Th>Role</Th>
                  <Th>Status</Th>
                  <Th>Last login</Th>
                  <Th>Created</Th>
                  <Th />
                </>
              }
            >
              {d.items.map((u: Json) => (
                <tr key={u._id}>
                  <Td>
                    <b>{u.name}</b>
                  </Td>
                  <Td>{u.email}</Td>
                  <Td className='whitespace-nowrap'>{u.phone || '—'}</Td>
                  <Td>
                    <Badge status={u.role} />
                  </Td>
                  <Td>
                    {!u.isActive ? (
                      <Badge tone='slate'>Disabled</Badge>
                    ) : u.pendingSetup ? (
                      <Badge tone='amber'>Invite pending</Badge>
                    ) : (
                      <Badge tone='green'>Active</Badge>
                    )}
                  </Td>
                  <Td className='text-xs'>{fmtDateTime(u.lastLoginAt)}</Td>
                  <Td className='text-xs'>{fmtDateTime(u.createdAt)}</Td>
                  <Td className='text-right'>
                    {canEdit(u) && u.pendingSetup && u.isActive && (
                      <IconButton
                        icon={Send}
                        label='Resend invite'
                        disabled={resend.isPending}
                        onClick={() => resend.mutate(u)}
                      />
                    )}
                    {canEdit(u) && (
                      <IconButton icon={Pencil} label='Edit' onClick={() => setEditing(u)} />
                    )}
                    {canEdit(u) && u._id !== me?._id && (
                      <IconButton
                        icon={Trash2}
                        label='Delete'
                        className='hover:text-red-600'
                        onClick={() => setDeleting(u)}
                      />
                    )}
                  </Td>
                </tr>
              ))}
            </Table>
          )}
        </QueryState>
      </Card>
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => remove.mutate(deleting)}
        loading={remove.isPending}
        tone='danger'
        title={deleting ? `Delete ${deleting.name}?` : 'Delete account?'}
        message={
          deleting?.pendingSetup
            ? `${deleting.email} hasn't accepted their invite yet. Deleting removes the account and their invite link stops working.`
            : 'This permanently removes the account. Accounts that have already checked people in can’t be deleted; disable them instead so the history keeps their name.'
        }
        confirmLabel='Delete'
      />
      {editing && (
        <UserForm open onClose={() => setEditing(null)} user={editing === 'new' ? null : editing} />
      )}
    </div>
  );
}
