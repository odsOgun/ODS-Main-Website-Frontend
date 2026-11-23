import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { api, errMsg } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Button, Field, Input, Modal } from './ui';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ChangePasswordDialog({ open, onClose }: Props) {
  const { setToken } = useAuth();
  const [f, setF] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const mismatch = !!f.confirm && f.newPassword !== f.confirm;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (f.newPassword !== f.confirm) return;
    setLoading(true);
    try {
      const { data } = await api.post('/auth/change-password', {
        currentPassword: f.currentPassword,
        newPassword: f.newPassword
      });
      setToken(data.token);
      toast.success('Password changed. Other sessions have been signed out.');
      setF({ currentPassword: '', newPassword: '', confirm: '' });
      onClose();
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title='Change password' size='sm'>
      <form onSubmit={submit} className='space-y-3'>
        <Field label='Current password'>
          <Input
            type='password'
            required
            value={f.currentPassword}
            onChange={(e) => setF({ ...f, currentPassword: e.target.value })}
            autoComplete='current-password'
          />
        </Field>
        <Field label='New password' hint='At least 6 characters.'>
          <Input
            type='password'
            required
            minLength={6}
            value={f.newPassword}
            onChange={(e) => setF({ ...f, newPassword: e.target.value })}
            autoComplete='new-password'
          />
        </Field>
        <Field label='Confirm new password' error={mismatch ? 'Passwords do not match' : undefined}>
          <Input
            type='password'
            required
            value={f.confirm}
            onChange={(e) => setF({ ...f, confirm: e.target.value })}
            autoComplete='new-password'
          />
        </Field>
        <div className='flex justify-end gap-2 pt-2'>
          <Button variant='secondary' onClick={onClose}>
            Cancel
          </Button>
          <Button type='submit' loading={loading} disabled={mismatch || f.newPassword.length < 6}>
            Update password
          </Button>
        </div>
      </form>
    </Modal>
  );
}
