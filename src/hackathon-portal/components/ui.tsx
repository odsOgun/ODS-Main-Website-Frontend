/* eslint-disable react-refresh/only-export-components */
import {
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type ComponentType,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TdHTMLAttributes,
  type TextareaHTMLAttributes
} from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';
import type { UseQueryResult } from '@tanstack/react-query';
import {
  Loader2,
  X,
  AlertTriangle,
  Inbox,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown
} from 'lucide-react';
import { label as lbl } from '../lib/format';
import type { Json, Option } from '../lib/types';

export type IconType = ComponentType<{ className?: string }>;

/** Join class names; later classes win over conflicting earlier ones (e.g. a page's `w-56` over a control's base `w-full`). */
export const cx = (...c: Array<string | false | null | undefined | 0>) =>
  twMerge(c.filter(Boolean).join(' '));

/* ---------- Button ---------- */
const VARIANTS = {
  primary: 'bg-[#009E49] text-white shadow-sm hover:bg-[#00873E] focus-visible:ring-[#009E49]',
  secondary:
    'bg-white text-[#344054] border border-[#D0D5DD] shadow-sm hover:bg-[#F9FAFB] focus-visible:ring-[#98A2B3]',
  danger: 'bg-[#D92D20] text-white shadow-sm hover:bg-[#B42318] focus-visible:ring-[#D92D20]',
  ghost: 'text-[#475467] hover:bg-[#F2F4F7] focus-visible:ring-[#98A2B3]',
  dark: 'bg-[#101612] text-white hover:bg-[#1D2939] focus-visible:ring-[#475467]'
};
export type ButtonVariant = keyof typeof VARIANTS;
const SIZES = {
  sm: 'h-9 px-4 text-xs gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-8 text-base gap-2'
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: keyof typeof SIZES;
  loading?: boolean;
  icon?: IconType;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  icon: Icon,
  children,
  className,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cx(
        'inline-flex items-center justify-center whitespace-nowrap rounded-full font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 className='size-4 shrink-0 animate-spin' />
      ) : Icon ? (
        <Icon className='size-4 shrink-0' />
      ) : null}
      {children}
    </button>
  );
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconType;
  label: string;
}
export function IconButton({ icon: Icon, label, className, ...rest }: IconButtonProps) {
  return (
    <button
      type='button'
      title={label}
      aria-label={label}
      className={cx(
        'inline-flex size-8 items-center justify-center rounded-full text-[#667085] hover:bg-[#F2F4F7] hover:text-[#101828] disabled:opacity-40',
        className
      )}
      {...rest}
    >
      <Icon className='size-4' />
    </button>
  );
}

/* ---------- Form controls ---------- */
const field =
  'w-full rounded-xl border border-[#D0D5DD] bg-white px-4 py-2.5 text-sm text-[#101828] placeholder:text-[#98A2B3] transition-all focus:border-[#009E49] focus:outline-none focus:ring-2 focus:ring-[#009E49]/20 disabled:bg-[#F2F4F7]';

interface FieldProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  children?: ReactNode;
  className?: string;
  required?: boolean;
}
export function Field({ label, hint, error, children, className, required }: FieldProps) {
  return (
    <label className={cx('block', className)}>
      {label && (
        <span className='mb-1.5 block text-xs font-medium text-[#344054]'>
          {label}
          {required && <span className='text-red-600'> *</span>}
        </span>
      )}
      {children}
      {error ? (
        <span className='mt-1 block text-xs text-red-600'>{error}</span>
      ) : hint ? (
        <span className='mt-1 block text-xs text-[#667085]'>{hint}</span>
      ) : null}
    </label>
  );
}
export const Input = ({ className, ...p }: InputHTMLAttributes<HTMLInputElement>) => (
  <input className={cx(field, className)} {...p} />
);
export const Textarea = ({ className, ...p }: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea className={cx(field, 'min-h-24', className)} {...p} />
);

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: Array<string | Option>;
  placeholder?: string;
}
export function Select({ className, options = [], placeholder, ...p }: SelectProps) {
  return (
    <select className={cx(field, 'pr-8', className)} {...p}>
      {placeholder !== undefined && <option value=''>{placeholder}</option>}
      {options.map((o) =>
        typeof o === 'string' ? (
          <option key={o} value={o}>
            {lbl(o)}
          </option>
        ) : (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        )
      )}
    </select>
  );
}

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
}
export function Checkbox({ label, className, ...p }: CheckboxProps) {
  return (
    <label
      className={cx(
        'inline-flex cursor-pointer items-center gap-2 text-sm text-[#344054]',
        className
      )}
    >
      <input
        type='checkbox'
        className='size-4 rounded border-[#D0D5DD] accent-[#009E49] focus:ring-[#009E49]'
        {...p}
      />
      {label}
    </label>
  );
}

