import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import { Loading } from './components/ui';
import AdminLayout from './layouts/AdminLayout';
import OfficerLayout from './layouts/OfficerLayout';
import Login from './pages/Login';
import { p, portalRelative } from './lib/paths';
import './portal.css';

const SetPassword = lazy(() => import('./pages/SetPassword'));
const RsvpPage = lazy(() => import('./pages/public/RsvpPage'));
const TicketPage = lazy(() => import('./pages/public/TicketPage'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Events = lazy(() => import('./pages/admin/Events'));
const Teams = lazy(() => import('./pages/admin/Teams'));
const TeamDetail = lazy(() => import('./pages/admin/TeamDetail'));
const Participants = lazy(() => import('./pages/admin/Participants'));
const ImportCsv = lazy(() => import('./pages/admin/ImportCsv'));
const Rsvp = lazy(() => import('./pages/admin/Rsvp'));
const Tickets = lazy(() => import('./pages/admin/Tickets'));
const CheckIn = lazy(() => import('./pages/admin/CheckIn'));
const Sessions = lazy(() => import('./pages/admin/Sessions'));
const Reports = lazy(() => import('./pages/admin/Reports'));
const EmailLogs = lazy(() => import('./pages/admin/EmailLogs'));
const Users = lazy(() => import('./pages/admin/Users'));
const AuditLogs = lazy(() => import('./pages/admin/AuditLogs'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const OfficerHome = lazy(() => import('./pages/officer/OfficerHome'));

function RequireAuth({ admin, children }: { admin?: boolean; children: ReactNode }) {
  const { user, ready, isAdmin } = useAuth();
  const loc = useLocation();
  if (!ready) return <Loading label='Signing you in…' />;
  if (!user)
    return (
      <Navigate
        to={`${p('/login')}?next=${encodeURIComponent(portalRelative(loc.pathname))}`}
        replace
      />
    );
  if (admin && !isAdmin) return <Navigate to={p('/officer')} replace />;
  return <>{children}</>;
}

function Home() {
  const { user, ready, isAdmin } = useAuth();
  if (!ready) return <Loading />;
  if (!user) return <Navigate to={p('/login')} replace />;
  return <Navigate to={p(isAdmin ? '/dashboard' : '/officer')} replace />;
}

/** Old emailed links used /rsvp/<token>; send them to /confirm/<token>. */
function LegacyConfirmRedirect() {
  const { token = '' } = useParams();
  return <Navigate to={p(`/confirm/${encodeURIComponent(token)}`)} replace />;
}

function PortalRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path='login' element={<Login />} />
        <Route path='set-password/:token' element={<SetPassword />} />
        <Route path='confirm/:token' element={<RsvpPage />} />
        {/* Links in invitation emails sent before the rename */}
        <Route path='rsvp/:token' element={<LegacyConfirmRedirect />} />
        <Route path='ticket/:credential' element={<TicketPage />} />
        <Route index element={<Home />} />
        <Route
          path='officer'
          element={
            <RequireAuth>
              <OfficerLayout />
            </RequireAuth>
          }
        >
          <Route index element={<OfficerHome />} />
        </Route>
        <Route
          element={
            <RequireAuth admin>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='events' element={<Events />} />
          <Route path='teams' element={<Teams />} />
          <Route path='teams/:teamId' element={<TeamDetail />} />
          <Route path='participants' element={<Participants />} />
          <Route path='import' element={<ImportCsv />} />
          <Route path='rsvp' element={<Rsvp />} />
          <Route path='tickets' element={<Tickets />} />
          <Route path='check-in' element={<CheckIn />} />
          <Route path='sessions' element={<Sessions />} />
          <Route path='reports' element={<Reports />} />
          <Route path='email-logs' element={<EmailLogs />} />
          <Route path='users' element={<Users />} />
          <Route path='audit-logs' element={<AuditLogs />} />
          <Route path='settings' element={<Settings />} />
        </Route>
        <Route path='*' element={<Navigate to={p('/')} replace />} />
      </Routes>
    </Suspense>
  );
}

/**
 * Hackathon RSVP, QR ticketing & check-in portal.
 * Mounted by src/main.tsx at /hackathon-portal/*; talks to the ODS backend's /api/hackathon-portal.
 */
export default function HackathonPortal() {
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
            staleTime: 10_000
          }
        }
      })
  );

  useEffect(() => {
    const prev = document.title;
    document.title = 'Hackathon Portal · Ogun Digital Summit';
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <EventProvider>
          <div className='hp-root'>
            <PortalRoutes />
          </div>
        </EventProvider>
      </AuthProvider>
      <Toaster richColors position='top-right' closeButton />
    </QueryClientProvider>
  );
}
