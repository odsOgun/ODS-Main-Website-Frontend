import { useEffect, useId, useRef, useState } from 'react';
import Nav from '@/components/local/nav';
import Footer from '@/components/local/footer';
import { speakersLineup, type Speaker, type SpeakerSessionId } from '@/data/speakers2026';

// Hero background image
const heroBg = '/img/IMG_0919 1 (1).png';

const speakerSections: { id: SpeakerSessionId; title: string; topic?: string }[] = [
  { id: 'keynotes', title: 'Keynote Speakers' },
  {
    id: 'agritech',
    title: 'Fireside Session: Agritech',
    topic: 'Should Nigerians Go Back to Farming? What It Actually Takes to Start Without Capital'
  },
  {
    id: 'creative-economy',
    title: 'Panel Session: Creative Economy',
    topic: 'Monetising Creativity: Turning Passion into Sustainable Income'
  },
  {
    id: 'web3',
    title: 'Panel Session: Emerging Tech (Blockchain & Web3)',
    topic:
      'Beyond the Hype: What Are the Real Opportunities Web3, Blockchain, Stablecoins, and Other Emerging Technologies Are Creating Across Industries?'
  },
  {
    id: 'ai',
    title: 'Panel Session: Emerging Tech (AI)',
    topic: 'Building AI That Actually Works for Africa'
  },
  {
    id: 'policy-governance',
    title: 'Panel Session: Policy & Governance',
    topic: 'Government, Policy and Regulations: Impact on the Growth of Our Digital Economy'
  },
  {
    id: 'startup-investment',
    title: 'Panel Session: Startup & Investment',
    topic: 'Beyond Funding: What Investors Really Look for in African Founders'
  }
];

// Past Speakers from public/img
const pastSpeakers = [
  {
    name: 'Olubunmi Fabanwo',
    role: 'Afriex Program Manager',
    image: '/img/Frame 173.png'
  },
  {
    name: 'Harrison Obiefule',
    role: 'Co-Host / SomewhereinG...',
    image: '/img/Frame 174.png'
  },
  {
    name: 'Odunayo Eweniyi',
    role: 'Co-Founder, Piggyvest',
    image: '/img/Frame 175.png'
  },
  {
    name: 'Yosola Adekanmbi',
    role: 'Former Media Exec, Access inc',
    image: '/img/Frame 176.png'
  },
  {
    name: 'Joshua Chibueze',
    role: 'Co-founder, Piggyvest',
    image: '/img/Frame 177.png'
  }
];

// Green Pixel / Stepped Accents for Hero Bottom
const GreenPixelAccentsLeft = () => (
  <svg width='48' height='48' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <rect x='0' y='0' width='16' height='16' fill='#00A651' />
    <rect x='16' y='0' width='16' height='16' fill='#00A651' />
    <rect x='0' y='16' width='16' height='16' fill='#00A651' />
    <rect x='32' y='16' width='16' height='16' fill='#00A651' />
  </svg>
);

const GreenPixelAccentsRight = () => (
  <svg width='48' height='48' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <rect x='16' y='0' width='16' height='16' fill='#00A651' />
    <rect x='32' y='0' width='16' height='16' fill='#00A651' />
    <rect x='32' y='16' width='16' height='16' fill='#00A651' />
    <rect x='0' y='16' width='16' height='16' fill='#00A651' />
  </svg>
);

// Black Stepped Pixel Accents for White Mobile Section bottom
const BlackSteppedLeft = () => (
  <svg width='60' height='40' viewBox='0 0 60 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <rect x='0' y='0' width='20' height='20' fill='#101611' />
    <rect x='0' y='20' width='40' height='20' fill='#101611' />
    <rect x='40' y='20' width='20' height='20' fill='#101611' />
  </svg>
);

const BlackSteppedRight = () => (
  <svg width='60' height='40' viewBox='0 0 60 40' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <rect x='40' y='0' width='20' height='20' fill='#101611' />
    <rect x='20' y='20' width='40' height='20' fill='#101611' />
    <rect x='0' y='20' width='20' height='20' fill='#101611' />
  </svg>
);

// Play Store Icon
const PlayStoreIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
    <path d='M3.609 1.814L13.792 12 3.61 22.186a2.22 2.22 0 0 1-.61-.924V2.738c.175-.36.386-.677.61-.924zm11.24 11.242l2.366-2.366-2.366-2.367-1.057 1.057 1.057 3.676zm1.472-4.108L18.4 10.15c.8.46.8 1.237 0 1.698l-2.079 1.202-1.745-1.745 1.745-2.357zM4.697 1.189l9.095 9.095-2.735 2.735-8.497-8.497c.46-.388 1.272-.751 2.137-3.333z' />
  </svg>
);