/* ---------- Card / layout ---------- */
interface CardProps {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  bodyClass?: string;
}
export function Card({ title, description, actions, children, className, bodyClass }: CardProps) {
  return (
    <section className={cx('rounded-2xl border border-[#EAECF0] bg-white shadow-sm', className)}>
      {(title || actions) && (
        <header className='flex flex-wrap items-start justify-between gap-3 border-b border-[#F2F4F7] px-5 py-4'>
          <div>
            {title && <h2 className='text-base font-bold text-[#101828]'>{title}</h2>}
            {description && <p className='mt-0.5 text-sm text-[#667085]'>{description}</p>}
          </div>
          {actions && <div className='flex flex-wrap items-center gap-2'>{actions}</div>}
        </header>
      )}
      <div className={cx('p-5', bodyClass)}>{children}</div>
    </section>
  );
}

export function PageHeader({
  title,
  description,
  actions
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className='mb-6 flex flex-wrap items-end justify-between gap-4'>
      <div>
        <h1 className='platypi-gf text-2xl font-bold tracking-tight text-[#0B4822] sm:text-3xl'>
          {title}
        </h1>
        {description && <p className='mt-1 text-sm text-[#667085]'>{description}</p>}
      </div>
      {actions && <div className='flex flex-wrap items-center gap-2'>{actions}</div>}
    </div>
  );
}

const STAT_TONES = {
  slate: 'bg-[#F2F4F7] text-[#344054]',
  teal: 'bg-[#E6F6EC] text-[#009E49]',
  green: 'bg-[#E6F6EC] text-[#008A43]',
  amber: 'bg-amber-50 text-amber-700',
  red: 'bg-red-50 text-red-700',
  blue: 'bg-sky-50 text-sky-700',
  violet: 'bg-[#F5EDF8] text-[#7A3A95]'
};
export type Tone = keyof typeof STAT_TONES;

interface StatCardProps {
  label: ReactNode;
  value: ReactNode;
  sub?: ReactNode;
  icon?: IconType;
  tone?: Tone;
}
export function StatCard({ label, value, sub, icon: Icon, tone = 'slate' }: StatCardProps) {
  return (
    <div className='rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm'>
      <div className='flex items-center justify-between gap-2'>
        <p className='text-xs font-medium uppercase tracking-wide text-[#667085]'>{label}</p>
        {Icon && (
          <span className={cx('rounded-lg p-1.5', STAT_TONES[tone])}>
            <Icon className='size-4' />
          </span>
        )}
      </div>
      <p className='mt-2 text-3xl font-extrabold tabular-nums text-[#101828]'>{value ?? '—'}</p>
      {sub && <p className='mt-0.5 text-xs text-[#667085]'>{sub}</p>}
    </div>
  );
}

