import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eye, Save, RotateCcw, Send } from 'lucide-react';
import { toast } from 'sonner';
import { api, get, errMsg } from '../../lib/api';
import { useAction } from '../../lib/hooks';
import { useEvent } from '../../context/EventContext';
import {
  Button,
  Card,
  ConfirmDialog,
  ErrorState,
  Field,
  Input,
  Loading,
  PageHeader,
  Tabs,
  Textarea
} from '../../components/ui';
import EventForm from '../../components/EventForm';
import type { Json } from '../../lib/types';

const KINDS: Array<{ value: 'invitation' | 'reminder' | 'ticket'; label: string }> = [
  { value: 'invitation', label: 'RSVP invitation' },
  { value: 'reminder', label: 'RSVP reminder' },
  { value: 'ticket', label: 'QR ticket' }
];

function TemplateEditor({ event }: { event: Json }) {
  const defaults = useQuery({
    queryKey: ['template-defaults'],
    queryFn: () => get('/events/templates/defaults')
  });
  const [kind, setKind] = useState<'invitation' | 'reminder' | 'ticket'>('invitation');
  const [subject, setSubject] = useState('');
  const [html, setHtml] = useState('');
  const [preview, setPreview] = useState<Json>(null);
  const [previewing, setPreviewing] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const custom = event.emailTemplates?.[kind];
  const isCustom = Boolean(custom?.subject || custom?.html);

  useEffect(() => {
    if (!defaults.data) return;
    const d = defaults.data.defaults[kind];
    setSubject(custom?.subject || d.subject);
    setHtml(custom?.html || d.html);
    setPreview(null);
  }, [kind, defaults.data, event._id, event.updatedAt]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = useAction(
    (tpl: { subject: string; html: string }) =>
      api.put(`/events/${event._id}`, { emailTemplates: { [kind]: tpl } }),
    {
      invalidate: ['events'],
      success: (_d, tpl) => (tpl.subject ? 'Template saved' : 'Template reset to default')
    }
  );
  const test = useAction<Json, void>(
    () => api.post(`/events/${event._id}/templates/${kind}/test`).then((r) => r.data),
    { success: (d) => `Test email sent to ${d.to}` }
  );

  async function runPreview() {
    setPreviewing(true);
    try {
      const { data } = await api.post(`/events/${event._id}/templates/${kind}/preview`, {
        subject,
        html
      });
      setPreview(data);
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setPreviewing(false);
    }
  }

  if (defaults.isLoading) return <Loading />;
  if (defaults.isError) return <ErrorState error={defaults.error} onRetry={defaults.refetch} />;
  const placeholders = [...defaults.data.placeholders.common, ...defaults.data.placeholders[kind]];

  return (
    <Card
      title='Email templates'
      description='Placeholders like {{memberName}} are filled in per participant. Values are HTML-escaped automatically.'
    >
      <Tabs value={kind} onChange={setKind} tabs={KINDS} />
      <div className='mt-5 grid gap-6 xl:grid-cols-2'>
        <div className='space-y-4'>
          <Field label='Subject'>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={300} />
          </Field>
          <Field
            label='Body (HTML)'
            hint={isCustom ? 'Custom template in use.' : 'Using the default template.'}
          >
            <Textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className='min-h-96 font-mono text-xs'
              spellCheck={false}
            />
          </Field>
          <div>
            <p className='mb-1.5 text-xs font-medium text-[#667085]'>
              Available placeholders (click to insert at the end)
            </p>
            <div className='flex flex-wrap gap-1'>
              {placeholders.map((p: string) => (
                <button
                  key={p}
                  type='button'
                  className='rounded bg-[#F2F4F7] px-1.5 py-0.5 font-mono text-[11px] text-[#344054] hover:bg-[#CCEDDC]'
                  onClick={() => setHtml((h) => `${h}{{${p}}}`)}
                >{`{{${p}}}`}</button>
              ))}
            </div>
            {kind === 'ticket' && (
              <p className='mt-2 text-xs text-[#667085]'>
                Keep <code>{'{{qrCodeImage}}'}</code> in the ticket template — it embeds the
                participant's QR code (also attached as a PNG).
              </p>
            )}
          </div>
          <div className='flex flex-wrap gap-2'>
            <Button
              icon={Save}
              loading={save.isPending && !!save.variables?.subject}
              onClick={() => save.mutate({ subject, html })}
              disabled={!subject.trim() || !html.trim()}
            >
              Save template
            </Button>
            <Button variant='secondary' icon={Eye} loading={previewing} onClick={runPreview}>
              Preview
            </Button>
            <Button
              variant='secondary'
              icon={Send}
              loading={test.isPending}
              onClick={() => test.mutate()}
              title='Sends the saved template to your own email'
            >
              Send test to me
            </Button>
            <Button
              variant='ghost'
              icon={RotateCcw}
              disabled={!isCustom}
              onClick={() => setConfirmReset(true)}
            >
              Reset to default
            </Button>
          </div>
          <p className='text-xs text-[#667085]'>
            “Send test” uses the <b>saved</b> template with sample data; no participant receives it.
          </p>
        </div>
        <div>
          <p className='mb-1.5 text-sm font-medium text-[#344054]'>
            Preview{' '}
            {preview && (
              <span className='font-normal text-[#667085]'>
                — Subject: <b>{preview.subject}</b>
              </span>
            )}
          </p>
          {preview ? (
            <iframe
              title='Email preview'
              sandbox=''
              srcDoc={preview.html}
              className='h-[640px] w-full rounded-xl border border-[#EAECF0] bg-white'
            />
          ) : (
            <div className='flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-[#EAECF0] text-sm text-[#667085]'>
              Click “Preview” to render this template with sample data.
            </div>
          )}
        </div>
      </div>
      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title='Reset template?'
        confirmLabel='Reset'
        loading={save.isPending}
        onConfirm={() =>
          save.mutate({ subject: '', html: '' }, { onSuccess: () => setConfirmReset(false) })
        }
        message='Your custom subject and body for this email will be removed and the default template used.'
      />
    </Card>
  );
}

export default function Settings() {
  const { event } = useEvent();
  const save = useAction((p: Json) => api.put(`/events/${event?._id}`, p).then((r) => r.data), {
    invalidate: ['events', 'rsvp', 'dashboard'],
    success: (d) =>
      d.deadline
        ? `Settings saved · ${d.deadline.pendingUpdated} pending RSVP(s) moved to the new deadline, ${d.deadline.expiredReopened} expired reopened`
        : 'Settings saved'
  });
  if (!event) return <Loading />;
  return (
    <div className='space-y-6'>
      <PageHeader
        title='Settings'
        description={`Event configuration for ${event.name}. Nothing here is hard-coded — changes apply to future emails and links.`}
      />
      <Card title='Event settings'>
        <EventForm
          key={`${event._id}-${event.updatedAt}`}
          event={event}
          onSubmit={(p: Json) => save.mutate(p)}
          submitting={save.isPending}
          submitLabel='Save settings'
        />
      </Card>
      <TemplateEditor event={event} />
    </div>
  );
}
