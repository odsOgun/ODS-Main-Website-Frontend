import { useState } from 'react';
import Nav from '@/components/local/nav';
import Footer from '@/components/local/footer';
import RocketSvg from '@/assets/svgs/rocket.svg';
import ArtBg from '@/assets/img/readme/artBg.png';
import HackathonRegistration from './register/hackathon';
import { Network } from 'lucide-react';

const SparkleStar = ({ className = 'w-4 h-4 text-[#FF7B72]' }: { className?: string }) => (
  <svg viewBox='0 0 24 24' fill='currentColor' className={className} aria-hidden='true'>
    <path d='M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z' />
  </svg>
);

export default function Hackathon() {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegisterClick = () => {
    setIsRegistering(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isRegistering) {
    return (
      <div className='animate-in fade-in duration-300 ease-out'>
        <HackathonRegistration onBack={() => setIsRegistering(false)} />
      </div>
    );
  }

  const tracks = [
    {
      title: 'Edtech',
      desc: 'Platforms improving access to quality education and skills development across Africa.',
      icon: (
        <svg
          className='w-8 h-8 text-[#B88714]'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <polygon points='12 3 2 8 12 13 22 8 12 3' />
          <path d='M5 10.5v5.5c0 2 3.1 4 7 4s7-2 7-4v-5.5' />
          <path d='M2 8.5v6' />
          <circle cx='2' cy='14.5' r='0.5' fill='currentColor' />
        </svg>
      )
    },
    {
      title: 'Fintech',
      desc: 'Solutions expanding access to banking, payments, and credit for the underserved.',
      icon: (
        <svg
          className='w-8 h-8 text-[#B88714]'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <rect x='2' y='6' width='20' height='12' rx='2' />
          <circle cx='12' cy='12' r='2.5' />
          <line x1='5' y1='9' x2='5' y2='15' />
          <line x1='19' y1='9' x2='19' y2='15' />
        </svg>
      )
    },
    {
      title: 'Proptech & Real Estate',
      desc: 'Technology transforming property ownership, housing access, and real estate.',
      icon: (
        <svg
          className='w-8 h-8 text-[#B88714]'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M3 9.5L12 4l9 5.5V20H3V9.5z' />
          <rect x='8' y='12' width='8' height='8' />
          <line x1='8' y1='16' x2='16' y2='16' />
        </svg>
      )
    },
    {
      title: 'Healthtech & Telemedicine',
      desc: 'Platforms improving healthcare delivery, remote diagnosis, and wellness access.',
      icon: (
        <svg
          className='w-8 h-8 text-[#B88714]'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M3 9.5L12 4l9 5.5V20H3V9.5z' />
          <rect x='8' y='12' width='8' height='8' />
          <line x1='8' y1='16' x2='16' y2='16' />
        </svg>
      )
    },
    {
      title: 'Agrictech & Food Security',
      desc: 'Innovations in farming, food supply chains, and food security across Africa.',
      icon: (
        <svg
          className='w-8 h-8 text-[#B88714]'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M6.5 13.5C5 9.5 7.5 6 11 6c.5 4-1 6.5-4.5 7.5z' />
          <path d='M17.5 13.5C19 9.5 16.5 6 13 6c-.5 4 1 6.5 4.5 7.5z' />
          <path d='M12 13v7' />
        </svg>
      )
    },
    {
      title: 'AI / Machine Learning',
      desc: 'Products powered by AI that solve real-world African challenges at scale.',
      icon: (
        <svg
          className='w-8 h-8 text-[#B88714]'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M16 21v-2a4 4 0 0 0-2-3.5 5 5 0 0 1-2.5-4.3 5.5 5.5 0 1 1 8.5-4.6c.5 1.5.3 3.5-.8 4.8' />
          <circle cx='15' cy='8' r='1.5' fill='currentColor' />
          <path d='M15 9.5v2.5' />
          <circle cx='17' cy='12' r='1' fill='currentColor' />
        </svg>
      )
    }
  ];

  return (
    <div className='min-h-screen bg-white text-[#101828] flex flex-col font-sans selection:bg-[#B9FBC0] selection:text-[#101828]'>
      {/* Existing Navbar - unchanged */}
      <Nav />

      <main className='flex-1'>
        {/* ================= HERO SECTION ================= */}
        <section className='relative overflow-hidden pt-8 md:pt-14 pb-12 lg:pb-16 bg-white'>
          {/* Background geometric pattern watermark */}
          <div
            className='pointer-events-none absolute inset-0 opacity-[0.035] -z-10'
            style={{
              backgroundImage: `url(${ArtBg})`,
              backgroundRepeat: 'repeat',
              backgroundSize: '340px'
            }}
          />

          {/* Subtle radiant mint ambient gradient in background */}
          <div
            className='pointer-events-none absolute right-0 top-0 w-[620px] h-[620px] rounded-full blur-3xl opacity-40 -z-10'
            style={{
              background:
                'radial-gradient(circle at 75% 30%, rgba(167,243,208,0.85) 0%, rgba(255,255,255,0) 68%)'
            }}
          />

          <div className='max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center'>
              {/* Left Column */}
              <div className='lg:col-span-7 flex flex-col items-start z-10'>
                {/* Badge */}
                <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3F4F6] text-[#344054] text-[12.5px] font-normal border border-[#E5E7EB] mb-5 shadow-2xs'>
                  <img src={RocketSvg} alt='Rocket' className='w-4 h-4' />
                  <span className='italic font-medium'>
                    Technology, Innovation and Progress in motion
                  </span>
                </div>

                {/* Main Heading */}
                <h1 className='platypi-gf italic text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold leading-[1.14] tracking-tight mb-4'>
                  <span className='text-[#101828]'>Build </span>
                  <span className='text-[#00A651]'>real-world solutions</span>
                  <br />
                  <span className='text-[#101828]'>for Ogun State and beyond.</span>
                </h1>

                {/* Subtitle */}
                <p className='text-[#475467] text-sm sm:text-[15.5px] leading-relaxed max-w-[540px] mb-7 font-normal'>
                  A hackathon bringing developers, designers, product thinkers, data specialists,
                  founders and domain experts together to move from a clearly defined problem to a
                  working prototype, with mentors and an independent judging panel.
                </p>

                {/* CTA Button */}
                <div className='mb-9'>
                  <button
                    onClick={handleRegisterClick}
                    className='inline-flex items-center gap-2.5 bg-[#009E49] hover:bg-[#00873E] text-white font-medium text-sm px-6 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md cursor-pointer group'
                  >
                    <span>Register your team</span>
                    <span className='text-[11px] transition-transform group-hover:translate-y-0.5'>
                      ▼
                    </span>
                  </button>
                </div>

                {/* Stats Card (Coral Red with subtle pattern) */}
                <div className='relative w-full max-w-xl lg:max-w-none lg:w-[122%] xl:w-[128%] bg-[#DF554B] text-white rounded-2xl shadow-xl p-5 sm:p-6 sm:py-6 sm:px-7 overflow-hidden z-20 sm:z-0'>
                  {/* Subtle pattern texture inside stats card */}
                  <div
                    className='pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay'
                    style={{
                      backgroundImage: `url(${ArtBg})`,
                      backgroundRepeat: 'repeat',
                      backgroundSize: '220px'
                    }}
                  />

                  <div className='relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-white/25 '>
                    <div className='pt-2 sm:pt-0 sm:pr-4 lg:pr-5'>
                      <div className='text-base sm:text-[17px] lg:text-[18px] font-bold tracking-tight leading-tight'>
                        Ogun Tech Hub, Kobape
                      </div>
                      <div className='text-[12px] sm:text-[12.5px] text-white/90 mt-1 leading-snug'>
                        November 25, 2026
                      </div>
                    </div>

                    <div className='pt-2 sm:pt-0 sm:px-4 lg:px-5'>
                      <div className='text-xl sm:text-[23px] lg:text-[25px] font-bold tracking-tight leading-tight'>
                        &#8358;2,500,000
                      </div>
                      <div className='text-[12px] sm:text-[12.5px] text-white/90 mt-1 leading-snug'>
                        First Place Prize
                      </div>
                    </div>

                    <div className='pt-2 sm:pt-0 sm:px-4 lg:px-5'>
                      <div className='text-xl sm:text-[23px] lg:text-[25px] font-bold tracking-tight leading-tight'>
                        &#8358;1,500,000
                      </div>
                      <div className='text-[12px] sm:text-[12.5px] text-white/90 mt-1 leading-snug'>
                        Second Place Prize
                      </div>
                    </div>

                    <div className='pt-2 sm:pt-0 sm:pl-4 lg:pl-5'>
                      <div className='text-xl sm:text-[23px] lg:text-[25px] font-bold tracking-tight leading-tight'>
                        &#8358;1,000,000
                      </div>
                      <div className='text-[12px] sm:text-[12.5px] text-white/90 mt-1 leading-snug'>
                        Third Place Prize
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Graphic Asset */}
              <div className='lg:col-span-5 flex justify-center lg:justify-end relative mt-8 lg:mt-0'>
                <div className='relative w-full max-w-[440px] sm:max-w-[490px] lg:max-w-[530px] flex items-center justify-center'>
                  <img
                    src='/img/ODS circle asset 1 [Vectorized].png'
                    alt='ODS Hackathon Team Collaboration'
                    style={{
                      filter: 'drop-shadow(15px 15px 0px #94E4A9)'
                    }}
                    className='w-full h-auto object-contain select-none'
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 6 TRACKS ONE GOAL ================= */}
        <section className='relative py-16 md:py-24 bg-white overflow-hidden'>
          {/* Subtle radiant mint ambient gradient on the top right */}
          <div
            className='pointer-events-none absolute right-0 top-0 w-[550px] h-[550px] rounded-full blur-3xl opacity-30 -z-10'
            style={{
              background:
                'radial-gradient(circle at 85% 15%, rgba(185, 251, 192, 0.45) 0%, rgba(255, 255, 255, 0) 65%)'
            }}
          />

          <div className='max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
            <div className='text-center max-w-2xl mx-auto mb-12 md:mb-14'>
              <h2 className='platypi-gf font-bold text-3xl sm:text-4xl md:text-[38px] text-[#101828] tracking-tight'>
                6 tracks one goal
              </h2>
              <p className='text-xs sm:text-sm md:text-[15px] text-[#667085] mt-2.5 font-normal'>
                Pick the track where your team can show the most believable impact.
              </p>
            </div>

            {/* 6 Cards Grid (3 columns, 2 rows) */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7'>
              {tracks.map((track, idx) => (
                <div
                  key={idx}
                  style={{ backgroundColor: '#FCF6E3' }}
                  className='rounded-2xl p-7 sm:p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-sm flex flex-col justify-start'
                >
                  <div className='mb-4'>{track.icon}</div>
                  <h3 className='platypi-gf font-bold text-lg sm:text-[20px] text-[#101828] mb-2.5'>
                    {track.title}
                  </h3>
                  <p className='text-[#5A6270] text-xs sm:text-[14px] leading-relaxed font-normal'>
                    {track.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= WHAT JUDGES ARE LOOKING FOR ================= */}
        <section className='relative bg-[#141815] text-white py-20 md:py-28 overflow-hidden'>
          {/* Floating Sparkle Stars */}
          <div className='pointer-events-none'>
            {/* Top Left */}
            <div className='absolute top-10 left-8 sm:left-24'>
              <SparkleStar className='w-5 h-5 text-[#FF8A80]' />
            </div>
            {/* Mid Left */}
            <div className='absolute top-1/2 left-6 sm:left-16 -translate-y-1/2'>
              <SparkleStar className='w-6 h-6 text-[#FF8A80]' />
            </div>
            {/* Bottom Left */}
            <div className='absolute bottom-8 left-10 sm:left-32'>
              <SparkleStar className='w-4 h-4 text-[#FF8A80]' />
            </div>
            {/* Top Right */}
            <div className='absolute top-14 right-10 sm:right-28'>
              <SparkleStar className='w-5 h-5 text-[#FF8A80]' />
            </div>
            {/* Mid Right */}
            <div className='absolute top-1/2 right-8 sm:right-20 -translate-y-1/2'>
              <SparkleStar className='w-5 h-5 text-[#FAF7EE]' />
            </div>
            {/* Bottom Right */}
            <div className='absolute bottom-10 right-12 sm:right-36'>
              <SparkleStar className='w-6 h-6 text-[#FF8A80]' />
            </div>
          </div>

          <div className='max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
            <div className='text-center max-w-2xl mx-auto mb-10 md:mb-12'>
              <h2 className='platypi-gf text-2xl sm:text-3xl md:text-4xl text-white font-medium'>
                What judges are looking for
              </h2>
              <p className='text-xs sm:text-sm text-[#98A2B3] mt-2.5'>
                Five things your team should be ready to demonstrate.
              </p>
            </div>

            {/* List */}
            <div className='max-w-2xl mx-auto flex flex-col items-center space-y-4'>
              {/* Item 1 */}
              <div className='text-[#D0D5DD] text-xs sm:text-sm text-center flex items-center justify-center gap-2 px-4 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:bg-[#009E49] hover:text-white cursor-pointer'>
                <span className='text-white/60 font-medium hover:text-white transition-colors'>
                  ✓
                </span>
                <span>
                  A clearly defined problem, supported by evidence or credible user insight.
                </span>
              </div>

              {/* Item 2 */}
              <div className='text-[#D0D5DD] text-xs sm:text-sm text-center flex items-center justify-center gap-2 px-4 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:bg-[#009E49] hover:text-white cursor-pointer'>
                <span className='text-white/60 font-medium hover:text-white transition-colors'>
                  ✓
                </span>
                <span>An original and practical approach that fits the local context.</span>
              </div>

              {/* Item 3 (Prominent green pill) */}
              <div className='w-full sm:w-auto my-2'>
                <div className='text-[#D0D5DD] text-xs sm:text-sm text-center flex items-center justify-center gap-2 px-4 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:bg-[#009E49] hover:text-white cursor-pointer'>
                  <span className='text-white/60 font-medium hover:text-white transition-colors'>
                    ✓
                  </span>
                  <span>A working prototype that demonstrates the core experience.</span>
                </div>
              </div>

              {/* Item 4 */}
              <div className='text-[#D0D5DD] text-xs sm:text-sm text-center flex items-center justify-center gap-2 px-4 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:bg-[#009E49] hover:text-white cursor-pointer'>
                <span className='text-white/60 font-medium hover:text-white transition-colors'>
                  ✓
                </span>
                <span>
                  A solution with believable impact, adoption potential and a path to
                  sustainability.
                </span>
              </div>

              {/* Item 5 */}
              <div className='text-[#D0D5DD] text-xs sm:text-sm text-center flex items-center justify-center gap-2 px-4 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:bg-[#009E49] hover:text-white cursor-pointer'>
                <span className='text-white/60 font-medium hover:text-white transition-colors'>
                  ✓
                </span>
                <span>
                  A team that can explain its choices, limitations and next steps clearly.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= WHO CAN ENTER & TEAM REQUIREMENTS ================= */}
        <section className='py-16 md:py-24 bg-[#FAF6ED]'>
          <div className='max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start'>
              {/* Left Column: Who can enter & How to apply */}
              <div className='lg:col-span-7'>
                <h2 className='platypi-gf text-2xl sm:text-3xl md:text-4xl font-semibold text-[#101828] mb-8'>
                  Who can enter ?
                </h2>

                <div className='space-y-5'>
                  {[
                    'Students of universities, polytechnics, and colleges of education.',
                    'Early-career and experienced technology professionals.',
                    'Founders and entrepreneurs working on early-stage ideas.',
                    'Developers, designers, product managers, data pros, and domain experts.'
                  ].map((item, idx) => (
                    <div key={idx} className='flex items-start gap-3.5'>
                      <span className='w-2.5 h-2.5 rounded-full bg-[#009E49] mt-2 flex-shrink-0' />
                      <p className='text-[#344054] text-sm sm:text-base leading-relaxed'>{item}</p>
                    </div>
                  ))}
                </div>

                <div className='mt-8 pt-6 border-t border-[#E4E7EC]'>
                  <h3 className='platypi-gf text-xl font-semibold text-[#101828] mb-2.5'>
                    How to Apply
                  </h3>
                  <ul className='list-disc pl-5 space-y-3 text-[#344054] text-sm sm:text-base leading-relaxed marker:text-[#009E49]'>
                    <li>
                      <span className='font-semibold text-[#101828]'>Form Your Team:</span> Put
                      together a team of 2–5 members, appoint one member as your team lead, and
                      choose a team name.
                    </li>
                    <li>
                      <span className='font-semibold text-[#101828]'>Register Your Team:</span>{' '}
                      Complete the official registration form with your team details and the
                      requested information about your proposed solution.
                    </li>
                    <li>
                      <span className='font-semibold text-[#101828]'>
                        Tell Us What You're Building:
                      </span>{' '}
                      Describe the problem you're solving, who it affects, and how your solution
                      will address it.
                    </li>
                    <li>
                      <span className='font-semibold text-[#101828]'>Submit Your Application:</span>{' '}
                      Review your details and submit your application. Shortlisted teams will
                      receive further instructions on the next steps.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Column: Team Requirements Card */}
              <div className='lg:col-span-5'>
                <div className='bg-[#200A38] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-[#351A54]'>
                  <div className='w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4'>
                    <Network className='w-6 h-6 text-[#D8B4FE]' />
                  </div>

                  <h3 className='platypi-gf text-xl font-semibold text-white mb-6'>
                    Team requirements
                  </h3>

                  <div className='space-y-4 text-xs sm:text-sm'>
                    <div className='flex justify-between items-center py-2 border-b border-white/10'>
                      <span className='text-[#B6A4CC]'>Team Size</span>
                      <span className='text-white font-medium'>2 to 5 members</span>
                    </div>

                    <div className='flex justify-between items-center py-2 border-b border-white/10'>
                      <span className='text-[#B6A4CC]'>Membership</span>
                      <span className='text-white font-medium'>1 team per participant</span>
                    </div>

                    <div className='flex justify-between items-center py-2 border-b border-white/10'>
                      <span className='text-[#B6A4CC]'>Structure</span>
                      <span className='text-white font-medium'>1 team name, 1 team lead</span>
                    </div>

                    <div className='flex justify-between items-center py-2'>
                      <span className='text-[#B6A4CC]'>Composition</span>
                      <span className='text-white font-medium text-right'>
                        Cross-functional built
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= BOTTOM CTA BANNER ================= */}
            <div className='mt-16 md:mt-24'>
              <div className='rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-xl'>
                {/* Diagonal Striped Top Ribbon */}
                <div
                  className='h-12 sm:h-14 w-full block'
                  style={{
                    backgroundColor: '#C5F4D0',
                    backgroundImage: `repeating-linear-gradient(
                      112deg,
                      #2BA04E 0,
                      #2BA04E 4.5px,
                      transparent 4.5px,
                      transparent 18px
                    )`
                  }}
                />

                {/* Banner Main Body */}
                <div className='bg-[#009E49] text-white px-8 py-10 sm:px-12 sm:py-14 lg:px-16 lg:py-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12'>
                  <div>
                    <h3 className='platypi-gf font-bold text-2xl sm:text-3xl lg:text-[40px] leading-[1.18] text-white tracking-tight max-w-[580px]'>
                      Register your team before
                      <br />
                      the deadline to compete.
                    </h3>

                    <button
                      onClick={handleRegisterClick}
                      className='mt-7 inline-block bg-[#111813] hover:bg-black text-white text-sm font-medium px-7 py-3 rounded-full transition-all shadow-md cursor-pointer'
                    >
                      Register Your Team
                    </button>
                  </div>

                  <div className='max-w-[440px]'>
                    <p className='text-white text-sm sm:text-[15px] leading-relaxed font-normal'>
                      Shortlisted teams will participate in build activities, mentorship, and the
                      physical showcase on Nov 25 at Ogun Tech Hub, Kobape, Abeokuta.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
