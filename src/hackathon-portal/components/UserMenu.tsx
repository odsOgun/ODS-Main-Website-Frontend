import { useEffect, useRef, useState } from 'react';
import { ChevronDown, KeyRound, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Badge } from './ui';
import { p } from '../lib/paths';
import ChangePasswordDialog from './ChangePasswordDialog';

export default function UserMenu({ dark }: { dark?: boolean }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [pw, setPw] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  if (!user) return null;
  return (
    <div className='relative' ref={ref}>
      <button
        type='button'
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${dark ? 'text-white hover:bg-white/10' : 'text-[#344054] hover:bg-[#F2F4F7]'}`}
      >
        <span className='flex size-8 items-center justify-center rounded-full bg-[#009E49] text-xs font-bold text-white'>
          {user.name
            .split(' ')
            .map((s: string) => s[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()}
        </span>
        <span className='hidden max-w-32 truncate sm:block'>{user.name}</span>
        <ChevronDown className='size-4 opacity-60' />
      </button>
      {open && (
        <div className='absolute right-0 z-40 mt-2 w-60 rounded-xl border border-[#EAECF0] bg-white p-1 text-[#344054] shadow-lg'>
          <div className='px-3 py-2'>
            <p className='truncate text-sm font-medium text-[#101828]'>{user.name}</p>
            <p className='truncate text-xs text-[#667085]'>{user.email}</p>
            <Badge status={user.role} className='mt-1.5' />
          </div>
          <hr className='my-1 border-[#F2F4F7]' />
          <button
            type='button'
            className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-[#F9FAFB]'
            onClick={() => {
              setOpen(false);
              setPw(true);
            }}
          >
            <KeyRound className='size-4' /> Change password
          </button>
          <button
            type='button'
            className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50'
            onClick={async () => {
              await logout();
              nav(p('/login'));
            }}
          >
            <LogOut className='size-4' /> Sign out
          </button>
        </div>
      )}
      <ChangePasswordDialog open={pw} onClose={() => setPw(false)} />
    </div>
  );
}
