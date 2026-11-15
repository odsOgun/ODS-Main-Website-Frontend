/**
 * The portal lives under this prefix inside the ODS website router.
 * The backend's HACKATHON_PORTAL_URL must point at `<site origin>${PORTAL_BASE}`
 * so that emailed /rsvp/... and /ticket/... links land on these routes.
 */
export const PORTAL_BASE = '/hackathon-portal';

/** Absolute site path for a portal-relative path, e.g. p('/teams') → '/hackathon-portal/teams'. */
export const p = (path = '/') => `${PORTAL_BASE}${path === '/' ? '' : path}` || '/';

/** Portal-relative path from a full site pathname ('/hackathon-portal/teams' → '/teams'). */
export function portalRelative(pathname: string) {
  if (!pathname.startsWith(PORTAL_BASE)) return pathname;
  return pathname.slice(PORTAL_BASE.length) || '/';
}
