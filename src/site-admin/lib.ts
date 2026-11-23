export const num = (n: number | null | undefined) =>
  n === null || n === undefined ? '—' : new Intl.NumberFormat('en-NG').format(n);

export const naira = (n: number | null | undefined) =>
  n === null || n === undefined
    ? '—'
    : new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0
      }).format(n);

/** ISO date strings from the API → readable; everything else passes through. */
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;
export const isIsoDate = (v: unknown): v is string => typeof v === 'string' && ISO.test(v);
export const isUrl = (v: unknown): v is string =>
  typeof v === 'string' && /^https?:\/\/\S+$/i.test(v.trim());
