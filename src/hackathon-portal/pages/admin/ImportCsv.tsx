import { useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  FileUp,
  UploadCloud,
  RefreshCw,
  CheckCircle2,
  Plus,
  Trash2,
  Pencil,
  Undo2,
  Ban,
  History,
  FileSpreadsheet
} from 'lucide-react';
import { toast } from 'sonner';
import { api, errMsg } from '../../lib/api';
import { useEventQuery } from '../../lib/hooks';
import { fmtDateTime } from '../../lib/format';
import { p } from '../../lib/paths';
import type { Json } from '../../lib/types';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  ConfirmDialog,
  EmptyState,
  Field,
  IconButton,
  Input,
  Loading,
  PageHeader,
  Pagination,
  Select,
  StatCard,
  Table,
  Tabs,
  Td,
  Th,
  ErrorState
} from '../../components/ui';

const LONG_FIELDS: Array<[string, string, boolean]> = [
  ['teamName', 'Team name', true],
  ['fullName', 'Full name', false],
  ['firstName', 'First name (if no full name)', false],
  ['lastName', 'Last name', false],
  ['email', 'Email', false],
  ['phone', 'Phone', false],
  ['teamRole', 'Team role', false]
];
const GROUP_FIELDS: Array<[string, string]> = [
  ['fullName', 'Full name'],
  ['firstName', 'First name'],
  ['lastName', 'Last name'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['teamRole', 'Role']
];
const PAGE = 50;

type ColumnIndex = number | null;

interface ColumnSelectProps {
  headers: string[];
  value: ColumnIndex | undefined;
  onChange: (v: ColumnIndex) => void;
}

function ColumnSelect({ headers, value, onChange }: ColumnSelectProps) {
  return (
    <Select
      value={value === null || value === undefined ? '' : String(value)}
      onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
      placeholder='— not mapped —'
      options={headers.map((h, i) => ({ value: String(i), label: h }))}
    />
  );
}

interface MappingEditorProps {
  headers: string[];
  mapping: Json;
  setMapping: (m: Json) => void;
}

function MappingEditor({ headers, mapping, setMapping }: MappingEditorProps) {
  const set = (k: string, v: Json) => setMapping({ ...mapping, [k]: v });
  const setGroup = (i: number, k: string, v: Json) =>
    setMapping({
      ...mapping,
      members: mapping.members.map((g: Json, j: number) => (j === i ? { ...g, [k]: v } : g))
    });
  const mappedLong = new Set<number>(
    LONG_FIELDS.map(([k]) => mapping[k]).filter((v) => v !== null && v !== undefined)
  );
  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-end gap-4'>
        <Field label='File layout' className='w-full sm:w-96'>
          <Select
            value={mapping.mode}
            onChange={(e) => {
              const mode = e.target.value;
              setMapping(
                mode === 'WIDE'
                  ? {
                      mode,
                      teamName: mapping.teamName,
                      members: mapping.members?.length
                        ? mapping.members
                        : [
                            {
                              label: 'Member 1',
                              defaultRole: '',
                              fullName: null,
                              firstName: null,
                              lastName: null,
                              email: null,
                              phone: null,
                              teamRole: null
                            }
                          ],
                      extra: []
                    }
                  : {
                      mode,
                      teamName: mapping.teamName,
                      fullName: null,
                      firstName: null,
                      lastName: null,
                      email: null,
                      phone: null,
                      teamRole: null,
                      extra: []
                    }
              );
            }}
            options={[
              { value: 'LONG', label: 'One row per participant' },
              { value: 'WIDE', label: 'One row per team (member columns side by side)' }
            ]}
          />
        </Field>
        <Field label='Team name column' required className='w-full sm:w-72'>
          <ColumnSelect
            headers={headers}
            value={mapping.teamName}
            onChange={(v) => set('teamName', v)}
          />
        </Field>
      </div>
      {mapping.mode === 'LONG' ? (
        <>
          <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
            {LONG_FIELDS.slice(1).map(([k, lbl]) => (
              <Field key={k} label={lbl}>
                <ColumnSelect headers={headers} value={mapping[k]} onChange={(v) => set(k, v)} />
              </Field>
            ))}
          </div>
          <Checkbox
            label={`Keep the other ${headers.length - mappedLong.size} column(s) as extra participant info`}
            checked={(mapping.extra || []).length > 0}
            onChange={(e) =>
              set(
                'extra',
                e.target.checked ? headers.map((_, i) => i).filter((i) => !mappedLong.has(i)) : []
              )
            }
          />
        </>
      ) : (
        <div className='space-y-3'>
          {mapping.members.map((g: Json, i: number) => (
            <div key={i} className='rounded-lg border border-[#EAECF0] p-3'>
              <div className='mb-2 flex flex-wrap items-end gap-3'>
                <Field label='Group label' className='w-40'>
                  <Input
                    value={g.label || ''}
                    onChange={(e) => setGroup(i, 'label', e.target.value)}
                  />
                </Field>
                <Field label='Default role' className='w-40'>
                  <Input
                    value={g.defaultRole || ''}
                    onChange={(e) => setGroup(i, 'defaultRole', e.target.value)}
                    placeholder='e.g. Team Lead'
                  />
                </Field>
                <div className='flex-1' />
                <IconButton
                  icon={Trash2}
                  label='Remove group'
                  className='hover:text-red-600'
                  disabled={mapping.members.length < 2}
                  onClick={() =>
                    setMapping({
                      ...mapping,
                      members: mapping.members.filter((_: Json, j: number) => j !== i)
                    })
                  }
                />
              </div>
              <div className='grid gap-2 sm:grid-cols-3 lg:grid-cols-6'>
                {GROUP_FIELDS.map(([k, lbl]) => (
                  <Field key={k} label={lbl}>
                    <ColumnSelect
                      headers={headers}
                      value={g[k]}
                      onChange={(v) => setGroup(i, k, v)}
                    />
                  </Field>
                ))}
              </div>
            </div>
          ))}
          <Button
            variant='secondary'
            size='sm'
            icon={Plus}
            onClick={() =>
              setMapping({
                ...mapping,
                members: [
                  ...mapping.members,
                  {
                    label: `Member ${mapping.members.length + 1}`,
                    defaultRole: '',
                    fullName: null,
                    firstName: null,
                    lastName: null,
                    email: null,
                    phone: null,
                    teamRole: null
                  }
                ]
              })
            }
          >
            Add member group
          </Button>
          <p className='text-xs text-[#667085]'>
            Empty member slots are ignored, so teams can have different sizes.
          </p>
        </div>
      )}
    </div>
  );
}

