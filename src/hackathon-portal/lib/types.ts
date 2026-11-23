/**
 * The backend is plain JavaScript and its responses are documented in
 * ODS-Main-Website-Backend/docs/hackathon-portal/API.md rather than typed.
 * API payloads are therefore typed loosely with `Json`; UI component props are typed strictly.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Json = any;

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'OFFICER';

export interface PortalUser {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  isActive?: boolean;
  pendingSetup?: boolean;
}

export interface PortalEvent {
  _id: string;
  name: string;
  shortName?: string;
  status: string;
  date?: string;
  venue?: string;
  timezone?: string;
  rsvpDeadline?: string;
  [key: string]: Json;
}

export interface Paged<T = Json> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  [key: string]: Json;
}

export interface Option {
  value: string;
  label: string;
}
