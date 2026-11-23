import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { BrandPanel } from '../components/brand';
import { Button, Field, Input, Loading } from '../components/ui';
import { api, errMsg, storage, PUBLIC_TIMEOUT } from '../lib/api';
import { p } from '../lib/paths';

const ROLE_LABEL: Record<string, string> = {
  OFFICER: 'check-in officer',
  ADMIN: 'administrator',
  SUPER_ADMIN: 'super administrator'
};

/** Landing page for the "you've been added" invitation email: the staff member chooses a password. */
export default function SetPassword() {
  const { token = '' } = useParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const info = useQuery({
    queryKey: ['setup', token],
    queryFn: () =>
      api
        .get(`/auth/setup/${encodeURIComponent(token)}`, { timeout: PUBLIC_TIMEOUT })
        .then((r) => r.data as { name: string; email: string; role: string }),
    retry: false
  });

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirm) return setError('The two passwords don’t match.');
    setLoading(true);
    try {
      const { data } = await api.post(
        `/auth/setup/${encodeURIComponent(token)}`,
        { password },
        { timeout: PUBLIC_TIMEOUT }
      );
      storage.token = data.token;
      // Full reload so the auth context picks up the new session.
      location.assign(p(data.user.role === 'OFFICER' ? '/officer' : '/dashboard'));
    } catch (err) {
      setError(errMsg(err));
      setLoading(false);
    }
  }

  return (
    <div className='flex min-h-screen flex-col bg-white lg:flex-row'>
      <BrandPanel>
        <h4 className='mb-2 text-lg font-bold text-white'>Ogun Innovate Hackathon</h4>
        <p className='max-w-md text-xs leading-relaxed text-[#98A2B3] sm:text-sm'>
          Staff portal for RSVPs, QR tickets and event-day check-in.
        </p>
      </BrandPanel>

      <div className='flex flex-1 flex-col justify-start bg-white p-6 sm:p-10 lg:p-12 xl:p-16'>
        <div className='w-full max-w-md lg:mt-10'>
          {info.isLoading ? (
            <Loading label='Checking your invitation link…' />
          ) : info.isError ? (
            <div>
              <h1 className='platypi-gf mb-2 text-2xl font-bold tracking-tight text-[#0B4822] sm:text-3xl'>
                Link not valid
              </h1>
              <p className='mb-6 text-sm text-[#475467]'>{errMsg(info.error)}</p>
              <Link to={p('/login')} className='text-sm font-medium text-[#05A85C] hover:underline'>
                Go to staff sign in
              </Link>
            </div>
          ) : (
            <>
              <div className='mb-8'>
                <h1 className='platypi-gf mb-1.5 text-2xl font-bold tracking-tight text-[#0B4822] sm:text-3xl'>
                  Welcome, {info.data?.name.split(' ')[0]}
                </h1>
                <p className='text-xs text-[#667085] sm:text-sm'>
                  You've been added as a {ROLE_LABEL[info.data?.role || ''] || 'staff member'}.
                  Choose a password for <b className='text-[#344054]'>{info.data?.email}</b> to
                  activate your account.
                </p>
              </div>
              <form onSubmit={submit} className='space-y-5'>
                {/* lets password managers save the credential against the right username */}
                <input
                  type='email'
                  autoComplete='username'
                  value={info.data?.email || ''}
                  readOnly
                  hidden
                />
                <Field label='New password' hint='At least 6 characters.'>
                  <div className='relative'>
                    <Input
                      type={show ? 'text' : 'password'}
                      autoComplete='new-password'
                      required
                      minLength={6}
                      className='pr-10'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoFocus
                    />
                    <button
                      type='button'
                      onClick={() => setShow((s) => !s)}
                      aria-label={show ? 'Hide password' : 'Show password'}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#475467]'
                    >
                      {show ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
                    </button>
                  </div>
                </Field>
                <Field label='Confirm password'>
                  <Input
                    type={show ? 'text' : 'password'}
                    autoComplete='new-password'
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                </Field>
                {error && (
                  <p className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 sm:text-sm'>
                    {error}
                  </p>
                )}
                <Button type='submit' className='px-8' loading={loading}>
                  Set password & sign in <ArrowRight className='size-4' />
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