interface RecordEdit {
  teamName: string;
  fullName: string;
  email: string;
  phone: string;
  teamRole: string;
}

interface RecordRowProps {
  r: Json;
  excluded: boolean;
  edit?: RecordEdit;
  onEdit: (key: string, v: RecordEdit) => void;
  onToggleExclude: (key: string) => void;
}

function RecordRow({ r, excluded, edit, onEdit, onToggleExclude }: RecordRowProps) {
  const [editing, setEditing] = useState(false);
  const [v, setV] = useState<RecordEdit>({
    teamName: r.teamName,
    fullName: r.fullName,
    email: r.email,
    phone: r.phone,
    teamRole: r.teamRole
  });
  const status = excluded ? 'EXCLUDED' : r.status;
  if (editing) {
    return (
      <tr className='bg-amber-50/50'>
        <Td className='text-xs text-[#667085]'>
          {r.rowNumber}
          {r.slot ? ` · ${r.slot}` : ''}
        </Td>
        <Td>
          <Input
            className='h-8 py-1'
            value={v.teamName}
            onChange={(e) => setV({ ...v, teamName: e.target.value })}
          />
        </Td>
        <Td>
          <Input
            className='h-8 py-1'
            value={v.fullName}
            onChange={(e) => setV({ ...v, fullName: e.target.value })}
          />
        </Td>
        <Td>
          <Input
            className='h-8 py-1'
            value={v.email}
            onChange={(e) => setV({ ...v, email: e.target.value })}
          />
        </Td>
        <Td>
          <Input
            className='h-8 py-1'
            value={v.phone}
            onChange={(e) => setV({ ...v, phone: e.target.value })}
          />
        </Td>
        <Td colSpan={2}>
          <div className='flex gap-1'>
            <Button
              size='sm'
              onClick={() => {
                onEdit(r.key, v);
                setEditing(false);
              }}
            >
              Apply
            </Button>
            <Button size='sm' variant='ghost' onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </Td>
      </tr>
    );
  }
  return (
    <tr className={excluded ? 'opacity-50' : undefined}>
      <Td className='whitespace-nowrap text-xs text-[#667085]'>
        {r.rowNumber}
        {r.slot ? ` · ${r.slot}` : ''}
      </Td>
      <Td>{r.teamName || <span className='text-red-600'>missing</span>}</Td>
      <Td>
        {r.fullName || <span className='text-red-600'>missing</span>}
        {r.teamRole && <span className='block text-xs text-[#98A2B3]'>{r.teamRole}</span>}
      </Td>
      <Td className='max-w-56 truncate'>{r.email || <span className='text-amber-700'>—</span>}</Td>
      <Td className='text-xs'>{r.phone || '—'}</Td>
      <Td>
        <Badge status={status} />
        {edit && (
          <Badge tone='blue' className='ml-1'>
            Edited
          </Badge>
        )}
        {[...(r.errors || []), ...(r.warnings || [])].map((m: string, i: number) => (
          <span
            key={i}
            className={`mt-0.5 block text-xs ${r.errors?.includes(m) ? 'text-red-600' : 'text-amber-700'}`}
          >
            {m}
          </span>
        ))}
      </Td>
      <Td className='whitespace-nowrap text-right'>
        <IconButton icon={Pencil} label='Edit row' onClick={() => setEditing(true)} />
        <IconButton
          icon={excluded ? Undo2 : Ban}
          label={excluded ? 'Include row' : 'Exclude row'}
          onClick={() => onToggleExclude(r.key)}
        />
      </Td>
    </tr>
  );
}

