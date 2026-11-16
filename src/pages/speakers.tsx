import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import Nav from '@/components/local/nav';
import Footer from '@/components/local/footer';
import heroImg from '@/assets/speakers/hero.webp';
import starMint from '@/assets/speakers/starMint.webp';
import ringPink from '@/assets/speakers/ringPink.webp';
import styles from './speakers.module.css';
import {
  GROUPS,
  HERO_WORDS,
  PAST_SPEAKERS,
  PHOTOS,
  SPEAKERS,
  TOPICS,
  type FilterKey,
  type Speaker
} from './speakers.data';

const HERO_FACES = ['fola', 'ademola', 'foluso', 'adebola'];

const HERO_STATS: { label: string; value: string; plus?: boolean }[] = [
  { label: 'Keynotes', value: '4' },
  { label: 'Panels', value: '5' },
  { label: 'Topics', value: '7' },
  { label: 'Attended in 2025', value: '2,500', plus: true }
];

const initials = (name: string) =>
  name
    .replace(/^Dr\.\s*/, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

const topicLabel = (key: string) => TOPICS.find(([k]) => k === key)?.[1] ?? '';

function ArrowIcon() {
  return (
    <svg aria-hidden='true' viewBox='0 0 16 16' width='16' height='16'>
      <path
        d='M3 8h9M8.5 4.5 12 8l-3.5 3.5'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function Portrait({ speaker }: { speaker: Speaker }) {
  const src = PHOTOS[speaker.id];
  return src ? (
    <img className={styles.speakerPhoto} src={src} alt={speaker.name} loading='lazy' />
  ) : (
    <span className={styles.portraitInitials}>{initials(speaker.name)}</span>
  );
}

const portraitStyle = (color: string) => ({ '--portrait': color }) as React.CSSProperties;

function SpeakerCard({ speaker, onOpen }: { speaker: Speaker; onOpen: (s: Speaker) => void }) {
  return (
    <button type='button' className={styles.speakerCard} onClick={() => onOpen(speaker)}>
      <div className={styles.portrait} style={portraitStyle(speaker.color)}>
        <Portrait speaker={speaker} />
        <span className={styles.viewSpeaker}>
          View profile <ArrowIcon />
        </span>
        <div className={styles.overlay}>
          <h3>{speaker.name}</h3>
          <p>{speaker.role}</p>
        </div>
      </div>
    </button>
  );
}

function SpeakerDialog({ speaker, onClose }: { speaker: Speaker | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (speaker && !dlg.open) dlg.showModal();
    if (!speaker && dlg.open) dlg.close();
  }, [speaker]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      onClose={onClose}
      // A click on the dialog element itself (not its content) is a click on the backdrop.
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {speaker && (
        <div className={styles.modal}>
          <button
            type='button'
            className={styles.close}
            aria-label='Close speaker details'
            onClick={onClose}
          >
            ×
          </button>
          <div>
            <div className={styles.drawerPortrait} style={portraitStyle(speaker.color)}>
              <Portrait speaker={speaker} />
            </div>
          </div>
          <div className={styles.modalContent}>
            <span className={styles.modalEyebrow}>{speaker.type} · ODS 2026</span>
            <h2>{speaker.name}</h2>
            <p className={styles.drawerRole}>{speaker.role}</p>
            <div className={styles.bio}>
              <span>Biography</span>
              <p>{speaker.bio}</p>
            </div>
            <div className={styles.session}>
              <div className={styles.sessionPills}>
                <span>{topicLabel(speaker.topic)}</span>
                <span>{speaker.type}</span>
                <span>{speaker.time}</span>
              </div>
              <h3>{speaker.session}</h3>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

function Speakers() {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [wordIndex, setWordIndex] = useState(0);
  const [selected, setSelected] = useState<Speaker | null>(null);
  const lineupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = window.setInterval(() => setWordIndex((i) => (i + 1) % HERO_WORDS.length), 2200);
    return () => window.clearInterval(id);
  }, []);

  const groups = useMemo(() => {
    const list = SPEAKERS.filter(
      (s) => filter === 'all' || (filter === 'keynote' ? s.type === 'Keynote' : s.topic === filter)
    );
    return GROUPS.map((g) => ({ ...g, speakers: list.filter(g.matches) })).filter(
      (g) => g.speakers.length > 0
    );
  }, [filter]);

  // Touch screens: the card crossing the middle of the viewport lights up, like hover on desktop.
  useEffect(() => {
    if (!window.matchMedia('(hover: none)').matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.target.classList.toggle(styles.inView, e.isIntersecting)),
      { rootMargin: '-46% 0px -46% 0px' }
    );
    lineupRef.current
      ?.querySelectorAll(`.${styles.speakerCard}`)
      .forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [groups]);

  return (
    <>
      <Nav />
      <div className={styles.site}>
        <main id='top'>
          <section className={styles.hero}>
            <div className={clsx(styles.wrap, styles.heroLayout)}>
              <div className={styles.heroCopy}>
                <h1>
                  <span className={styles.heroLine}>The voices</span>
                  <span className={styles.heroLine}>shaping Africa’s</span>
                  <span
                    key={wordIndex} // remount replays the word-in animation
                    className={clsx(styles.heroLine, styles.green, styles.word)}
                  >
                    {HERO_WORDS[wordIndex]}
                  </span>
                </h1>
                <div className={styles.heroFoot}>
                  <p>
                    {SPEAKERS.length} founders, investors, policymakers and creators in Abeokuta,
                    talking about what comes next for African tech.
                  </p>
                  <div className={styles.actions}>
                    <a className={clsx(styles.pill, styles.solid)} href='#lineup'>
                      Meet the speakers <span aria-hidden='true'>↓</span>
                    </a>
                    <a className={styles.pill} href='#register'>
                      Reserve your seat
                    </a>
                  </div>
                  <dl className={styles.hStats} aria-label='ODS 2026 in numbers'>
                    {HERO_STATS.map((stat) => (
                      <div key={stat.label}>
                        <dt>{stat.label}</dt>
                        <dd>
                          {stat.value}
                          {stat.plus && <span>+</span>}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
              <div className={styles.heroVisual} aria-hidden='true'>
                <img className={styles.heroImage} src={heroImg} alt='' />
                <img
                  className={clsx(styles.heroShape, styles.heroShapeMint)}
                  src={starMint}
                  alt=''
                />
                <img
                  className={clsx(styles.heroShape, styles.heroShapeRing)}
                  src={ringPink}
                  alt=''
                />
                <div className={clsx(styles.hStat, styles.hSpeakers)}>
                  <div className={styles.hFaces}>
                    {HERO_FACES.map((id) => (
                      <img key={id} src={PHOTOS[id]} alt='' />
                    ))}
                  </div>
                  <div>
                    <strong>{SPEAKERS.length}</strong>
                    <span>speakers, one stage</span>
                  </div>
                </div>
                <div className={clsx(styles.hStat, styles.hDate)}>
                  <i />
                  Thu 26 Nov · Abeokuta
                </div>
              </div>
            </div>
          </section>

          <section className={clsx(styles.section, styles.wrap)} id='lineup'>
            <div className={styles.sectionHead}>
              <h2>Meet our speakers</h2>
              <div className={styles.filters} role='group' aria-label='Filter speakers by topic'>
                {TOPICS.map(([key, label]) => (
                  <button
                    key={key}
                    type='button'
                    className={clsx(styles.filter, filter === key && styles.active)}
                    aria-pressed={filter === key}
                    onClick={() => setFilter(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.lineupGroups} ref={lineupRef}>
              {groups.map((group) => (
                <section
                  key={group.key}
                  className={clsx(styles.lineupGroup, styles[`group-${group.key}`])}
                >
                  <div className={styles.groupHead}>
                    <div>
                      <span>{group.label}</span>
                      <h3>{group.title}</h3>
                    </div>
                    <p>
                      {group.speakers.length} {group.speakers.length === 1 ? 'speaker' : 'speakers'}
                    </p>
                  </div>
                  <div className={styles.speakerGrid}>
                    {group.speakers.map((speaker) => (
                      <SpeakerCard key={speaker.id} speaker={speaker} onOpen={setSelected} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>

          <section className={styles.pastSection}>
            <div className={styles.wrap}>
              <div className={styles.sectionHead}>
                <div>
                  <span className={styles.sectionKicker}>From the ODS archive</span>
                  <h2>Past speakers</h2>
                </div>
              </div>
              <div className={styles.pastGrid}>
                {PAST_SPEAKERS.map((p) => (
                  <article key={p.name} className={styles.pastCard}>
                    <div className={styles.pastPortrait}>
                      <img src={p.image} alt={p.name} loading='lazy' />
                    </div>
                    <h3>{p.name}</h3>
                    <p>{p.role}</p>
                  </article>
                ))}
              </div>
              <div className={styles.pastFoot}>
                <p>
                  Since 2019, ODS has brought founders, creatives and policymakers to Abeokuta to
                  push youth empowerment, tech entrepreneurship and social innovation.
                </p>
                <Link className={styles.pill} to='/past-speaker'>
                  See all past speakers <ArrowIcon />
                </Link>
              </div>
            </div>
          </section>

          <section className={styles.appPromo} id='register'>
            <div className={styles.wrap}>
              <h2>Experience and connect without boundaries</h2>
              <p>
                The ODS app is your all-in-one companion for the day. Follow sessions, find speakers
                and connect with like minds.
              </p>
              <a className={styles.pill} href='#top'>
                Get the ODS App <ArrowIcon />
              </a>
              <div className={styles.phone} aria-hidden='true'>
                <div className={styles.island} />
                <p>
                  Hey Moyo, <span>Good morning</span>
                </p>
                <div className={styles.phoneCard}>
                  <small>Blog</small>
                  <strong>Economic strategies to guarantee survival in today’s economy.</strong>
                  <div>
                    <i />
                    <i />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <SpeakerDialog speaker={selected} onClose={() => setSelected(null)} />
      </div>
      <Footer />
    </>
  );
}

export default Speakers;
