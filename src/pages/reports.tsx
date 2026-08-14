import { useEffect, useRef, useState } from 'react';
import RequestReportModal from '@/components/form/downloadReport';
import Nav from '@/components/local/nav';
import Footer from '@/components/local/footer';
import '@/styles/reports.css';

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

      <Nav />

      <section
        className='bg-ods-green-tint20 pt-10 overflow-hidden relative'
        style={{
          backgroundImage: 'url(/src/assets/img/about-two.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark overlay */}
        <div className='absolute inset-0 bg-black/60 z-0'></div>

        <div className='max-w-[1180px] mx-auto px-8 relative z-10'>
          <div className=' max-w-[640px] items-center pb-16 relative z-10 max-[900px]:grid-cols-1 max-[900px]:gap-10 max-[520px]:pb-11'>
            <div ref={setRevealRef(0)} className='reveal'>
              <div className='inline-flex items-center gap-2 text-xs font-bold tracking-widest text-ods-green bg-white px-3 py-2 rounded-full mb-6'>
                ODS impact report
              </div>
              <h1 className='text-[clamp(38px,4.8vw,60px)] leading-[1.06] text-white  font-bold tracking-tight'>
                Six editions. Growing{' '}
                <span
                  className='script text-ods-green-light text-[1.15em] inline-block'
                  style={{ transform: 'rotate(-2deg)' }}
                >
                  impact.
                </span>
              </h1>
              <p className='mt-6 text-base font-medium leading-relaxed text-white/90 '>
                From connecting talent and founders to building partnerships, supporting startups
                and expanding access to digital opportunities, Ogun Digital Summit has spent six
                editions helping shape Ogun State’s technology ecosystem. <br />
                <br /> Explore the journey, the people reached, the startups engaged, the
                partnerships built, and the impact we’ve created in the last six years.
              </p>
              <div className='flex items-center gap-5 flex-wrap mt-9'>
                <button
                  className='inline-flex items-center gap-2 hover:bg-ods-black text-white font-bold text-[15px] px-6 py-4 rounded-[10px] transition-all duration-200 bg-ods-green hover:shadow-[0_14px_30px_-10px_rgba(0,166,81,0.45)] hover:translate-y-[-3px]'
                  onClick={handleDownloadClick}
                >
                  <svg
                    className='arrow w-[17px] h-[17px] transition-transform duration-200'
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
          </div>
        </div>
        <div className='pattern-on-white'></div>
      </section>

      <section className='bg-ods-black grid grid-cols-4 relative max-[900px]:grid-cols-2 max-[520px]:grid-cols-1'>
        <div
          ref={setRevealRef(2)}
          className='stat reveal px-6 py-10 border-r border-white/12 relative transition-all duration-200 hover:bg-white/4 last:border-r-0'
        >
          <div
            ref={setCounterRef(0)}
            className='num text-[clamp(30px,3.2vw,42px)] font-black text-white tabular-nums'
            data-count='12000'
            data-suffix='+'
          >
            0
          </div>
          <div className='label mt-2 text-xs font-medium text-white/60 leading-relaxed'>
            Participants reached since 2020
          </div>
        </div>
        <div
          ref={setRevealRef(3)}
          className='stat reveal px-6 py-10 border-r border-white/12 relative transition-all duration-200 hover:bg-white/4 max-[900px]:border-b max-[900px]:border-r-0 max-[900px]:nth-child(2):border-r-0'
        >
          <div
            ref={setCounterRef(1)}
            className='num text-[clamp(30px,3.2vw,42px)] font-black text-white tabular-nums'
            data-count='100'
            data-suffix='+'
          >
            0
          </div>
          <div className='label mt-2 text-xs font-medium text-white/60 leading-relaxed'>
            Startups engaged
          </div>
        </div>
        <div
          ref={setRevealRef(4)}
          className='stat reveal px-6 py-10 border-r border-white/12 relative transition-all duration-200 hover:bg-white/4'
        >
          <div
            ref={setCounterRef(2)}
            className='num text-[clamp(30px,3.2vw,42px)] font-black text-white tabular-nums'
            data-count='6'
            data-suffix='x'
          >
            0
          </div>
          <div className='label mt-2 text-xs font-medium text-white/60 leading-relaxed'>
            Growth in the local tech community
          </div>
        </div>
        <div
          ref={setRevealRef(5)}
          className='stat reveal px-6 py-10 border-r border-white/12 relative transition-all duration-200 hover:bg-white/4 last:border-r-0 max-[520px]:border-r-0'
        >
          <div
            ref={setCounterRef(3)}
            className='num text-[clamp(30px,3.2vw,42px)] font-black text-white tabular-nums'
            data-count='60'
            data-suffix='+'
          >
            0
          </div>
          <div className='label mt-2 text-xs font-medium text-white/60 leading-relaxed'>
            Speakers and stakeholders
          </div>
        </div>
      </section>

      <section className='max-w-[1180px] mx-auto px-8 py-5 grid grid-cols-[0.9fr_1.1fr] gap-16 max-[900px]:grid-cols-1 max-[900px]:gap-9'>
        <div ref={setRevealRef(6)} className='inside-copy reveal pt-5'>
          <h2 className='text-[clamp(28px,3vw,36px)] max-w-[12ch] text-ods-black font-bold tracking-tight'>
            Inside the report
          </h2>
          <p className='mt-4 text-base leading-relaxed text-[#4a4a4a] max-w-[44ch] font-medium'>
            It covers the six editions of Ogun Digital Summit from 2020 - 2025, the journey, people,
            startups, partnerships, and impact behind the platform. The impact report was designed
            for partners, government stakeholders, investors, ecosystem leaders, and the press who
            need the complete picture.
          </p>
        </div>
        <div ref={setRevealRef(7)} className='chapters reveal space-y-0'>
          <div className='chapter flex items-start gap-5 px-0 py-5 border-t border-[#e7e7e7] transition-all duration-200 hover:pl-2 last:border-b last:border-[#e7e7e7] max-[520px]:gap-3'>
            <div
              className='idx text-2xl font-black'
              style={{
                WebkitTextStroke: '1px #00A651',
                color: 'transparent',
                width: '44px',
                flexShrink: 0
              }}
            >
              01
            </div>
            <div className='body'>
              <div className='title text-base font-bold text-ods-black'>Summit overview</div>
              <div className='desc mt-1 text-sm text-[#6b6b6b] font-medium'>
                Ogun Digital Summit began in 2020 with a mission to strengthen Ogun State's
                technology ecosystem by connecting talent, entrepreneurs, investors, government, and
                ecosystem players.
                <br />
                <br />
                Across six editions, ODS has grown into a platform for learning, collaboration,
                innovation, and digital opportunities. The 2025 edition expanded this focus across
                AI, Web3, Agritech, Creative Economy, Future of Work, Startup Investment, and Policy
                & Governance.
              </div>
            </div>
          </div>
          <div className='chapter flex items-start gap-5 px-0 py-5 border-t border-[#e7e7e7] transition-all duration-200 hover:pl-2 last:border-b last:border-[#e7e7e7] max-[520px]:gap-3'>
            <div
              className='idx text-2xl font-black'
              style={{
                WebkitTextStroke: '1px #00A651',
                color: 'transparent',
                width: '44px',
                flexShrink: 0
              }}
            >
              02
            </div>
            <div className='body'>
              <div className='title text-base font-bold text-ods-black'>
                Reach &amp; participation
              </div>
              <div className='desc mt-1 text-sm text-[#6b6b6b] font-medium'>
                Across six editions, ODS has continued to grow its community and reach, engaging
                10,000+ people through its programmes and ecosystem activities. The 2025 edition
                recorded 3,500 registered attendees and 2,500+ physical attendees, alongside 534+
                virtual participants. <br />
                <br />
                The 2025 edition also generated 3.2M+ social media impressions, bringing together
                founders, professionals, creatives, investors, students, and ecosystem stakeholders.
              </div>
            </div>
          </div>
          <div className='chapter flex items-start gap-5 px-0 py-5 border-t border-[#e7e7e7] transition-all duration-200 hover:pl-2 last:border-b last:border-[#e7e7e7] max-[520px]:gap-3'>
            <div
              className='idx text-2xl font-black'
              style={{
                WebkitTextStroke: '1px #00A651',
                color: 'transparent',
                width: '44px',
                flexShrink: 0
              }}
            >
              03
            </div>
            <div className='body'>
              <div className='title text-base font-bold text-ods-black'>
                Startups &amp; the local ecosystem
              </div>
              <div className='desc mt-1 text-sm text-[#6b6b6b] font-medium'>
                Across its editions, ODS has created a platform for 20+ startups to showcase their
                solutions, connect with investors, and gain visibility within the ecosystem. <br />
                <br />
                In 2025, 10 startups were showcased, giving founders opportunities for product
                validation, customer feedback, mentorship, and investor exposure. The summit
                continues to help connect Ogun's emerging founders to the networks and opportunities
                they need to build and scale.
              </div>
            </div>
          </div>
          <div className='chapter flex items-start gap-5 px-0 py-5 border-t border-[#e7e7e7] transition-all duration-200 hover:pl-2 last:border-b last:border-[#e7e7e7] max-[520px]:gap-3'>
            <div
              className='idx text-2xl font-black'
              style={{
                WebkitTextStroke: '1px #00A651',
                color: 'transparent',
                width: '44px',
                flexShrink: 0
              }}
            >
              04
            </div>
            <div className='body'>
              <div className='title text-base font-bold text-ods-black'>
                Training &amp; skills outcomes
              </div>
              <div className='desc mt-1 text-sm text-[#6b6b6b] font-medium'>
                Since its launch, ODS has inspired 10,000+ people to explore technology careers
                through learning, mentorship, and ecosystem opportunities. <br />
                <br />
                Across the six editions, conversations and learning have evolved alongside the
                digital economy, with the 2025 edition covering AI, Web3, Agritech, Creative
                Economy, Future of Work, Investment and Policy. ODS has also extended its impact
                beyond the summit through initiatives such as solar-powered ICT stations supporting
                digital learning in local communities.
              </div>
            </div>
          </div>
          <div className='chapter flex items-start gap-5 px-0 py-5 border-t border-[#e7e7e7] transition-all duration-200 hover:pl-2 last:border-b last:border-[#e7e7e7] max-[520px]:gap-3'>
            <div
              className='idx text-2xl font-black'
              style={{
                WebkitTextStroke: '1px #00A651',
                color: 'transparent',
                width: '44px',
                flexShrink: 0
              }}
            >
              05
            </div>
            <div className='body'>
              <div className='title text-base font-bold text-ods-black'>
                Partners &amp; government support
              </div>
              <div className='desc mt-1 text-sm text-[#6b6b6b] font-medium'>
                Over six editions, ODS has brought together government, private-sector
                organisations, investors, sponsors, speakers and ecosystem leaders around a shared
                vision for digital growth.
                <br />
                <br />
                In 2025 alone, the summit featured 27 speakers, 5 investors, 12 sponsors and 10
                exhibitors, alongside government and ecosystem stakeholders.
              </div>
            </div>
          </div>
          <div className='chapter flex items-start gap-5 px-0 py-5 border-t border-[#e7e7e7] transition-all duration-200 hover:pl-2 last:border-b last:border-[#e7e7e7] max-[520px]:gap-3'>
            <div
              className='idx text-2xl font-black'
              style={{
                WebkitTextStroke: '1px #00A651',
                color: 'transparent',
                width: '44px',
                flexShrink: 0
              }}
            >
              06
            </div>
            <div className='body'>
              <div className='title text-base font-bold text-ods-black'>What's next</div>
              <div className='desc mt-1 text-sm text-[#6b6b6b] font-medium'>
                Six editions have shown that Ogun State has the talent and innovation potential to
                build a stronger digital economy, but founders need greater access to funding,
                networks, infrastructure and support. <br />
                <br />
                The next chapter is about strengthening innovation hubs, retaining local talent,
                deepening collaboration between startups and government, and creating stronger
                pathways to investment.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='bg-ods-green py-20 text-center relative overflow-hidden max-[520px]:py-18'>
        <div ref={setRevealRef(8)} className='reveal max-w-[1180px] mx-auto px-8 relative z-10'>
          <h2 className='text-[clamp(28px,3.6vw,42px)] text-white max-w-[17ch] mx-auto mb-8 font-bold tracking-tight'>
            The ODS impact report is one download away.
          </h2>
          <button
            className='inline-flex items-center gap-2 bg-ods-black text-white font-bold text-[15px] px-6 py-4 rounded-[10px] transition-all duration-200 hover:bg-white hover:text-ods-green'
            onClick={handleDownloadClick}
          >
            <svg
              className='arrow w-[17px] h-[17px] transition-transform duration-200'
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
        <div className='pattern-on-green absolute bottom-0 left-0 z-0'></div>
      </section>

      <Footer />
      {isModalOpen && <RequestReportModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default Reports;