function ImportHistory() {
  const h = useEventQuery('import-history', '/import/history');
  return (
    <Card title='Import history' bodyClass='p-0'>
      {h.isLoading ? (
        <Loading />
      ) : h.isError ? (
        <ErrorState error={h.error} onRetry={h.refetch} />
      ) : !h.data.items.length ? (
        <EmptyState icon={History} title='No imports yet' />
      ) : (
        <Table
          head={
            <>
              <Th>File</Th>
              <Th>Imported</Th>
              <Th>By</Th>
              <Th>Rows</Th>
              <Th>Teams created</Th>
              <Th>Participants created</Th>
              <Th>Duplicates</Th>
              <Th>Invalid</Th>
              <Th>No email</Th>
            </>
          }
        >
          {h.data.items.map((b: Json) => (
            <tr key={b._id}>
              <Td>
                <FileSpreadsheet className='mr-1.5 inline size-4 text-[#009E49]' />
                {b.fileName}
              </Td>
              <Td className='text-xs'>{fmtDateTime(b.completedAt)}</Td>
              <Td className='text-xs'>{b.uploadedBy?.name}</Td>
              <Td>{b.summary?.totalRows}</Td>
              <Td>{b.summary?.teamsCreated}</Td>
              <Td>{b.summary?.participantsCreated}</Td>
              <Td>{b.summary?.duplicates}</Td>
              <Td>{b.summary?.invalid}</Td>
              <Td>{b.summary?.withoutEmail}</Td>
            </tr>
          ))}
        </Table>
      )}
    </Card>
  );
}

