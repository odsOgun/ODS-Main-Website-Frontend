/* eslint-disable @typescript-eslint/no-unused-vars -- the apply form below is temporarily commented out; remove this when it's restored */
import { useEffect, useRef, useState } from 'react';
import Nav from '@/components/local/nav';
import Footer from '@/components/local/footer';
import '@/styles/startups.css';
import HeroImg from '@/assets/img/startups/hero.jpg';
import ShowcaseImg from '@/assets/img/startups/showcase.jpg';
import CompetitionImg from '@/assets/img/startups/competition.jpg';
import GreenRoomImg from '@/assets/img/startups/green-room.jpg';
import FinalCtaImg from '@/assets/img/startups/final-cta.jpg';

/* ===== Config: the only values that need editing ===== */
const CONFIG = {
  FORM_ENDPOINT: '', // POST URL (multipart/form-data). Empty = demo mode.
  DEADLINE: '2026-10-30T23:59:00+01:00', // WAT
  PRIZE_AMOUNT: '', // e.g. "₦5,000,000". Empty = "Revealing soon".
  MAX_DECK_MB: 10
};

const DEADLINE_MS = new Date(CONFIG.DEADLINE).getTime();

const STATES = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'FCT (Abuja)',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
  'Outside Nigeria'
];
const SECTORS = [
  'Fintech',
  'Agritech',
  'Edtech',
  'Healthtech',
  'E-commerce',
  'Creative',
  'AI',
  'Other'
];
const STAGES = ['Idea', 'Prototype', 'Launched without revenue', 'Earning revenue'];
const FUNDING = ['None', 'Under ₦5m', '₦5m to ₦50m', 'Over ₦50m'];

const FAQS = [
  [
    'Can I apply for both the showcase and the competition?',
    'Yes. Fill the form once and tick "I also want to enter the Startup Competition."'
  ],
  [
    "My startup isn't in Ogun State. Can I apply?",
    'Yes, you can enter the Startup Competition. The showcase is for startups based in Ogun State that are earning revenue.'
  ],
  [
    'How many startups will be showcased?',
    '10 startups are selected for the Startup Showcase on November 26, 2026.'
  ],
  ['Does it cost anything?', 'No. Applying, showcasing and entering the competition are free.'],
  ['How much is the grant?', "We'll announce the prize pool before the summit."],
  [
    'Do winners give up equity?',
    'No. Grants are not investments and take no ownership of your startup.'
  ],
  [
    'What is the Green Room?',
    "A private meeting space at the venue where investors meet the showcase startups they're interested in."
  ],
  ['When is the deadline?', 'October 30, 2026 at 11:59 PM West Africa Time.']
];

type FieldName =
  | 'founder_name'
  | 'email'
  | 'phone'
  | 'startup_name'
  | 'website'
  | 'state'
  | 'sector'
  | 'stage'
  | 'booth_attendees'
  | 'description'
  | 'problem'
  | 'traction'
  | 'funding'
  | 'cofounders'
  | 'pitch_deck'
  | 'pitch_video';

type FieldKind = 'text' | 'email' | 'tel' | 'url' | 'number' | 'file';

interface FieldRule {
  kind: FieldKind;
  required: boolean;
  comp?: boolean; // only validated when entering the competition
  min?: number;
  max?: number;
}

const RULES: Record<FieldName, FieldRule> = {
  founder_name: { kind: 'text', required: true },
  email: { kind: 'email', required: true },
  phone: { kind: 'tel', required: true },
  startup_name: { kind: 'text', required: true },
  website: { kind: 'url', required: false },
  state: { kind: 'text', required: true },
  sector: { kind: 'text', required: true },
  stage: { kind: 'text', required: true },
  booth_attendees: { kind: 'number', required: true, min: 1, max: 3 },
  description: { kind: 'text', required: true },
  problem: { kind: 'text', required: true, comp: true },
  traction: { kind: 'text', required: true, comp: true },
  funding: { kind: 'text', required: true, comp: true },
  cofounders: { kind: 'number', required: true, comp: true, min: 1, max: 10 },
  pitch_deck: { kind: 'file', required: true, comp: true },
  pitch_video: { kind: 'url', required: false, comp: true }
};

const FIELD_ORDER = Object.keys(RULES) as FieldName[];

