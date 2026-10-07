import Nav from '@/components/local/nav';
import Footer from '@/components/local/footer';

// Hero background image
const heroBg = '/img/IMG_0919 1 (1).png';

// 2024 / Main Speakers Lineup images from public/img
const speakersLineup = [
  {
    name: 'Samson Ogbole',
    role: 'Director, Soilless Farm Lab',
    image: '/img/Frame 2147239201.png',
    badge: null,
    isOverlayNeeded: false
  },
  {
    name: 'Ayodeji Awosika',
    role: 'Founder, Web3 Bridge',
    image: '/img/Frame 2147239200.png',
    badge: null,
    isOverlayNeeded: false
  },
  {
    name: 'Seyi Ademeso',
    role: 'Content Creator & Strategist | Co-Founder, Meshkiey',
    image: '/img/Frame 2147239200 (1).png',
    badge: 'MESHKIEY',
    isOverlayNeeded: false
  },
  {
    name: 'Idris Olubisi',
    role: 'Founder, Web3Afrika',
    image: '/img/Frame 2147239200 (2).png',
    badge: null,
    isOverlayNeeded: false
  },
  {
    name: 'Debo Richards',
    role: 'Content Creator',
    image: '/img/Frame 2147239201.png',
    badge: null,
    isOverlayNeeded: true // Cleanly displays Debo Richards over base avatar
  },
  {
    name: 'Adebayo Adewole',
    role: 'Associate',
    image: '/img/Frame 2147239200 (3).png',
    badge: null,
    isOverlayNeeded: false
  },
  {
    name: 'Joseph Onaolapo',
    role: 'Media Personality and Founder, Jayonair',
    image: '/img/Frame 2147239200 (4).png',
    badge: 'JAYONAIR',
    isOverlayNeeded: false
  },
  {
    name: 'Dára Sobaloju',
    role: 'Founder of Pewbeam',
    image: '/img/Frame 2147239200 (5).png',
    badge: null,
    isOverlayNeeded: false
  },
  {
    name: 'Fola Olatunji-David',
    role: 'Founding Partner, Kickoff Africa',
    image: '/img/Frame 2147239200 (6).png',
    badge: null,
    isOverlayNeeded: false
  },
  {
    name: 'Sulaimon Adebayo',
    role: 'Founder, Pooja Media and Communications',
    image: '/img/Frame 2147239200 (7).png',
    badge: 'POOJA',
    isOverlayNeeded: false
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
  const tickerText = 'Nov 25, 2026 • June 12 Cultural Centre, Kuto, Abeokuta Ogun state //';

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
          <div className='inline-block px-3 py-1 mb-6 rounded text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-[#00A651]'>
            [ SPEAKERS // OGUN DIGITAL SUMMIT 2026 ]
          </div>

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
        className='relative w-full bg-[#FAF8EE] pt-16 pb-24 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8'
      >
        <div className='max-w-[1200px] mx-auto'>
          {/* Header */}
          <div className='text-center max-w-2xl mx-auto mb-12 md:mb-16'>
            <p className='text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-[#00A651] mb-2'>
              [ ODS 2024 SPEAKERS LINEUP ]
            </p>
            <h2 className='platypi-gf font-normal text-3xl sm:text-4xl md:text-5xl text-[#181818] tracking-tight'>
              Meet our Speakers
            </h2>
            <p className='text-sm md:text-base text-[#595959] mt-3 font-normal'>
              We're bringing together a remarkable group of bold innovators and doers from across
              Africa.
            </p>
          </div>

          {/* Speakers Grid (2 rows x 5 cards) */}
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5'>
            {speakersLineup.map((speaker, index) => (
              <div
                key={index}
                className='group relative overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 bg-[#090b14] flex flex-col'
              >
                {/* Speaker Card Image */}
                <div className='relative w-full aspect-[240/290] overflow-hidden bg-[#090B14]'>
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                    loading='lazy'
                  />

                  {/* Clean overlay for Debo Richards to ensure correct name matching */}
                  {speaker.isOverlayNeeded && (
                    <div className='absolute inset-x-0 bottom-0 pt-8 pb-3 px-3.5 bg-gradient-to-t from-[#060714] via-[#060714] to-transparent pointer-events-none'>
                      <p className='text-white font-bold text-sm leading-tight tracking-tight'>
                        {speaker.name}
                      </p>
                      <p className='text-gray-300 text-[11px] mt-0.5 leading-tight'>
                        {speaker.role}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
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
