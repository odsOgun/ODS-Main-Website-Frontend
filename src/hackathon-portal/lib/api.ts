import axios, { AxiosError } from 'axios';
import type { Json } from './types';

/**
 * Base URL of the portal API (the ODS backend mounts it at /api/hackathon-portal).
 * - Production build: the live server directly (it allows the www.ogundigitalsummit.com origin).
 * - `npm run dev`: the Vite proxy in vite.config.ts, which forwards to the same live server.
 * Set VITE_HACKATHON_API_URL to override, e.g. http://localhost:4000/api/hackathon-portal for a local backend.
 */
const LIVE_API = 'https://ods2025.onrender.com/api/hackathon-portal';
export const API_BASE = (
  import.meta.env.VITE_HACKATHON_API_URL ||
  (import.meta.env.DEV ? '/hackathon-portal-api' : LIVE_API)
).replace(/\/$/, '');

const TOKEN_KEY = 'hackathonPortal.token';
const EVENT_KEY = 'hackathonPortal.eventId';

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, v: string | null) {
  try {
    if (v) localStorage.setItem(key, v);
    else localStorage.removeItem(key);
  } catch {
    /* storage unavailable (private mode) */
  }
}

export const storage = {
  get token() {
    return read(TOKEN_KEY);
  },
  set token(v: string | null) {
    write(TOKEN_KEY, v);
  },
  get eventId() {
    return read(EVENT_KEY);
  },
  set eventId(v: string | null) {
    write(EVENT_KEY, v);
  }
};

export const api = axios.create({ baseURL: API_BASE, timeout: 30000 });

api.interceptors.request.use((config) => {
  const t = storage.token;
  if (t) config.headers.Authorization = `Bearer ${t}`;
  const e = storage.eventId;
  if (e && !config.headers['X-Event-Id']) config.headers['X-Event-Id'] = e;
  return config;
});

let onUnauthorized: () => void = () => {};
export const setUnauthorizedHandler = (fn: () => void) => {
  onUnauthorized = fn;
};

api.interceptors.response.use(
  (r) => r,
  async (err: AxiosError) => {
    // Blob responses carry JSON errors as blobs — decode them
    const data = err.response?.data;
    if (err.response && data instanceof Blob && data.type?.includes('json')) {
      try {
        err.response.data = JSON.parse(await data.text());
      } catch {
        /* ignore */
      }
    }
    const url = err.config?.url || '';
    if (err.response?.status === 401 && !url.includes('/auth/login') && !url.startsWith('/public'))
      onUnauthorized();
    return Promise.reject(err);
  }
);

export function errMsg(err: unknown, fallback = 'Something went wrong'): string {
  if (!err) return fallback;
  const e = err as AxiosError<{ error?: string }>;
  if (e.response?.data?.error) return e.response.data.error;
  if (e.code === 'ECONNABORTED') return 'Request timed out';
  if (axios.isAxiosError(e) && !e.response) return 'Network error — check your connection';
  return e.message || fallback;
}

/** GET helper returning data */
export const get = <T = Json>(url: string, params?: Record<string, unknown>): Promise<T> =>
  api.get<T>(url, { params }).then((r) => r.data);

/** Download a file from the API (auth headers included) */
export async function download(
  url: string,
  params?: Record<string, unknown>,
  fallbackName = 'download'
) {
  const res = await api.get<Blob>(url, { params, responseType: 'blob' });
  const cd = String(res.headers['content-disposition'] || '');
  const m = cd.match(/filename="?([^"]+)"?/);
  const name = m ? m[1] : fallbackName;
  const href = URL.createObjectURL(res.data);
  const a = document.createElement('a');
  a.href = href;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 5000);
}

/** Fetch an authenticated image as an object URL */
export async function blobUrl(url: string, params?: Record<string, unknown>) {
  const res = await api.get<Blob>(url, { params, responseType: 'blob' });
  return URL.createObjectURL(res.data);
}

/** Remove empty values from a params object */
export const clean = <T extends Record<string, unknown>>(o: T): Partial<T> =>
  Object.fromEntries(
    Object.entries(o).filter(([, v]) => v !== '' && v !== undefined && v !== null)
  ) as Partial<T>;
