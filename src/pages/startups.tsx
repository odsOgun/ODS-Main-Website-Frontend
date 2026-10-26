import { useEffect, useState } from 'react';
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
  APPLY_URL: '/register/startup', // Internal startup registration form used by every apply button.
  DEADLINE: '2026-10-30T23:59:00+01:00', // WAT
  PRIZE_AMOUNT: '' // e.g. "₦5,000,000". Empty = "Revealing soon".
};

const DEADLINE_MS = new Date(CONFIG.DEADLINE).getTime();

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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const prizeRevealed = Boolean(CONFIG.PRIZE_AMOUNT);
  const prizeText = CONFIG.PRIZE_AMOUNT || '₦0,000,000';

  const handleCta = (cta: 'showcase' | 'competition', loc: string) => () => {
    track('cta_click', { cta, location: loc });
  };

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
                      href={CONFIG.APPLY_URL}
                      target='_blank'
                      rel='noopener noreferrer'
                      onClick={handleCta('showcase', 'hero')}
                    >
                      Apply to showcase
                    </a>
                    {/* <a className='btn btn-ghost' href={CONFIG.APPLY_URL} target='_blank' rel='noopener noreferrer' onClick={handleCta('competition', 'hero')}>
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
                      href={CONFIG.APPLY_URL}
                      target='_blank'
                      rel='noopener noreferrer'
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
                      href={CONFIG.APPLY_URL}
                      target='_blank'
                      rel='noopener noreferrer'
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
                      href={CONFIG.APPLY_URL}
                      target='_blank'
                      rel='noopener noreferrer'
                      onClick={handleCta('showcase', 'final')}
                    >
                      Apply to showcase
                    </a>
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
