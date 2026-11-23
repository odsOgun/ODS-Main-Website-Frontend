import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { BrandPanel } from '../components/brand';
import { useAuth } from '../context/AuthContext';
import { Button, Field, Input } from '../components/ui';
import { errMsg } from '../lib/api';
import { p } from '../lib/paths';

export default function Login() {
  const { login, user, ready } = useAuth();
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (ready && user)
    return <Navigate to={p(user.role === 'OFFICER' ? '/officer' : '/dashboard')} replace />;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const u = await login(email.trim(), password);
      const next = sp.get('next');
      const isAdmin = u.role !== 'OFFICER';
      // `next` is a portal-relative path (e.g. '/teams'); only accept in-portal paths
      const safeNext =
        next && next.startsWith('/') && !next.startsWith('//') && next !== '/' ? next : null;
      // the general site admin (/admin) shares these staff accounts; its `next` is a site path
      if (isAdmin && safeNext && /^\/admin(\/|$)/.test(safeNext))
        return nav(safeNext, { replace: true });
      nav(
        p(
          safeNext && (isAdmin || safeNext.startsWith('/officer'))
            ? safeNext
            : isAdmin
              ? '/dashboard'
              : '/officer'
        ),
        { replace: true }
      );
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='flex min-h-screen flex-col bg-white lg:flex-row'>
      <BrandPanel>
        <h4 className='mb-2 text-lg font-bold text-white'>Ogun Innovate Hackathon</h4>
        <p className='max-w-md text-xs leading-relaxed text-[#98A2B3] sm:text-sm'>
          Manage team RSVPs, personal QR tickets and event-day check-in for the Ogun Digital Summit
          2026 hackathon.
        </p>
      </BrandPanel>

      <div className='flex flex-1 flex-col justify-start bg-white p-6 sm:p-10 lg:p-12 xl:p-16'>
        <a
          href='/hackathon'
          className='group mb-10 inline-flex w-fit items-center gap-2 text-xs font-medium text-[#475467] transition-colors hover:text-[#101828] sm:text-sm'
        >
          <ArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-0.5' /> Back
          to the hackathon
        </a>
        <div className='w-full max-w-md lg:mt-10'>
          <div className='mb-8'>
            <h1 className='platypi-gf mb-1.5 text-2xl font-bold tracking-tight text-[#0B4822] sm:text-3xl'>
              Staff sign in
            </h1>
            <p className='text-xs text-[#667085] sm:text-sm'>
              For hackathon organisers and check-in officers.
            </p>
          </div>
          <form onSubmit={submit} className='space-y-5'>
            <Field label='Email address'>
              <Input
                type='email'
                autoComplete='username'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='you@example.com'
                autoFocus
              />
            </Field>
            <Field label='Password'>
              <Input
                type='password'
                autoComplete='current-password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Your password'
              />
            </Field>
            {error && (
              <p className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 sm:text-sm'>
                {error}
              </p>
            )}
            <Button type='submit' className='px-8' loading={loading}>
              Sign in <ArrowRight className='size-4' />
            </Button>
          </form>
          <p className='mt-8 text-xs text-[#667085]'>
            Participants don't sign in here: they respond through the personal link in their
            invitation email.
          </p>
        </div>
      </div>
    </div>
  );
}