type Values = Record<Exclude<FieldName, 'pitch_deck'>, string>;

const INITIAL_VALUES: Values = {
  founder_name: '',
  email: '',
  phone: '',
  startup_name: '',
  website: '',
  state: '',
  sector: '',
  stage: '',
  booth_attendees: '1',
  description: '',
  problem: '',
  traction: '',
  funding: '',
  cofounders: '',
  pitch_video: ''
};

/* Analytics → dataLayer (GTM/GA4) */
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}
function track(event: string, params: Record<string, unknown> = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

function validateField(name: FieldName, value: string, file: File | null): string {
  const rule = RULES[name];
  if (rule.kind === 'file') {
    if (rule.required && !file) return 'Upload your pitch deck as a PDF.';
    if (file && !/\.pdf$/i.test(file.name)) return 'Pitch deck must be a PDF file.';
    if (file && file.size > CONFIG.MAX_DECK_MB * 1048576)
      return `Pitch deck must be ${CONFIG.MAX_DECK_MB} MB or smaller.`;
    return '';
  }
  const v = value.trim();
  if (rule.required && !v) return 'This field is required.';
  if (!v) return '';
  if (rule.kind === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
    return 'Enter a valid email address.';
  if (rule.kind === 'tel' && !/^(\+?234|0)[789][01]\d{8}$/.test(v.replace(/[\s()-]/g, '')))
    return 'Enter a valid Nigerian phone number, e.g. 0803 000 0000 or +234 803 000 0000.';
  if (rule.kind === 'url' && !/^https?:\/\/\S+\.\S+/.test(v))
    return 'Enter a full link starting with https://';
  if (rule.kind === 'number' && (!Number.isInteger(+v) || +v < rule.min! || +v > rule.max!))
    return `Enter a whole number from ${rule.min} to ${rule.max}.`;
  return '';
}

function useCountdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);
  const diff = DEADLINE_MS - now;
  return {
    closed: diff <= 0,
    days: Math.floor(diff / 864e5),
    hours: String(Math.floor((diff % 864e5) / 36e5)).padStart(2, '0'),
    minutes: String(Math.floor((diff % 36e5) / 6e4)).padStart(2, '0')
  };
}

const BENEFITS: {
  tone: 'g' | 'c' | 'b';
  title: string;
  text: string;
  chip: string;
  icon: JSX.Element;
}[] = [
  {
    tone: 'g',
    title: 'Free exhibition booth',
    text: 'A booth at the summit to demo your product, at no cost.',
    chip: 'Showcase',
    icon: <path d='M3 9l2-5h14l2 5M3 9h18v11H3zM9 20v-6h6v6' />
  },
  {
    tone: 'g',
    title: 'Seen by investors',
    text: 'Investors attending ODS 2026 come to see the 10 showcase startups.',
    chip: 'Showcase',
    icon: (
      <>
        <path d='M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z' />
        <circle cx='12' cy='12' r='3' />
      </>
    )
  },
  {
    tone: 'g',
    title: 'Green Room meetings',
    text: 'Private one-on-one meetings with investors interested in your startup.',
    chip: 'Showcase',
    icon: (
      <>
        <circle cx='8' cy='8' r='3' />
        <circle cx='16' cy='8' r='3' />
        <path d='M3 20c0-3 2.5-5 5-5s5 2 5 5M11 20c0-3 2.5-5 5-5s5 2 5 5' />
      </>
    )
  },
  {
    tone: 'g',
    title: 'ODS website listing',
    text: 'Your startup listed on the ODS website as a showcased startup.',
    chip: 'Showcase',
    icon: (
      <>
        <circle cx='12' cy='12' r='9' />
        <path d='M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18' />
      </>
    )
  },
  {
    tone: 'c',
    title: 'Pitch on the ODS stage',
    text: 'Present your startup live to a panel of judges.',
    chip: 'Competition',
    icon: (
      <>
        <rect x='9' y='3' width='6' height='11' rx='3' />
        <path d='M5 11a7 7 0 0 0 14 0M12 18v3' />
      </>
    )
  },
  {
    tone: 'c',
    title: 'Feedback from judges',
    text: 'Hear what experienced judges think of your business and pitch.',
    chip: 'Competition',
    icon: <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' />
  },
  {
    tone: 'c',
    title: 'Win a grant',
    text: 'Winners receive a grant from the prize pool, announced before the summit.',
    chip: 'Competition',
    icon: (
      <>
        <circle cx='12' cy='9' r='6' />
        <path d='M8.5 14L7 22l5-3 5 3-1.5-8' />
      </>
    )
  },
  {
    tone: 'b',
    title: 'Free to take part',
    text: 'No fees to apply, showcase or enter the competition.',
    chip: 'Both',
    icon: (
      <path d='M20 12v8H4v-8M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z' />
    )
  }
];