// Apple Icon
const AppleIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
    <path d='M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.98.6-2.62 1.35-.57.65-1.06 1.72-.93 2.74 1 .08 2-.49 2.62-1.24' />
  </svg>
);

export default function Speakers() {
  const tickerText = 'Nov 25, 2026 • June 12 Cultural Centre, Kuto, Abeokuta Ogun state ';
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const bioDialogRef = useRef<HTMLDialogElement>(null);
  const bioTitleId = useId();

  useEffect(() => {
    if (selectedSpeaker) {
      bioDialogRef.current?.showModal();
    }
  }, [selectedSpeaker]);

  return (
    <div className='min-h-screen bg-[#FBF9F1] text-[#181818] flex flex-col font-sans selection:bg-[#00A651] selection:text-white'>
      {/* Self-contained CSS for ticker animation */}
      <style>{`
        @keyframes odsMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .ods-marquee-track {
          display: flex;
          width: max-content;
          animation: odsMarquee 35s linear infinite;
        }
        .ods-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* ============================================================== */}
      {/* 1. HERO SECTION                                                */}
      {/* ============================================================== */}
      <section className='relative w-full bg-[#0A100C] text-white overflow-hidden'>
        {/* Stage photo background from public/img */}
        <div
          className='absolute inset-0 bg-cover bg-center bg-no-repeat opacity-45 transform scale-105'
          style={{ backgroundImage: `url("${heroBg}")` }}
        />

        {/* Dark atmospheric gradient overlay */}
        <div className='absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/90 pointer-events-none' />

        {/* Global Navigation - Kept intact as requested */}
        <div className='relative z-30 w-full'>
          <div className='container max-w-[1120px] mx-auto px-4 pt-2'>
            <Nav />
          </div>
        </div>

        {/* Hero Main Content */}
        <div className='relative z-20 max-w-[1000px] mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28 text-center flex flex-col items-center'>
          {/* Badge */}
          {/* <div className='inline-block px-3 py-1 mb-6 rounded text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-[#00A651]'>
            [ SPEAKERS // OGUN DIGITAL SUMMIT 2026 ]
          </div> */}

          {/* Headline */}
          <h1 className='platypi-gf italic font-normal text-white text-3xl sm:text-5xl md:text-6xl lg:text-[68px] leading-[1.12] tracking-tight max-w-[850px] mx-auto mb-8'>
            The Voices Shaping <br className='hidden sm:inline' />
            Africa’s Digital Future
          </h1>

          {/* CTA Button */}
          <a
            href='#meet-speakers'
            className='inline-flex items-center justify-center px-7 py-3 rounded-full bg-white text-[#181818] text-sm md:text-base font-semibold hover:bg-neutral-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] cursor-pointer'
          >
            Meet our Speakers
          </a>
        </div>

        {/* Marquee / Ticker Strip with green accents */}
        <div className='relative z-20 w-full bg-[#080B09] border-t border-b border-white/10 py-3 overflow-hidden'>
          {/* Corner Pixel Accents on sides */}
          <div className='absolute left-2 top-0 bottom-0 z-30 flex items-center pointer-events-none opacity-80'>
            <GreenPixelAccentsLeft />
          </div>
          <div className='absolute right-2 top-0 bottom-0 z-30 flex items-center pointer-events-none opacity-80'>
            <GreenPixelAccentsRight />
          </div>

          <div className='flex items-center w-full overflow-hidden'>
            <div className='ods-marquee-track'>
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className='flex items-center mx-4 text-xs md:text-sm font-normal text-white/90 tracking-wide whitespace-nowrap'
                >
                  <span>{tickerText}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. MEET OUR SPEAKERS SECTION                                   */}
      {/* ============================================================== */}
      <section
        id='meet-speakers'
        aria-labelledby='meet-speakers-heading'
        className='relative w-full overflow-hidden bg-[#F7F9F2] px-4 py-16 text-[#181818] sm:px-6 md:py-20 lg:px-8'
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(23, 138, 45, 0.24) 1.5px, transparent 2px), repeating-linear-gradient(135deg, transparent 0 38px, rgba(23, 138, 45, 0.09) 38px 40px, transparent 40px 78px), linear-gradient(to right, rgba(23, 138, 45, 0.1) 1px, transparent 1px)',
          backgroundSize: '22px 22px, 110px 110px, 160px 100%'
        }}
      >
        <div className='mx-auto max-w-[1100px]'>
          {/* Header */}
          <div className='mx-auto mb-10 max-w-2xl text-center md:mb-12'>
            <p className='mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#178A2D] md:text-sm'>
              ODS 2026 SPEAKERS LINEUP
            </p>
            <h2
              id='meet-speakers-heading'
              className='platypi-gf text-3xl font-normal tracking-tight text-[#181818] sm:text-4xl md:text-5xl'
            >
              Meet our Speakers
            </h2>
            <p className='mt-3 text-sm font-normal text-[#627587] md:text-base'>
              We're bringing together a remarkable group of bold innovators and doers from across
              Africa.
            </p>
          </div>

          <div className='space-y-12 md:space-y-16'>
            {speakerSections.map((section) => {
              const sectionSpeakers = speakersLineup
                .filter((speaker) => speaker.session === section.id)
                .sort((a, b) => a.sessionOrder - b.sessionOrder);

              return (
                <section key={section.id} aria-labelledby={`speaker-section-${section.id}`}>
                  <header className='mx-auto mb-6 max-w-3xl text-center md:mb-8'>
                    <h3
                      id={`speaker-section-${section.id}`}
                      className='platypi-gf text-2xl font-normal tracking-tight text-[#181818] sm:text-3xl md:text-4xl'
                    >
                      {section.title}
                    </h3>
                    {section.topic && (
                      <p className='mt-3 text-sm font-medium leading-6 text-[#627587] md:text-base'>
                        {section.topic}
                      </p>
                    )}
                  </header>

                  <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5'>
                    {sectionSpeakers.map((speaker) => (
                      <article key={speaker.name} className='group'>
                        <div className='relative aspect-[3/4] w-full overflow-hidden border-[3px] border-[#101611] bg-[#101611] shadow-[6px_6px_0_#101611] transition-transform duration-300 group-hover:-translate-y-1'>
                          {speaker.image ? (
                            <img
                              src={speaker.image}
                              alt={speaker.name}
                              className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]'
                              loading='lazy'
                            />
                          ) : (
                            <div
                              role='img'
                              aria-label={`Photo not provided for ${speaker.name}`}
                              className='flex h-full items-center justify-center bg-[#182019] text-5xl font-semibold text-white/70'
                            >
                              {speaker.name
                                .split(/\s+/)
                                .map((part) => part.charAt(0))
                                .slice(0, 2)
                                .join('')}
                            </div>
                          )}

                          <div className='absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#060714]/95 via-[#060714]/70 to-transparent p-4 sm:p-5'>
                            {speaker.bio && (
                              <button
                                type='button'
                                onClick={() => setSelectedSpeaker(speaker)}
                                className='mt-2 w-fit border-2 border-white bg-white px-3 py-1.5 text-xs font-semibold text-[#101611] transition-colors hover:bg-[#D8F3DC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:mt-3 sm:px-4 sm:py-2 sm:text-sm'
                              >
                                View bio
                              </button>
                            )}
                          </div>
                        </div>
                        <div className='pt-3 text-center'>
                          <h4 className='text-sm font-bold leading-tight text-[#181818] sm:text-base'>
                            {speaker.name}
                          </h4>
                          {speaker.role && (
                            <p className='mt-1 line-clamp-2 text-xs leading-4 text-[#627587] sm:text-sm sm:leading-5'>
                              {speaker.role}
                            </p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        <dialog
          ref={bioDialogRef}
          aria-labelledby={selectedSpeaker ? bioTitleId : undefined}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault();
              bioDialogRef.current?.close();
            }
          }}
          onCancel={(event) => {
            event.preventDefault();
            bioDialogRef.current?.close();
          }}
          onClose={() => setSelectedSpeaker(null)}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              bioDialogRef.current?.close();
            }
          }}
          className='m-auto max-h-[90vh] w-[95vw] max-w-[920px] overflow-hidden border-0 bg-transparent p-0 text-[#181818] backdrop:bg-black/75'
        >
          {selectedSpeaker && (
            <div className='grid max-h-[90vh] overflow-hidden bg-[#FBF9F1] shadow-2xl md:grid-cols-2'>
              <div className='relative h-52 bg-[#101611] md:h-auto md:min-h-[560px]'>
                <img src={selectedSpeaker.image} alt='' className='h-full w-full object-cover' />
              </div>
              <div className='relative flex max-h-[90vh] min-h-0 flex-col'>
                <button
                  type='button'
                  autoFocus
                  onClick={() => bioDialogRef.current?.close()}
                  aria-label='Close biography'
                  className='absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center bg-[#101611] text-2xl text-white transition-colors hover:bg-[#178A2D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#178A2D]'
                >
                  &times;
                </button>
                <div className='min-h-0 overflow-y-auto p-6 pt-16 md:p-8 md:pt-16'>
                  <p className='mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#178A2D]'>
                    {selectedSpeaker.role}
                  </p>
                  <h2
                    id={bioTitleId}
                    className='platypi-gf text-2xl font-semibold leading-tight text-[#181818] md:text-3xl'
                  >
                    {selectedSpeaker.name}
                  </h2>
                  <p className='mt-5 whitespace-pre-line text-sm leading-7 text-[#46545E] md:text-base'>
                    {selectedSpeaker.bio}
                  </p>
                </div>
              </div>
            </div>
          )}
        </dialog>
      </section>

      {/* ============================================================== */}
      {/* 3. PAST SPEAKERS SECTION                                       */}
      {/* ============================================================== */}
      <section className='relative w-full bg-[#101611] text-white pt-20 pb-24 md:pt-24 md:pb-28 px-4 sm:px-6 lg:px-8 border-t border-white/5'>
        <div className='max-w-[1200px] mx-auto'>
          {/* Section Heading & Intro */}
          <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-12 mb-12 md:mb-16'>
            <div>
              <p className='text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-[#00A651] mb-2'>
                [ SPEAKERS IN THE LAST 4 YEARS ]
              </p>
              <h2 className='platypi-gf font-normal text-3xl sm:text-4xl md:text-5xl text-white tracking-tight'>
                Past Speakers
              </h2>
            </div>
            <div className='max-w-md'>
              <p className='text-sm md:text-base text-[#9CA3AF] leading-relaxed'>
                It all started with a dream in 2019 to bring together startup entrepreneurs,
                talents, creatives and founders with a strong focus to promote youth empowerment,
                tech entrepreneurship and social innovation.
              </p>
            </div>
          </div>

          {/* Past Speakers Grid */}
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 md:gap-6'>
            {pastSpeakers.map((speaker, index) => (
              <div key={index} className='group flex flex-col'>
                <div className='relative w-full aspect-square rounded-lg overflow-hidden bg-[#182019] mb-3 border border-white/5 shadow-sm'>
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className='w-full h-full object-cover grayscale transition-transform duration-300 group-hover:scale-105'
                    loading='lazy'
                  />
                </div>
                <h3 className='text-white font-semibold text-sm md:text-[15px] leading-snug'>
                  {speaker.name}
                </h3>
                <p className='text-[#8B949E] text-xs md:text-[13px] mt-1 leading-snug'>
                  {speaker.role}
                </p>
              </div>
            ))}
          </div>
          <div className='mt-10 flex justify-center'>
            <a
              href='/past-speaker'
              className='flex items-center justify-center  px-7 py-3 rounded-full bg-white text-[#181818] text-sm md:text-base font-semibold hover:bg-neutral-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] cursor-pointer'
            >
              See All Past Speakers
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. MINT GREEN DIAGONAL STRIPED DIVIDER                         */}
      {/* ============================================================== */}
      <div
        className='w-full h-8 md:h-10'
        style={{
          backgroundColor: '#86EFAC',
          backgroundImage:
            'repeating-linear-gradient(45deg, #86EFAC, #86EFAC 14px, #BBF7D0 14px, #BBF7D0 28px)'
        }}
      />

      {/* ============================================================== */}
      {/* 5. MOBILE APP SECTION                                          */}
      {/* ============================================================== */}
      <section className='relative w-full bg-white text-[#111827] pt-16 md:pt-24 pb-0 overflow-hidden'>
        <div className='max-w-[900px] mx-auto px-4 text-center'>
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#111827]'>
            Experience, connect without boudaries
          </h2>
          <p className='text-sm md:text-base text-[#4B5563] mt-3 max-w-lg mx-auto leading-relaxed'>
            Mobile App is your all-in-one tool for an immersive tech experience at your fingertip.
            Connect with like minds like never before
          </p>

          {/* Store Buttons */}
          <div className='flex justify-center mt-6'>
            <a
              href='https://tix.africa/discover/ods2026'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-black bg-white text-black hover:bg-black hover:text-white transition-all duration-300 text-sm font-semibold shadow-sm group'
            >
              <PlayStoreIcon className='w-4 h-4' />
              <AppleIcon className='w-4 h-4' />
              <span>Get the ODS App</span>
              <span className='transition-transform duration-300 group-hover:translate-x-1'>
                &rarr;
              </span>
            </a>
          </div>

          {/* iPhone 16 Pro Mockup Protruding into dark footer */}
          <div className='mt-10 -mb-6 md:-mb-10 flex justify-center'>
            <img
              src='/img/iPhone 16 Pro - 1.png'
              alt='ODS Mobile App on iPhone 16 Pro'
              className='w-full max-w-[320px] sm:max-w-[360px] md:max-w-[420px] drop-shadow-2xl relative z-10'
              loading='lazy'
            />
          </div>
        </div>

        {/* Stepped Pixel Graphic Transition to Footer */}
        <div className='relative w-full h-10 md:h-12 bg-transparent flex justify-between items-end pointer-events-none'>
          <BlackSteppedLeft />
          <div className='flex-1' />
          <BlackSteppedRight />
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. FOOTER - Kept intact as requested                           */}
      {/* ============================================================== */}
      <Footer />
    </div>
  );
}
