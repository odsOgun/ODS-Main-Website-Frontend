const TZ = 'Africa/Lagos';

type DateLike = string | number | Date | null | undefined;

export function fmtDateTime(d: DateLike, tz = TZ) {
  if (!d) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(d));
}
export function fmtDate(d: DateLike, tz = TZ) {
  if (!d) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(d));
}
export function fmtShortDate(d: DateLike, tz = TZ) {
  if (!d) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(d));
}
export function fmtTime(d: DateLike, tz = TZ) {
  if (!d) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(d));
}
export function timeAgo(d: DateLike) {
  if (!d) return '';
  const s = Math.round((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function parts(d: Date, tz: string, withSeconds: boolean) {
  return Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      ...(withSeconds ? { second: '2-digit' } : {}),
      hourCycle: 'h23'
    })
      .formatToParts(d)
      .map((x) => [x.type, x.value])
  ) as Record<string, string>;
}

/** Convert a Date/ISO to a value for <input type="datetime-local"> in the given timezone */
export function toLocalInput(d: DateLike, tz = TZ) {
  if (!d) return '';
  const p = parts(new Date(d), tz, false);
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

/** Interpret a datetime-local string as wall time in tz → ISO string */
export function fromLocalInput(v: string | null | undefined, tz = TZ) {
  if (!v) return null;
  const asUtc = new Date(`${v}:00Z`);
  // offset of tz at that instant
  const p = parts(asUtc, tz, true);
  const tzAsUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  const offset = tzAsUtc - asUtc.getTime();
  return new Date(asUtc.getTime() - offset).toISOString();
}

export const pct = (n: number | null | undefined) => {
  const v = Number(n || 0);
  return `${v.toFixed(v % 1 ? 1 : 0)}%`;
};
export const label = (s: unknown) =>
  String(s || '')
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