/* ---------- Badge ---------- */
const BADGE: Record<Tone, string> = {
  green: 'bg-[#E6F6EC] text-[#008A43] ring-[#00A651]/20',
  amber: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  red: 'bg-red-50 text-red-700 ring-red-600/20',
  blue: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  slate: 'bg-[#F2F4F7] text-[#475467] ring-[#667085]/20',
  violet: 'bg-[#F5EDF8] text-[#7A3A95] ring-[#8E44AD]/20',
  teal: 'bg-[#E6F6EC] text-[#009E49] ring-[#009E49]/20'
};
const STATUS_TONE: Record<string, Tone> = {
  CONFIRMED: 'green',
  DECLINED: 'red',
  PENDING: 'amber',
  EXPIRED: 'slate',
  CANCELLED: 'slate',
  NOT_INVITED: 'violet',
  ACTIVE: 'green',
  REVOKED: 'red',
  UPCOMING: 'blue',
  CLOSED: 'slate',
  QUEUED: 'blue',
  SENT: 'teal',
  DELIVERED: 'green',
  FAILED: 'red',
  BOUNCED: 'red',
  COMPLAINED: 'red',
  SKIPPED: 'slate',
  NOT_SENT: 'slate',
  RUNNING: 'blue',
  COMPLETED: 'green',
  COMPLETED_WITH_ERRORS: 'amber',
  VALID: 'green',
  WARNING: 'amber',
  ERROR: 'red',
  DUPLICATE: 'violet',
  EXCLUDED: 'slate',
  SCAN: 'teal',
  MANUAL: 'violet',
  SUPER_ADMIN: 'violet',
  ADMIN: 'blue',
  OFFICER: 'teal',
  DRAFT: 'slate',
  ARCHIVED: 'slate',
  PROCESSING: 'blue'
};

interface BadgeProps {
  children?: ReactNode;
  tone?: Tone;
  status?: string;
  className?: string;
}
export function Badge({ children, tone, status, className }: BadgeProps) {
  const t = tone || (status && STATUS_TONE[status]) || 'slate';
  return (
    <span
      className={cx(
        'inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        BADGE[t],
        className
      )}
    >
      {children ?? lbl(status)}
    </span>
  );
}
export const StatusBadge = ({ status }: { status?: string | null }) =>
  status ? <Badge status={status} /> : <span className='text-[#98A2B3]'>—</span>;

/* ---------- States ---------- */
export const Spinner = ({ className }: { className?: string }) => (
  <Loader2 className={cx('size-5 animate-spin text-[#009E49]', className)} />
);
export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className='flex items-center justify-center gap-2 py-12 text-sm text-[#667085]'>
      <Spinner /> {label}
    </div>
  );
}

interface EmptyStateProps {
  icon?: IconType;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}
export function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  description,
  action
}: EmptyStateProps) {
  return (
    <div className='flex flex-col items-center justify-center px-4 py-12 text-center'>
      <span className='rounded-full bg-[#F2F4F7] p-3'>
        <Icon className='size-6 text-[#98A2B3]' />
      </span>
      <p className='mt-3 font-medium text-[#101828]'>{title}</p>
      {description && <p className='mt-1 max-w-md text-sm text-[#667085]'>{description}</p>}
      {action && <div className='mt-4'>{action}</div>}
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: Json; onRetry?: () => void }) {
  const msg =
    error?.response?.data?.error ||
    (error && !error.response ? 'Network error — could not reach the server' : error?.message) ||
    'Something went wrong';
  return (
    <div className='flex flex-col items-center justify-center px-4 py-10 text-center'>
      <span className='rounded-full bg-red-50 p-3'>
        <AlertTriangle className='size-6 text-red-500' />
      </span>
      <p className='mt-3 font-medium text-[#101828]'>Could not load data</p>
      <p className='mt-1 max-w-md text-sm text-[#667085]'>{msg}</p>
      {onRetry && (
        <Button variant='secondary' size='sm' className='mt-4' onClick={() => onRetry()}>
          Try again
        </Button>
      )}
    </div>
  );
}

/** Renders loading / error / children for a react-query result */
export function QueryState({
  query,
  children,
  empty,
  isEmpty
}: {
  query: UseQueryResult<Json, unknown>;
  children: (data: Json) => ReactNode;
  empty?: ReactNode;
  isEmpty?: (data: Json) => boolean;
}) {
  if (query.isLoading) return <Loading />;
  if (query.isError) return <ErrorState error={query.error} onRetry={() => query.refetch()} />;
  if (isEmpty && isEmpty(query.data)) return <>{empty || <EmptyState />}</>;
  return <>{children(query.data)}</>;
}