export default function Startups() {
  const countdown = useCountdown();
  const [values, setValues] = useState<Values>(INITIAL_VALUES);
  const [deck, setDeck] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [competition, setCompetition] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const formStarted = useRef(false);
  const successRef = useRef<HTMLDivElement>(null);

  const prizeRevealed = Boolean(CONFIG.PRIZE_AMOUNT);
  const prizeText = CONFIG.PRIZE_AMOUNT || '₦0,000,000';
  const showEligNotice =
    !!values.state &&
    !!values.stage &&
    (values.state !== 'Ogun' || values.stage !== 'Earning revenue');

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  const isActive = (name: FieldName) => !RULES[name].comp || competition;

  const runValidation = (name: FieldName, value?: string) => {
    const msg = isActive(name)
      ? validateField(name, value ?? (name === 'pitch_deck' ? '' : values[name]), deck)
      : '';
    setErrors((prev) => ({ ...prev, [name]: msg }));
    return msg;
  };

  const handleChange = (name: Exclude<FieldName, 'pitch_deck'>, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) runValidation(name, value);
  };

  const toggleCompetition = (on: boolean, via?: string) => {
    setCompetition(on);
    if (!on) {
      setErrors((prev) => {
        const next = { ...prev };
        FIELD_ORDER.filter((n) => RULES[n].comp).forEach((n) => delete next[n]);
        return next;
      });
    } else {
      track('competition_checkbox_selected', via ? { via } : {});
    }
  };

  const handleCta = (cta: 'showcase' | 'competition', loc: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (cta === 'competition') toggleCompetition(true, 'cta');
    track('cta_click', { cta, location: loc });
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (countdown.closed) return;

    const nextErrors: Partial<Record<FieldName, string>> = {};
    FIELD_ORDER.filter(isActive).forEach((name) => {
      const msg = validateField(name, name === 'pitch_deck' ? '' : values[name], deck);
      if (msg) nextErrors[name] = msg;
    });
    setErrors(nextErrors);
    const firstBad = FIELD_ORDER.find((n) => nextErrors[n]);
    if (firstBad) {
      const el = document.getElementsByName(firstBad)[0] as HTMLElement | undefined;
      el?.scrollIntoView({ block: 'center' });
      el?.focus({ preventScroll: true });
      return;
    }

    const showcaseEligible = values.state === 'Ogun' && values.stage === 'Earning revenue';
    const data = new FormData();
    FIELD_ORDER.filter(isActive).forEach((name) => {
      if (name === 'pitch_deck') {
        if (deck) data.append(name, deck);
      } else {
        data.append(name, values[name]);
      }
    });
    data.set('competition_entrant', competition ? 'true' : 'false');
    data.set('showcase_eligible', showcaseEligible ? 'true' : 'false');
    // Server must recompute these flags, re-check the deck and enforce the deadline.

    setSubmitting(true);
    setSubmitError('');
    try {
      if (CONFIG.FORM_ENDPOINT) {
        const res = await fetch(CONFIG.FORM_ENDPOINT, { method: 'POST', body: data });
        if (!res.ok) throw new Error(String(res.status));
      } else {
        await new Promise((r) => setTimeout(r, 600)); // demo mode
      }
      track('application_submitted', {
        competition_entrant: competition,
        showcase_eligible: showcaseEligible
      });
      setSubmitted(true);
    } catch {
      setSubmitError(
        "Your application didn't send. Your answers are still here, so check your connection and select Submit application again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const fieldProps = (name: Exclude<FieldName, 'pitch_deck'>) => ({
    id: name,
    name,
    value: values[name],
    required: RULES[name].required && isActive(name),
    'aria-invalid': errors[name] ? true : undefined,
    onBlur: () => runValidation(name),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      handleChange(name, e.target.value)
  });

  const renderField = ({
    name,
    label,
    full,
    hint,
    counter,
    children
  }: {
    name: FieldName;
    label: React.ReactNode;
    full?: boolean;
    hint?: string;
    counter?: number;
    children: React.ReactNode;
  }) => (
    <div className={`field${full ? ' full' : ''}${errors[name] ? ' invalid' : ''}`}>
      <label htmlFor={name}>{label}</label>
      {children}
      {counter !== undefined && name !== 'pitch_deck' && (
        <span className='counter'>
          {values[name].length}/{counter}
        </span>
      )}
      {hint && <span className='hint'>{hint}</span>}
      <span className='err'>{errors[name]}</span>
    </div>
  );

  return (
    <div>
      <Nav />

      <main className='startups-page'>
        {/* Hero */}
        <section className='hero' aria-labelledby='hero-title'>
          <div className='wrap'>
            <div className='hero-grid'>
              <div>
                <h1 id='hero-title' className='display'>
                  Your startup, <em>on the ODS stage.</em>
                </h1>
                <p className='lead'>
                  Be one of 10 startups showcased to investors at Ogun Digital Summit 2026, or pitch
                  to a panel of judges in the Startup Competition and win a grant.
                </p>
                {!countdown.closed && (
                  <div className='hero-ctas'>
                    <a
                      className='btn btn-green'
                      href='#apply'
                      onClick={handleCta('showcase', 'hero')}
                    >
                      Apply to showcase
                    </a>
                    {/* <a className='btn btn-ghost' href='#apply' onClick={handleCta('competition', 'hero')}>
                      Enter the competition
                    </a> */}
                  </div>
                )}
                <div className='cd-inline' role='timer' aria-label='Time left to apply'>
                  {countdown.closed ? (
                    <span>Applications are closed</span>
                  ) : (
                    <>
                      <span>Applications close in</span>
                      <span className='cd'>
                        <span>
                          {countdown.days}
                          <small>d</small>
                        </span>
                        <span>
                          {countdown.hours}
                          <small>h</small>
                        </span>
                        <span>
                          {countdown.minutes}
                          <small>m</small>
                        </span>
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className='burst' aria-hidden='true'>
                <div className='s' />
                <div className='p'>
                  <img src={HeroImg} alt='' />
                </div>
              </div>
            </div>
            <div className='band' role='list'>
              <div role='listitem'>
                <strong>10 startups</strong>
                <span>Showcased to investors</span>
              </div>
              <div role='listitem'>
                <strong className={prizeRevealed ? '' : 'blur'} aria-hidden={!prizeRevealed}>
                  {prizeText}
                </strong>
                <span>Grant prize pool</span>
              </div>
              <div role='listitem'>
                <strong>November 25–26</strong>
                <span>Competition and showcase</span>
              </div>
              <div role='listitem'>
                <strong>October 30, 2026</strong>
                <span>Application deadline</span>
              </div>
            </div>
          </div>
        </section>

        {/* Two tracks */}
        <section aria-labelledby='tracks-title'>
          <div className='wrap'>
            <div className='head'>
              <h2 id='tracks-title' className='display'>
                Two ways <em>to take part</em>
              </h2>
              <p className='lead'>
                One application covers both. Every applicant is considered for the showcase, and one
                tick enters you into the competition. See the full list of benefits below.
              </p>
            </div>
            <div className='tracks'>
              <article className='track'>
                <figure>
                  <img
                    src={ShowcaseImg}
                    alt='An attendee at Ogun Digital Summit 2025 holding her event badge'
                    loading='lazy'
                  />
                  <span className='stamp' style={{ background: 'var(--green)' }}>
                    <b>10</b>
                    <small>startups</small>
                  </span>
                </figure>
                <div className='body'>
                  <span className='date'>November 26, 2026</span>
                  <h3>Startup Showcase</h3>
                  <p>
                    We select 10 startups to exhibit at the summit, with investors in the room to
                    see them. Investors who are interested meet the founders privately in the Green
                    Room.
                  </p>
                  <p className='for'>
                    <b>Who it's for</b>Startups based in Ogun State that are already earning
                    revenue.
                  </p>
                  {!countdown.closed && (
                    <a
                      className='btn btn-green'
                      href='#apply'
                      onClick={handleCta('showcase', 'cards')}
                    >
                      Apply to showcase
                    </a>
                  )}
                </div>
              </article>
              <article className='track'>
                <figure>
                  <img
                    src={CompetitionImg}
                    alt='A speaker presenting from the lectern at Ogun Digital Summit 2025'
                    loading='lazy'
                  />
                  <span className='stamp' style={{ background: 'var(--coral)' }}>
                    <b>₦</b>
                    <small>grants</small>
                  </span>
                </figure>
                <div className='body'>
                  <span className='date'>November 25, 2026</span>
                  <h3>Startup Competition</h3>
                  <p>
                    Shortlisted startups pitch live to a panel of judges. The best pitches win a
                    grant from the prize pool, with no equity taken.
                  </p>
                  <p className='for'>
                    <b>Who it's for</b>Startups from anywhere, at any stage, from idea to revenue.
                  </p>
                  {!countdown.closed && (
                    <a
                      className='btn btn-coral'
                      href='#apply'
                      onClick={handleCta('competition', 'cards')}
                    >
                      Enter the competition
                    </a>
                  )}
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className='benefits' aria-labelledby='ben-title'>
          <div className='wrap'>
            <div className='head'>
              <h2 id='ben-title' className='display'>
                What your startup <em>gets</em>
              </h2>
              <p className='lead'>Each benefit is marked with the programme it comes from.</p>
            </div>
            <ul className='bgrid'>
              {BENEFITS.map((b) => (
                <li key={b.title} className={b.tone}>
                  <span className='ic'>
                    <svg viewBox='0 0 24 24'>{b.icon}</svg>
                  </span>
                  <h3>{b.title}</h3>
                  <p>{b.text}</p>
                  <span className='chip'>{b.chip}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Prize pool */}
        <section className='prize' aria-labelledby='prize-title'>
          <div className='wrap'>
            <div className='box'>
              <div>
                <span className='tag'>{prizeRevealed ? 'Now revealed' : 'Revealing soon'}</span>
                <h2 id='prize-title' className='display'>
                  Startup Competition <em style={{ color: 'var(--coral)' }}>prize pool</em>
                </h2>
                <p className='lead' style={{ margin: 0 }}>
                  {prizeRevealed
                    ? 'Total grants available to winners of the ODS 2026 Startup Competition.'
                    : "We'll announce the total grant prize pool before the summit. Apply now so you're in the running when it's revealed."}
                </p>
              </div>
              <div
                className={`amount${prizeRevealed ? '' : ' blur'}`}
                aria-label={prizeRevealed ? undefined : 'Prize amount not yet revealed'}
              >
                {prizeText}
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className='timeline-sec' aria-labelledby='tl-title'>
          <div className='wrap'>
            <div className='head'>
              <h2 id='tl-title' className='display'>
                From application <em>to the stage</em>
              </h2>
              <p className='lead'>Apply once. Here's what happens next.</p>
            </div>
            <ol className='tl'>
              <li className='key'>
                <span className='when'>October 30</span>
                <h3>Applications close</h3>
                <p>
                  Submit the form by 11:59 PM WAT. Tick the competition box if you want to pitch.
                </p>
              </li>
              <li>
                <span className='when'>Before the summit</span>
                <h3>Selection</h3>
                <p>
                  We choose the 10 showcase startups and shortlist startups for the competition,
                  then email everyone selected.
                </p>
              </li>
              <li>
                <span className='when'>November 25</span>
                <h3>Startup Competition</h3>
                <p>
                  Shortlisted startups pitch to the judges. Winners receive grants from the prize
                  pool.
                </p>
              </li>
              <li>
                <span className='when'>November 26</span>
                <h3>Startup Showcase</h3>
                <p>
                  The 10 startups exhibit to attendees and investors, and meet interested investors
                  in the Green Room.
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* Green Room */}
        <section aria-labelledby='gr-title'>
          <div className='wrap gr'>
            <figure>
              <img
                src={GreenRoomImg}
                alt='Founders and guests at Ogun Digital Summit 2025'
                loading='lazy'
              />
            </figure>
            <div>
              <h2 id='gr-title' className='display'>
                Meet investors in <em>the Green Room</em>
              </h2>
              <p className='lead'>
                We're bringing investors to ODS 2026 to see the 10 showcase startups. When an
                investor wants to know more about your startup, you talk privately in the Green
                Room, a quiet space at the venue set aside for these conversations.
              </p>
              <p style={{ fontWeight: 600, color: 'var(--heading)', marginBottom: 8 }}>
                Come prepared with:
              </p>
              <ol>
                <li>Your traction and revenue numbers</li>
                <li>How much you're raising and what it's for</li>
                <li>Your next 12 months</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Apply */}
        <section className='apply' id='apply' aria-labelledby='apply-title'>
          {/* <div className='wrap apply-grid'>
            <aside className='side'>
              <h2 id='apply-title' className='display'>
                Apply <em>now</em>
              </h2>
              <p className='lead'>
                One form for both. It takes about 5 minutes; have a PDF pitch deck ready if you're
                entering the competition.
              </p>
              <div className='elig'>
                <h3>Startup Showcase</h3>
                <ul className='ticks'>
                  <li>Based in Ogun State</li>
                  <li>Already earning revenue</li>
                  <li>Can staff a booth on November 26</li>
                </ul>
              </div>
              <div className='elig'>
                <h3>Startup Competition</h3>
                <ul className='ticks'>
                  <li>Based anywhere</li>
                  <li>Any stage, from idea to revenue</li>
                  <li>Can pitch in person on November 25 if shortlisted</li>
                </ul>
              </div>
            </aside>

            <div className='form-card'>
              {countdown.closed ? (
                <div className='state-msg'>
                  <h3>Applications are closed</h3>
                  <p>
                    Applications for the ODS 2026 Startup Showcase and Startup Competition closed on
                    October 30, 2026. See you at the summit.
                  </p>
                </div>
              ) : submitted ? (
                <div className='state-msg' ref={successRef} tabIndex={-1}>
                  <h3>Application received</h3>
                  <p>
                    Thanks for applying to ODS 2026. We've sent a confirmation to your email and will
                    contact you if you're selected.
                  </p>
                </div>
              ) : (
                <form
                  noValidate
                  onSubmit={handleSubmit}
                  onFocus={() => {
                    if (!formStarted.current) {
                      formStarted.current = true;
                      track('form_start');
                    }
                  }}
                >
                  <fieldset>
                    <legend>About you</legend>
                    <div className='grid2'>
                      {renderField({ name: 'founder_name', label: 'Founder full name', children: <input {...fieldProps('founder_name')} autoComplete='name' /> })}
                      {renderField({ name: 'email', label: 'Email', children: <input {...fieldProps('email')} type='email' autoComplete='email' /> })}
                      {renderField({ name: 'phone', label: 'WhatsApp phone', full: true, children: <input {...fieldProps('phone')} type='tel' autoComplete='tel' placeholder='0803 000 0000' /> })}
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend>About your startup</legend>
                    <div className='grid2'>
                      {renderField({ name: 'startup_name', label: 'Startup name', children: <input {...fieldProps('startup_name')} /> })}
                      {renderField({
                        name: 'website',
                        label: <>Website or social link <span className='opt'>(optional)</span></>,
                        children: <input {...fieldProps('website')} type='url' placeholder='https://' />
                      })}
                      {renderField({
                        name: 'state',
                        label: 'Startup location',
                        children: (
                          <select {...fieldProps('state')}>
                            <option value=''>Select a state</option>
                            {STATES.map(s => <option key={s}>{s}</option>)}
                          </select>
                        )
                      })}
                      {renderField({
                        name: 'sector',
                        label: 'Sector',
                        children: (
                          <select {...fieldProps('sector')}>
                            <option value=''>Select a sector</option>
                            {SECTORS.map(s => <option key={s}>{s}</option>)}
                          </select>
                        )
                      })}
                      {renderField({
                        name: 'stage',
                        label: 'Stage',
                        children: (
                          <select {...fieldProps('stage')}>
                            <option value=''>Select a stage</option>
                            {STAGES.map(s => <option key={s}>{s}</option>)}
                          </select>
                        )
                      })}
                      {renderField({
                        name: 'booth_attendees',
                        label: 'Booth attendees',
                        hint: 'Up to 3 people, if selected for the showcase',
                        children: <input {...fieldProps('booth_attendees')} type='number' min={1} max={3} />
                      })}
                      {showEligNotice && (
                        <p className='notice' role='status'>
                          The showcase is for Ogun-based startups earning revenue. You can still enter the
                          Startup Competition below.
                        </p>
                      )}
                      {renderField({
                        name: 'description',
                        label: 'Startup description',
                        full: true,
                        counter: 140,
                        children: <input {...fieldProps('description')} maxLength={140} placeholder='What does your startup do, and for whom?' />
                      })}
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend>Startup Competition</legend>
                    <label className='toggle' htmlFor='competition_entrant'>
                      <input
                        type='checkbox'
                        id='competition_entrant'
                        checked={competition}
                        onChange={e => toggleCompetition(e.target.checked)}
                      />
                      <span>
                        <strong>I also want to enter the Startup Competition</strong>
                        <span className='hint'>
                          Pitch to judges for a grant. Open to startups from anywhere, at any stage.
                        </span>
                      </span>
                    </label>
                    {competition && (
                      <div className='comp grid2'>
                        {renderField({ name: 'problem', label: 'Problem being solved', full: true, counter: 500, children: <textarea {...fieldProps('problem')} maxLength={500} /> })}
                        {renderField({ name: 'traction', label: 'Traction', full: true, counter: 500, children: <textarea {...fieldProps('traction')} maxLength={500} placeholder='Users, revenue, pilots, partnerships' /> })}
                        {renderField({
                          name: 'funding',
                          label: 'Funding raised',
                          children: (
                            <select {...fieldProps('funding')}>
                              <option value=''>Select</option>
                              {FUNDING.map(f => <option key={f}>{f}</option>)}
                            </select>
                          )
                        })}
                        {renderField({ name: 'cofounders', label: 'Number of co-founders', children: <input {...fieldProps('cofounders')} type='number' min={1} max={10} /> })}
                        {renderField({
                          name: 'pitch_deck',
                          label: `Pitch deck (PDF, max ${CONFIG.MAX_DECK_MB} MB)`,
                          children: (
                            <input
                              id='pitch_deck'
                              name='pitch_deck'
                              type='file'
                              accept='application/pdf,.pdf'
                              aria-invalid={errors.pitch_deck ? true : undefined}
                              onChange={e => {
                                const file = e.target.files?.[0] ?? null;
                                setDeck(file);
                                setErrors(prev => ({ ...prev, pitch_deck: validateField('pitch_deck', '', file) }));
                              }}
                            />
                          )
                        })}
                        {renderField({
                          name: 'pitch_video',
                          label: <>Pitch video <span className='opt'>(optional link)</span></>,
                          children: <input {...fieldProps('pitch_video')} type='url' placeholder='https://' />
                        })}
                      </div>
                    )}
                  </fieldset>

                  <div className='form-actions'>
                    <button className='btn btn-green' type='submit' disabled={submitting}>
                      {submitting ? 'Submitting…' : 'Submit application'}
                    </button>
                    <span className='form-status' role='alert'>
                      {submitError}
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div> */}
        </section>

        {/* FAQ */}
        <section aria-labelledby='faq-title'>
          <div className='wrap faq-grid'>
            <h2 id='faq-title' className='display'>
              Questions <em>founders ask</em>
            </h2>
            <div className='faq'>
              {FAQS.map(([q, a], i) => (
                <details key={q} open={openFaq === i}>
                  <summary
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenFaq(openFaq === i ? null : i);
                    }}
                  >
                    {q}
                  </summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className='final' aria-labelledby='final-title'>
          <div className='wrap'>
            <div className='box'>
              <img src={FinalCtaImg} alt='' />
              <div className='inner'>
                <h2 id='final-title' className='display'>
                  Ready to put your startup on the map?
                </h2>
                <p>Applications close October 30, 2026.</p>
                {!countdown.closed && (
                  <div className='btns'>
                    <a
                      className='btn btn-white'
                      href='#apply'
                      onClick={handleCta('showcase', 'final')}
                    >
                      Apply to showcase
                    </a>
                    {/* <a className='btn btn-line-white' href='#apply' onClick={handleCta('competition', 'final')}>
                      Enter the competition
                    </a> */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
