import { useEffect, useRef, useState } from 'react';
import RequestReportModal from '@/components/form/downloadReport';
import Nav from '@/components/local/nav';
import Footer from '@/components/local/footer';

const Reports = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const revealRefs = useRef<(HTMLElement | null)[]>([]);
  const counterRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scroll reveal functionality
    const revealElements = revealRefs.current.filter(Boolean) as HTMLElement[];
    if (reduceMotion) {
      revealElements.forEach((el) => el.classList.add('in'));
    } else if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      revealElements.forEach((el) => io.observe(el));
      return () => io.disconnect();
    } else {
      revealElements.forEach((el) => el.classList.add('in'));
    }
  }, []);

  // Count-up animation
  const animateCount = (el: HTMLElement) => {
    const target = parseInt(el.getAttribute('data-count') || '0', 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      el.textContent = target.toLocaleString() + suffix;
      return;
    }

    // const start = 0;
    const duration = 1400;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString() + suffix;
      }
    };

    requestAnimationFrame(step);
  };

  useEffect(() => {
    const counters = counterRefs.current.filter(Boolean) as HTMLElement[];
    if ('IntersectionObserver' in window) {
      const cio = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target as HTMLElement);
              cio.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach((el) => cio.observe(el));
      return () => cio.disconnect();
    } else {
      counters.forEach(animateCount);
    }
  }, []);

  const setRevealRef = (index: number) => (el: HTMLElement | null) => {
    revealRefs.current[index] = el;
  };

  const setCounterRef = (index: number) => (el: HTMLElement | null) => {
    counterRefs.current[index] = el;
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <>
      <link rel='preconnect' href='https://fonts.googleapis.com' />
      <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
      <link
        href='https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Caveat:wght@600;700&display=swap'
        rel='stylesheet'
      />
      <style>{`
        :root {
          --green: #00A651;
          --green-light: #B9FBC0;
          --purple: #8E44AD;
          --yellow: #F4D35E;
          --blue: #06AED5;
          --navy: #31004A;
          --black: #1B1B1B;
          --coral: #FF5C5C;
          --green-tint20: #CCEDDC;
          --green-tint40: #99DBB9;
          --green-tint80: #33B885;
          --white: #FFFFFF;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: var(--white);
          color: var(--black);
          font-family: 'Sora', sans-serif;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }
        h1, h2, h3 { font-family: 'Sora', sans-serif; font-weight: 700; letter-spacing: -0.01em; }
        .script { font-family: 'Caveat', cursive; font-weight: 700; }
        a { color: inherit; }
        .wrap { max-width: 1180px; margin: 0 auto; padding: 0 32px; position: relative; z-index: 1; }

        .reveal { opacity: 0; transform: translateY(22px); transition: opacity .7s ease, transform .7s ease; }
        .reveal.in { opacity: 1; transform: translateY(0); }
        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1; transform: none; transition: none; }
          * { animation: none !important; }
        }

        .ods-pattern { height: 24px; width: 100%; background-repeat: repeat-x; background-size: 48px 24px; }
        .pattern-on-green {
          background-color: var(--green);
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='24' viewBox='0 0 48 24'%3E%3Cpolygon points='12,1 22,12 12,23 2,12' fill='white'/%3E%3Ccircle cx='36' cy='12' r='9' fill='white'/%3E%3Ccircle cx='36' cy='12' r='4.5' fill='%2300A651'/%3E%3C/svg%3E");
        }
        .pattern-on-white {
          background-color: var(--white);
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='24' viewBox='0 0 48 24'%3E%3Cpolygon points='12,1 22,12 12,23 2,12' fill='%2300A651'/%3E%3Ccircle cx='36' cy='12' r='9' fill='%2300A651'/%3E%3Ccircle cx='36' cy='12' r='4.5' fill='white'/%3E%3C/svg%3E");
        }

        .ticket {
          position: relative;
          clip-path: polygon(0% 10%, 6% 10%, 6% 0%, 94% 0%, 94% 10%, 100% 10%, 100% 90%, 94% 90%, 94% 100%, 6% 100%, 6% 90%, 0% 90%);
        }

        nav { display: flex; align-items: center; justify-content: space-between; max-width: 1180px; margin: 0 auto; padding: 26px 32px; position: relative; z-index: 2; }
        .brand { display: flex; align-items: center; gap: 12px; }
        .dotmap { width: 34px; height: 26px; }
        .brand-word { font-size: 15px; font-weight: 800; color: var(--green); line-height: 1.1; }
        .brand-word span { display: block; font-size: 9.5px; font-weight: 700; letter-spacing: 0.14em; color: var(--black); }
        nav .site-link {
          font-size: 13px; font-weight: 600; color: var(--green);
          border: 1.5px solid var(--green); padding: 9px 18px; border-radius: 100px;
          text-decoration: none; transition: background .18s, color .18s;
        }
        nav .site-link:hover { background: var(--green); color: var(--white); }

        .hero { background: var(--green-tint20); padding: 40px 0 0; overflow: hidden; position: relative; }
        .hero-inner { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 56px; align-items: center; padding-bottom: 64px; position: relative; z-index: 1; }
        .eyebrow {
          display: inline-flex; align-items: center; gap: 9px;
          font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--green); background: var(--white);
          padding: 8px 14px 8px 10px; border-radius: 100px; margin-bottom: 24px;
        }
        .eyebrow .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--coral); }
        .hero h1 { font-size: clamp(38px, 4.8vw, 60px); line-height: 1.06; color: var(--black); max-width: 13.5ch; }
        .hero h1 .script { color: var(--green); font-size: 1.15em; display: inline-block; transform: rotate(-2deg); }
        .hero-sub { margin-top: 22px; font-size: 17px; line-height: 1.65; font-weight: 500; color: #3a3a3a; max-width: 46ch; }
        .cta-row { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; margin-top: 36px; }
        .btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--black); color: var(--white);
          font-family: 'Sora'; font-weight: 700; font-size: 15.5px;
          padding: 16px 26px; border-radius: 10px;
          text-decoration: none; border: none; cursor: pointer;
          transition: transform .16s ease, background .16s ease, box-shadow .16s ease;
        }
        .btn:hover { background: var(--green); transform: translateY(-3px); box-shadow: 0 14px 30px -10px rgba(0,166,81,0.45); }
        .btn svg { width: 17px; height: 17px; }
        .btn .arrow { transition: transform .16s ease; }
        .btn:hover .arrow { transform: translateY(2px); }

        .cover-wrap { display: flex; justify-content: center; position: relative; }
        .cover {
          width: 100%; max-width: 320px; aspect-ratio: 3/4;
          background: var(--green); padding: 30px;
          display: flex; flex-direction: column; justify-content: space-between;
          position: relative; z-index: 1;
          transform: rotate(2.5deg);
          box-shadow: 0 30px 60px -20px rgba(0,80,40,0.35);
          transition: transform .35s ease;
        }
        .cover-wrap:hover .cover { transform: rotate(0deg) translateY(-4px); }
        .cover-tag {
          display: inline-block; font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--black); background: var(--white); padding: 5px 10px; border-radius: 5px; margin-bottom: 16px;
        }
        .cover-title { font-size: 25px; font-weight: 800; color: var(--white); line-height: 1.15; }
        .cover-year { margin-top: 10px; font-size: 13px; font-weight: 600; color: var(--green-light); }
        .cover-bottom { font-size: 11px; font-weight: 600; color: var(--green-light); opacity: 0.85; }

        .stats { background: var(--black); display: grid; grid-template-columns: repeat(4, 1fr); position: relative; }
        .stat { padding: 40px 26px; border-right: 1px solid rgba(255,255,255,0.12); position: relative; transition: background .2s ease; }
        .stat:hover { background: rgba(255,255,255,0.04); }
        .stat:last-child { border-right: none; }
        .stat::before { content: ''; position: absolute; top: 0; left: 0; width: 34px; height: 4px; background: var(--accent, var(--green)); }
        .stat:nth-child(1) { --accent: var(--green-light); }
        .stat:nth-child(2) { --accent: var(--yellow); }
        .stat:nth-child(3) { --accent: var(--blue); }
        .stat:nth-child(4) { --accent: var(--coral); }
        .stat .num { font-size: clamp(30px, 3.2vw, 42px); font-weight: 800; color: var(--white); font-variant-numeric: tabular-nums; }
        .stat .label { margin-top: 8px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.6); line-height: 1.4; }

        .inside { padding: 20px 0 100px; display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 64px; }
        .inside-copy h2 { font-size: clamp(28px, 3vw, 36px); max-width: 12ch; color: var(--black); }
        .inside-copy > p { margin-top: 16px; font-size: 15.5px; line-height: 1.7; color: #4a4a4a; max-width: 44ch; font-weight: 500; }
        .chapter { display: flex; align-items: flex-start; gap: 20px; padding: 22px 0; border-top: 1px solid #e7e7e7; transition: padding-left .2s ease; }
        .chapter:hover { padding-left: 8px; }
        .chapter:last-child { border-bottom: 1px solid #e7e7e7; }
        .chapter .idx {
          font-size: 26px; font-weight: 800;
          -webkit-text-stroke: 1.5px var(--green); color: transparent;
          width: 44px; flex-shrink: 0; transition: color .2s ease;
        }
        .chapter:hover .idx { color: var(--green-tint40); }
        .chapter .body .title { font-size: 15.5px; font-weight: 700; color: var(--black); }
        .chapter .body .desc { margin-top: 3px; font-size: 13.5px; color: #6b6b6b; font-weight: 500; }

        .closing { background: var(--green); padding: 100px 0; text-align: center; position: relative; overflow: hidden; }
        .closing h2 { font-size: clamp(28px, 3.6vw, 42px); color: var(--white); max-width: 17ch; margin: 0 auto 34px; }
        .closing .btn { background: var(--black); }
        .closing .btn:hover { background: var(--white); color: var(--green); }

        footer { background: var(--black); padding: 38px 0; }
        .foot-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.5); }
        .foot-row a { margin-left: 18px; text-decoration: none; color: rgba(255,255,255,0.75); }
        .foot-row a:hover { color: var(--green-light); }

        @media (max-width: 900px) {
          .hero-inner { grid-template-columns: 1fr; gap: 40px; }
          .inside { grid-template-columns: 1fr; gap: 36px; }
          .stats { grid-template-columns: repeat(2, 1fr); }
          .stat { border-bottom: 1px solid rgba(255,255,255,0.12); }
          .stat:nth-child(2) { border-right: none; }
          nav { padding: 20px; }
          .wrap { padding: 0 20px; }
        }

        @media (max-width: 520px) {
          nav { flex-wrap: wrap; gap: 12px; padding: 18px 20px; }
          nav .site-link { font-size: 12px; padding: 8px 14px; }
          .hero { padding-top: 32px; }
          .hero-inner { padding-bottom: 44px; }
          .eyebrow { font-size: 11px; }
          .hero h1 { max-width: none; }
          .cta-row { gap: 16px; }
          .stats { grid-template-columns: 1fr; }
          .stat { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.12); }
          .stat:last-child { border-bottom: none; }
          .chapter { gap: 14px; }
          .chapter .idx { font-size: 22px; width: 34px; }
          .closing { padding: 72px 0; }
        }

        .footer-logo { display: flex; justify-content: center; align-items: center; }

        @media (max-width: 768px) {
          .footer-nav { flex-direction: column !important; gap: 16px !important; }
          .footer-social { flex-direction: column !important; gap: 24px !important; }
        }
      `}</style>

      <Nav />

      <section className='hero'>
        <div className='wrap'>
          <div className='hero-inner'>
            <div ref={setRevealRef(0)} className='reveal'>
              <div className='eyebrow'>
                <span className='dot'></span>IMPACT REPORT · 2025 EDITION
              </div>
              <h1>
                Our 6th edition, and biggest <span className='script'>impact</span> yet.
              </h1>
              <p className='hero-sub'>
                Ogun Digital Summit's 2025 edition in full — who we reached, the startups we
                engaged, and the partnerships built this year for Ogun State's tech ecosystem.
              </p>
              <div className='cta-row'>
                <button className='btn' onClick={handleDownloadClick}>
                  <svg
                    className='arrow'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M12 3v13' />
                    <path d='M6 11l6 6 6-6' />
                    <path d='M4 21h16' />
                  </svg>
                  Download the report
                </button>
              </div>
            </div>
            <div ref={setRevealRef(1)} className='cover-wrap reveal'>
              <div className='cover ticket'>
                <div>
                  <div className='cover-tag'>Impact Report</div>
                  <div className='cover-title'>Ogun Digital Summit Impact Report</div>
                  <div className='cover-year'>2025 Edition</div>
                </div>
                {/* <div className="cover-bottom">Abeokuta, Ogun State · Nigeria</div> */}
              </div>
            </div>
          </div>
        </div>
        <div className='ods-pattern pattern-on-white'></div>
      </section>

      <section className='stats'>
        <div ref={setRevealRef(2)} className='stat reveal'>
          <div ref={setCounterRef(0)} className='num' data-count='12000' data-suffix='+'>
            0
          </div>
          <div className='label'>Participants reached since 2020</div>
        </div>
        <div ref={setRevealRef(3)} className='stat reveal'>
          <div ref={setCounterRef(1)} className='num' data-count='100' data-suffix='+'>
            0
          </div>
          <div className='label'>Startups engaged</div>
        </div>
        <div ref={setRevealRef(4)} className='stat reveal'>
          <div ref={setCounterRef(2)} className='num' data-count='6' data-suffix='x'>
            0
          </div>
          <div className='label'>Growth in the local tech community</div>
        </div>
        <div ref={setRevealRef(5)} className='stat reveal'>
          <div ref={setCounterRef(3)} className='num' data-count='60' data-suffix='+'>
            0
          </div>
          <div className='label'>Speakers and stakeholders</div>
        </div>
      </section>

      <section className='wrap inside'>
        <div ref={setRevealRef(6)} className='inside-copy reveal'>
          <h2>Inside the report</h2>
          <p>
            Five sections covering the 2025 edition in full — built for partners, government
            stakeholders and press who need the complete picture.
          </p>
        </div>
        <div ref={setRevealRef(7)} className='chapters reveal'>
          <div className='chapter'>
            <div className='idx'>01</div>
            <div className='body'>
              <div className='title'>Summit overview</div>
              <div className='desc'>Theme, goals and context for 2025</div>
            </div>
          </div>
          <div className='chapter'>
            <div className='idx'>02</div>
            <div className='body'>
              <div className='title'>Reach &amp; participation</div>
              <div className='desc'>Who attended this year, and from where</div>
            </div>
          </div>
          <div className='chapter'>
            <div className='idx'>03</div>
            <div className='body'>
              <div className='title'>Startups &amp; the local ecosystem</div>
              <div className='desc'>This year's founders, investors and outcomes</div>
            </div>
          </div>
          <div className='chapter'>
            <div className='idx'>04</div>
            <div className='body'>
              <div className='title'>Training &amp; skills outcomes</div>
              <div className='desc'>Tracks, completion, follow-on impact</div>
            </div>
          </div>
          <div className='chapter'>
            <div className='idx'>05</div>
            <div className='body'>
              <div className='title'>Partners &amp; government support</div>
              <div className='desc'>60+ speakers and stakeholders who backed us</div>
            </div>
          </div>
          <div className='chapter'>
            <div className='idx'>06</div>
            <div className='body'>
              <div className='title'>What's next</div>
              <div className='desc'>Priorities for the 2026 edition</div>
            </div>
          </div>
        </div>
      </section>

      <section className='closing'>
        <div ref={setRevealRef(8)} className='wrap reveal'>
          <h2>The 2025 story — full report is one download away.</h2>
          <button className='btn' onClick={handleDownloadClick}>
            <svg
              className='arrow'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M12 3v13' />
              <path d='M6 11l6 6 6-6' />
              <path d='M4 21h16' />
            </svg>
            Download the report
          </button>
        </div>
        <div
          className='ods-pattern pattern-on-green'
          style={{ position: 'absolute', bottom: 0, left: 0 }}
        ></div>
      </section>

      <Footer />
      {isModalOpen && <RequestReportModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default Reports;