/* ---------- Modal ---------- */
const MODAL_W = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-6xl'
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: keyof typeof MODAL_W;
}
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md'
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div
      className='hp-root hp-overlay fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4'
      role='dialog'
      aria-modal='true'
    >
      <div className='absolute inset-0 bg-[#101828]/50 backdrop-blur-[1px]' onClick={onClose} />
      <div
        className={cx(
          'relative flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-white shadow-xl sm:rounded-3xl',
          MODAL_W[size]
        )}
      >
        <header className='flex items-start justify-between gap-4 border-b border-[#F2F4F7] px-5 py-4'>
          <div>
            <h3 className='platypi-gf text-xl font-bold text-[#0B4822]'>{title}</h3>
            {description && <p className='mt-0.5 text-sm text-[#667085]'>{description}</p>}
          </div>
          <IconButton icon={X} label='Close' onClick={onClose} />
        </header>
        <div className='overflow-y-auto px-5 py-4'>{children}</div>
        {footer && (
          <footer className='flex flex-wrap justify-end gap-2 border-t border-[#F2F4F7] px-5 py-3'>
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body
  );
}

/** Drawer from the right */
export function Drawer({
  open,
  onClose,
  title,
  children,
  footer
}: Omit<ModalProps, 'size' | 'description'>) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div
      className='hp-root hp-overlay fixed inset-0 z-50 flex justify-end'
      role='dialog'
      aria-modal='true'
    >
      <div className='absolute inset-0 bg-[#101828]/40' onClick={onClose} />
      <div className='relative flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl'>
        <header className='flex items-center justify-between gap-4 border-b border-[#F2F4F7] px-5 py-4'>
          <h3 className='platypi-gf text-xl font-bold text-[#0B4822]'>{title}</h3>
          <IconButton icon={X} label='Close' onClick={onClose} />
        </header>
        <div className='flex-1 overflow-y-auto px-5 py-4'>{children}</div>
        {footer && (
          <footer className='flex flex-wrap justify-end gap-2 border-t border-[#F2F4F7] px-5 py-3'>
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body
  );
}

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  /** Receives the trimmed reason (empty string when no reason field is shown) */
  onConfirm: (reason: string) => void;
  title: ReactNode;
  message?: ReactNode;
  confirmLabel?: string;
  tone?: ButtonVariant;
  loading?: boolean;
  /** If set, a text reason is shown (and required unless reasonRequired is false) */
  reasonLabel?: string;
  reasonRequired?: boolean;
  children?: ReactNode;
}
/** Confirmation dialog. */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  tone = 'primary',
  loading,
  reasonLabel,
  reasonRequired = true,
  children
}: ConfirmDialogProps) {
  const [reason, setReason] = useState('');
  useEffect(() => {
    if (open) setReason('');
  }, [open]);
  const blocked = !!reasonLabel && reasonRequired && reason.trim().length < 3;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size='sm'
      footer={
        <>
          <Button variant='secondary' onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={tone}
            onClick={() => onConfirm(reason.trim())}
            loading={loading}
            disabled={blocked}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      {message && <div className='text-sm text-[#475467]'>{message}</div>}
      {children}
      {reasonLabel && (
        <Field
          label={reasonLabel}
          className='mt-4'
          required={reasonRequired}
          hint={reasonRequired ? 'Recorded in the audit log (min. 3 characters).' : undefined}
        >
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            autoFocus
            maxLength={500}
            className='min-h-20'
          />
        </Field>
      )}
    </Modal>
  );
}

/* ---------- Table ---------- */
interface SortHeaderProps {
  label: ReactNode;
  field: string;
  sort: string;
  onSort: (sort: string) => void;
  className?: string;
}
export function SortHeader({ label, field, sort, onSort, className }: SortHeaderProps) {
  const active = sort === field || sort === `-${field}`;
  const desc = sort === `-${field}`;
  const Icon = !active ? ChevronsUpDown : desc ? ArrowDown : ArrowUp;
  return (
    <th className={cx('px-3 py-2.5 text-left', className)}>
      <button
        type='button'
        className='inline-flex items-center gap-1 uppercase hover:text-[#101828]'
        onClick={() => onSort(active && !desc ? `-${field}` : field)}
      >
        {label} <Icon className={cx('size-3', active ? 'text-[#009E49]' : 'text-[#D0D5DD]')} />
      </button>
    </th>
  );
}
export function Table({
  head,
  children,
  className
}: {
  head: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx('overflow-x-auto', className)}>
      <table className='min-w-full divide-y divide-[#EAECF0] text-sm'>
        <thead className='bg-[#F9FAFB] text-xs font-medium uppercase tracking-wide text-[#475467]'>
          <tr>{head}</tr>
        </thead>
        <tbody className='divide-y divide-[#F2F4F7] bg-white'>{children}</tbody>
      </table>
    </div>
  );
}
export const Th = ({ children, className }: { children?: ReactNode; className?: string }) => (
  <th className={cx('px-3 py-2.5 text-left', className)}>{children}</th>
);
export const Td = ({ children, className, ...p }: TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cx('px-3 py-2.5 align-middle', className)} {...p}>
    {children}
  </td>
);