export default function ImportCsv() {
  const qc = useQueryClient();
  const nav = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<Json | null>(null); // {importId, fileName, headers, sampleRows, rowCount}
  const [mapping, setMapping] = useState<Json | null>(null);
  const [validation, setValidation] = useState<Json | null>(null); // {records, summary}
  const [mappingError, setMappingError] = useState('');
  const [edits, setEdits] = useState<Record<string, RecordEdit>>({});
  const [excluded, setExcluded] = useState<string[]>([]);
  const [includeWithoutEmail, setIncludeWithoutEmail] = useState(true);
  const [validating, setValidating] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<Json | null>(null);

  async function upload(file: File | undefined) {
    if (!file) return;
    if (!/\.(csv|tsv|txt)$/i.test(file.name)) {
      toast.error('Please choose a .csv file');
      return;
    }
    const fd = new FormData();
    fd.append('file', file);
    setUploading(true);
    setResult(null);
    try {
      const { data } = await api.post('/import/preview', fd);
      setPreview(data);
      setMapping(data.mapping);
      setValidation(data.records ? { records: data.records, summary: data.summary } : null);
      setMappingError(data.mappingError || '');
      setEdits({});
      setExcluded([]);
      setDirty(!!data.mappingError);
      setFilter('ALL');
      setPage(1);
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function revalidate(next: Record<string, unknown> = {}) {
    const body = {
      importId: preview.importId,
      mapping,
      edits,
      excluded,
      includeWithoutEmail,
      ...next
    };
    setValidating(true);
    try {
      const { data } = await api.post('/import/validate', body);
      setValidation(data);
      setMappingError('');
      setDirty(false);
    } catch (err) {
      setMappingError(errMsg(err));
      toast.error(errMsg(err));
    } finally {
      setValidating(false);
    }
  }

  const onEdit = (key: string, v: RecordEdit) => {
    const n = { ...edits, [key]: v };
    setEdits(n);
    revalidate({ edits: n });
  };
  const onToggleExclude = (key: string) => {
    const n = excluded.includes(key) ? excluded.filter((k) => k !== key) : [...excluded, key];
    setExcluded(n);
    revalidate({ excluded: n });
  };

  async function confirmImport() {
    setImporting(true);
    try {
      const { data } = await api.post('/import/confirm', {
        importId: preview.importId,
        mapping,
        edits,
        excluded,
        includeWithoutEmail
      });
      setResult(data.summary);
      setPreview(null);
      setValidation(null);
      setConfirmOpen(false);
      toast.success(
        `Imported ${data.summary.participantsCreated} participant(s) into ${data.summary.teamsCreated} new team(s)`
      );
      ['teams', 'participants', 'teams-options', 'dashboard', 'import-history', 'rsvp'].forEach(
        (k) => qc.invalidateQueries({ queryKey: [k] })
      );
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setImporting(false);
    }
  }

  const records: Json[] = useMemo(() => validation?.records || [], [validation]);
  const counts = useMemo(
    () =>
      records.reduce(
        (m: Record<string, number>, r) => ((m[r.status] = (m[r.status] || 0) + 1), m),
        {}
      ),
    [records]
  );
  const shown = filter === 'ALL' ? records : records.filter((r) => r.status === filter);
  const s = validation?.summary;

  return (
    <div className='space-y-6'>
      <PageHeader
        title='CSV Import'
        description='Upload your teams file, map its columns, fix problems, then import. Importing never sends emails.'
      />

      {result && (
        <Card
          title='Import complete'
          actions={
            <>
              <Button variant='secondary' onClick={() => nav(p('/teams'))}>
                View teams
              </Button>
              <Button onClick={() => nav(p('/rsvp'))}>Go to RSVP campaign</Button>
            </>
          }
        >
          <div className='grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6'>
            <StatCard label='Rows processed' value={result.totalRows} />
            <StatCard
              label='Teams created'
              value={result.teamsCreated}
              tone='teal'
              icon={CheckCircle2}
            />
            <StatCard
              label='Participants created'
              value={result.participantsCreated}
              tone='green'
              icon={CheckCircle2}
            />
            <StatCard label='Duplicates skipped' value={result.duplicates} />
            <StatCard label='Invalid records' value={result.invalid} />
            <StatCard label='Without email' value={result.withoutEmail} />
          </div>
          <p className='mt-4 text-sm text-[#475467]'>
            No emails were sent. Start the RSVP invitation campaign from <b>RSVP Management</b> when
            you're ready.
          </p>
        </Card>
      )}

      {!preview ? (
        <Card>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              upload(e.dataTransfer.files?.[0]);
            }}
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-14 text-center transition ${dragOver ? 'border-[#33B885] bg-[#E6F6EC]' : 'border-[#D0D5DD]'}`}
          >
            <UploadCloud className='size-10 text-[#009E49]' />
            <p className='mt-3 font-medium text-[#101828]'>Drop your CSV here or choose a file</p>
            <p className='mt-1 max-w-md text-sm text-[#667085]'>
              Either one row per participant, or one row per team with member columns side by side
              (e.g. “Member 1 Name”, “Member 1 Email”). Max 5 MB.
            </p>
            <input
              ref={fileRef}
              type='file'
              accept='.csv,.tsv,.txt,text/csv'
              className='hidden'
              onChange={(e) => upload(e.target.files?.[0])}
            />
            <Button
              className='mt-5'
              icon={FileUp}
              loading={uploading}
              onClick={() => fileRef.current?.click()}
            >
              Choose CSV file
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <Card
            title={`1. Map columns — ${preview.fileName}`}
            description={`${preview.rowCount} data row(s), ${preview.headers.length} column(s). We guessed the mapping; adjust it if needed.`}
            actions={
              <Button
                variant='ghost'
                onClick={() => {
                  setPreview(null);
                  setValidation(null);
                }}
              >
                Choose another file
              </Button>
            }
          >
            <div className='mb-5 overflow-x-auto rounded-lg border border-[#EAECF0]'>
              <table className='min-w-full text-xs'>
                <thead className='bg-[#F9FAFB]'>
                  <tr>
                    {preview.headers.map((h: string, i: number) => (
                      <th
                        key={i}
                        className='whitespace-nowrap px-2 py-1.5 text-left font-semibold text-[#475467]'
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.sampleRows.slice(0, 5).map((r: string[], i: number) => (
                    <tr key={i} className='border-t border-[#F2F4F7]'>
                      {r.map((c: string, j: number) => (
                        <td key={j} className='max-w-48 truncate whitespace-nowrap px-2 py-1'>
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <MappingEditor
              headers={preview.headers}
              mapping={mapping}
              setMapping={(m) => {
                setMapping(m);
                setDirty(true);
              }}
            />
            <div className='mt-5 flex flex-wrap items-center gap-4 border-t border-[#F2F4F7] pt-4'>
              <Checkbox
                label="Import participants without an email address (they can't be invited until one is added)"
                checked={includeWithoutEmail}
                onChange={(e) => {
                  setIncludeWithoutEmail(e.target.checked);
                  revalidate({ includeWithoutEmail: e.target.checked });
                }}
              />
              <div className='flex-1' />
              <Button
                icon={RefreshCw}
                loading={validating}
                onClick={() => revalidate()}
                variant={dirty ? 'primary' : 'secondary'}
              >
                {dirty ? 'Apply mapping & validate' : 'Revalidate'}
              </Button>
            </div>
            {mappingError && (
              <p className='mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700'>
                {mappingError}
              </p>
            )}
          </Card>

          {s && (
            <Card
              title='2. Review & fix'
              description='Edit rows with errors, or exclude them. Duplicates (same email, or same name in the same team without email) are skipped automatically.'
            >
              <div className='mb-5 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8'>
                <StatCard label='Rows processed' value={s.totalRows} />
                <StatCard label='Participant records' value={s.totalRecords} />
                <StatCard
                  label='New teams'
                  value={s.teamsToCreate}
                  sub={
                    s.existingTeamsMatched
                      ? `${s.existingTeamsMatched} existing matched`
                      : undefined
                  }
                  tone='teal'
                />
                <StatCard label='To import' value={s.participantsToCreate} tone='green' />
                <StatCard label='Duplicates' value={s.duplicates} tone='violet' />
                <StatCard label='Invalid' value={s.invalid} tone='red' />
                <StatCard label='Excluded' value={s.excluded} />
                <StatCard label='Without email' value={s.withoutEmail} tone='amber' />
              </div>
              {s.teamSizes && Object.keys(s.teamSizes).length > 0 && (
                <p className='mb-4 text-xs text-[#667085]'>
                  Team sizes:{' '}
                  {Object.entries(s.teamSizes)
                    .slice(0, 40)
                    .map(([t, n]) => `${t} (${n})`)
                    .join(' · ')}
                  {Object.keys(s.teamSizes).length > 40 ? ' …' : ''}
                </p>
              )}
              <Tabs
                value={filter}
                onChange={(v) => {
                  setFilter(v);
                  setPage(1);
                }}
                tabs={[
                  { value: 'ALL', label: 'All', count: records.length },
                  ...['VALID', 'WARNING', 'ERROR', 'DUPLICATE', 'EXCLUDED'].map((k) => ({
                    value: k,
                    label: k.charAt(0) + k.slice(1).toLowerCase(),
                    count: counts[k] || 0
                  }))
                ]}
              />
              <div className='mt-4 rounded-lg border border-[#EAECF0]'>
                {!shown.length ? (
                  <EmptyState title='No records in this view' />
                ) : (
                  <>
                    <Table
                      head={
                        <>
                          <Th>Row</Th>
                          <Th>Team</Th>
                          <Th>Name</Th>
                          <Th>Email</Th>
                          <Th>Phone</Th>
                          <Th>Status</Th>
                          <Th />
                        </>
                      }
                    >
                      {shown.slice((page - 1) * PAGE, page * PAGE).map((r) => (
                        <RecordRow
                          key={`${r.key}-${JSON.stringify(edits[r.key] || {})}`}
                          r={r}
                          excluded={excluded.includes(r.key)}
                          edit={edits[r.key]}
                          onEdit={onEdit}
                          onToggleExclude={onToggleExclude}
                        />
                      ))}
                    </Table>
                    <Pagination
                      page={page}
                      pages={Math.ceil(shown.length / PAGE)}
                      total={shown.length}
                      limit={PAGE}
                      onPage={setPage}
                    />
                  </>
                )}
              </div>
              <div className='mt-5 flex flex-wrap items-center justify-end gap-3 border-t border-[#F2F4F7] pt-4'>
                {dirty && (
                  <span className='text-sm text-amber-700'>
                    Mapping changed — validate before importing.
                  </span>
                )}
                <Button
                  icon={CheckCircle2}
                  disabled={dirty || validating || !s.participantsToCreate}
                  onClick={() => setConfirmOpen(true)}
                >
                  Import {s.participantsToCreate} participant(s)
                </Button>
              </div>
            </Card>
          )}
        </>
      )}

      <ImportHistory />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title='Confirm import'
        confirmLabel='Import now'
        loading={importing}
        onConfirm={() => confirmImport()}
        message={
          s && (
            <>
              Create <b>{s.teamsToCreate}</b> new team(s) and <b>{s.participantsToCreate}</b>{' '}
              participant(s). {s.duplicates + s.invalid + s.excluded} record(s) will be skipped.{' '}
              <b>No emails will be sent.</b>
            </>
          )
        }
      />
    </div>
  );
}
