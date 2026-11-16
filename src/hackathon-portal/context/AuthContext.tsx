import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api, storage, setUnauthorizedHandler } from '../lib/api';
import { p, portalRelative } from '../lib/paths';
import type { PortalUser } from '../lib/types';

interface AuthValue {
  user: PortalUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<PortalUser>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isSuper: boolean;
  setToken: (t: string) => void;
}

const AuthCtx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const [user, setUser] = useState<PortalUser | null>(null);
  const [ready, setReady] = useState(false);

  const clear = useCallback(() => {
    storage.token = null;
    setUser(null);
    qc.clear();
  }, [qc]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clear();
      const rel = portalRelative(location.pathname);
      if (!rel.startsWith('/login'))
        location.assign(`${p('/login')}?next=${encodeURIComponent(rel)}`);
    });
    if (!storage.token) {
      setReady(true);
      return;
    }
    api
      .get('/auth/me')
      .then((r) => setUser(r.data.user))
      .catch(() => clear())
      .finally(() => setReady(true));
  }, [clear]);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    storage.token = data.token;
    setUser(data.user);
    return data.user as PortalUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      /* ignore */
    }
    clear();
  }, [clear]);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      ready,
      login,
      logout,
      isAdmin: user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN',
      isSuper: user?.role === 'SUPER_ADMIN',
      setToken: (t: string) => {
        storage.token = t;
      }
    }),
    [user, ready, login, logout]
  );
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const v = useContext(AuthCtx);
  if (!v) throw new Error('useAuth must be used inside <AuthProvider>');
  return v;
};
