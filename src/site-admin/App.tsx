import { lazy, useEffect, useState, type ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from '../hackathon-portal/context/AuthContext';
import { Loading } from '../hackathon-portal/components/ui';
import { p } from '../hackathon-portal/lib/paths';
import AdminShell from './AdminShell';
import '../hackathon-portal/portal.css';

const Overview = lazy(() => import('./pages/Overview'));
const Registrations = lazy(() => import('./pages/Registrations'));
const Tickets = lazy(() => import('./pages/Tickets'));
const Orders = lazy(() => import('./pages/Orders'));
const News = lazy(() => import('./pages/News'));

/** Signs in through the hackathon portal's staff login; only ADMIN / SUPER_ADMIN accounts get in. */
function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, ready, isAdmin } = useAuth();
  const loc = useLocation();
  if (!ready) return <Loading label='Signing you in…' />;
  if (!user)
    return <Navigate to={`${p('/login')}?next=${encodeURIComponent(loc.pathname)}`} replace />;
  if (!isAdmin)
    return (
      <div className='flex min-h-screen items-center justify-center p-6 text-center'>
        <div className='max-w-sm'>
          <h1 className='platypi-gf mb-2 text-2xl font-bold text-[#0B4822]'>Admins only</h1>
          <p className='mb-4 text-sm text-[#475467]'>
            Your account ({user.email}) is a check-in officer account. Ask an administrator for
            access.
          </p>
          <a href={p('/officer')} className='text-sm font-medium text-[#009E49] hover:underline'>
            Go to check-in
          </a>
        </div>
      </div>
    );
  return <>{children}</>;
}

/**
 * General ODS admin dashboard, mounted by src/main.tsx at /admin/*.
 * Shares the hackathon portal's staff accounts, API client and UI kit; its API lives at
 * /api/hackathon-portal/site/* (backend: resources/site-admin).
 */
export default function SiteAdmin() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (n, err) => {
              const status = (err as { response?: { status?: number } })?.response?.status;
              return n < 2 && (!status || status >= 500);
            },
            refetchOnWindowFocus: false,
            staleTime: 30_000
          }
        }
      })
  );

  useEffect(() => {
    const prev = document.title;
    document.title = 'Admin · Ogun Digital Summit';
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className='hp-root'>
          <RequireAdmin>
            <Routes>
              <Route element={<AdminShell />}>
                <Route index element={<Overview />} />
                <Route path='registrations/:collection' element={<Registrations />} />
                <Route path='tickets' element={<Tickets />} />
                <Route path='orders' element={<Orders />} />
                <Route path='news' element={<News />} />
                <Route path='*' element={<Navigate to='/admin' replace />} />
              </Route>
            </Routes>
          </RequireAdmin>
        </div>
      </AuthProvider>
      <Toaster richColors position='top-right' closeButton />
    </QueryClientProvider>
  );
}