interface PaginationProps {
  page: number;
  pages: number;
  total: number;
  limit: number;
  onPage: (page: number) => void;
  onLimit?: (limit: number) => void;
}
export function Pagination({ page, pages, total, limit, onPage, onLimit }: PaginationProps) {
  if (!total) return null;
  const from = (page - 1) * limit + 1;
  const to = Math.min(total, page * limit);
  return (
    <div className='flex flex-wrap items-center justify-between gap-3 border-t border-[#F2F4F7] px-4 py-3 text-sm text-[#475467]'>
      <span>
        Showing <b>{from}</b>–<b>{to}</b> of <b>{total}</b>
      </span>
      <div className='flex items-center gap-2'>
        {onLimit && (
          <select
            className='rounded-full border border-[#D0D5DD] bg-white px-3 py-1 text-sm'
            value={limit}
            onChange={(e) => onLimit(Number(e.target.value))}
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        )}
        <IconButton
          icon={ChevronLeft}
          label='Previous page'
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
        />
        <span className='tabular-nums'>
          {page} / {pages}
        </span>
        <IconButton
          icon={ChevronRight}
          label='Next page'
          disabled={page >= pages}
          onClick={() => onPage(page + 1)}
        />
      </div>
    </div>
  );
}

/** Tabs (pill style) */
export function Tabs<T extends string>({
  tabs,
  value,
  onChange
}: {
  tabs: Array<{ value: T; label: ReactNode; count?: number }>;
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className='flex flex-wrap gap-1 rounded-full bg-[#F2F4F7] p-1'>
      {tabs.map((t) => (
        <button
          key={t.value}
          type='button'
          onClick={() => onChange(t.value)}
          className={cx(
            'rounded-full px-4 py-1.5 text-sm font-semibold transition',
            value === t.value
              ? 'bg-[#009E49] text-white shadow-sm'
              : 'text-[#475467] hover:text-[#101828]'
          )}
        >
          {t.label}
          {t.count !== undefined && (
            <span className='ml-1.5 rounded-full bg-black/10 px-1.5 text-xs tabular-nums'>
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

const PROGRESS = {
  teal: 'bg-[#009E49]',
  green: 'bg-[#33B885]',
  amber: 'bg-amber-500',
  red: 'bg-red-500'
};
export function Progress({
  value,
  max,
  tone = 'teal'
}: {
  value: number;
  max: number;
  tone?: keyof typeof PROGRESS;
}) {
  const pc = max ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className='h-2 w-full overflow-hidden rounded-full bg-[#F2F4F7]'>
      <div
        className={cx('h-full rounded-full transition-all', PROGRESS[tone])}
        style={{ width: `${pc}%` }}
      />
    </div>
  );
}

export function KeyValue({
  items
}: {
  items: Array<[string, ReactNode] | false | null | undefined>;
}) {
  return (
    <dl className='grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2'>
      {items
        .filter((x): x is [string, ReactNode] => !!x)
        .map(([k, v]) => (
          <div key={k}>
            <dt className='text-xs font-medium uppercase tracking-wide text-[#667085]'>{k}</dt>
            <dd className='mt-0.5 break-words text-sm text-[#101828]'>{v ?? '—'}</dd>
          </div>
        ))}
    </dl>
  );
}

/** Debounced value hook */
export function useDebounced<T>(value: T, ms = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}
