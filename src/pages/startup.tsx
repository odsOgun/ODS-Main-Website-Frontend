import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Brain, Calendar, Check, Diamond, Sparkles, Store, Trophy } from 'lucide-react';
import Nav from '@/components/local/nav';
import Footer from '@/components/local/footer';

// Sparkling 4-point star SVG icon
const SparkleStar = ({
  className = 'w-4 h-4 text-[#FF7B72]',
  style
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <svg
    viewBox='0 0 24 24'
    fill='currentColor'
    className={className}
    style={style}
    aria-hidden='true'
  >
    <path d='M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z' />
  </svg>
);

// Pixel checkerboard blocks component matching ODS retro brand design
const PixelChecker = ({
  rows = 4,
  cols = 4,
  size = 10,
  darkColor = '#006627',
  lightColor = '#FFFFFF',
  className = ''
}: {
  rows?: number;
  cols?: number;
  size?: number;
  darkColor?: string;
  lightColor?: string;
  className?: string;
}) => {
  return (
    <div
      className={`inline-grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, ${size}px)`,
        gridTemplateRows: `repeat(${rows}, ${size}px)`,
        width: `${cols * size}px`,
        height: `${rows * size}px`
      }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const isDark = (r + c) % 2 === 0;
        return (
          <div
            key={i}
            style={{
              backgroundColor: isDark ? darkColor : lightColor,
              width: `${size}px`,
              height: `${size}px`
            }}
          />
        );
      })}
    </div>
  );
};

export default function StartupLanding() {
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqs((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]));
  };

  const heroCards = [
    {
      src: '/img/Rectangle 240662488.png',
      alt: 'Speaker at podium',
      rotate: -7,
      y: 22,
      zIndex: 10,
      floatDuration: 3.6
    },
    {
      src: '/img/Rectangle 240662489.png',
      alt: 'Founders collaborating',
      rotate: -3.5,
      y: 7,
      zIndex: 20,
      floatDuration: 3.2
    },
    {
      src: '/img/Rectangle 240662490.png',
      alt: 'Build ship scale',
      rotate: -0.5,
      y: -8,
      zIndex: 30,
      floatDuration: 3.8
    },
    {
      src: '/img/Rectangle 240662491.png',
      alt: 'Startup idea notebook',
      rotate: 3,
      y: 7,
      zIndex: 40,
      floatDuration: 3.4
    },
    {
      src: '/img/Rectangle 240662492.png',
      alt: 'Smiling attendee',
      rotate: 7,
      y: 22,
      zIndex: 50,
      floatDuration: 3.5
    }
  ];

  const benefits = [
    {
      title: 'Free to take part',
      desc: 'No fees to apply, showcase or enter the competition.',
      tag: 'Both parties',
      type: 'both',
      tagBg: 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]',
      shadow: 'rgba(5, 150, 105, 0.25)',
      initialRotate: -6,
      floatDuration: 3.4
    },
    {
      title: 'Free exhibition booth',
      desc: 'A booth at the summit to demo your product, at no cost.',
      tag: 'Showcase',
      type: 'showcase',
      tagBg: 'bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]',
      shadow: 'rgba(2, 132, 199, 0.25)',
      initialRotate: -5,
      floatDuration: 3.1
    },
    {
      title: 'Seen by investors',
      desc: 'Investors attending ODS 2026 come to see the 10 showcase startups.',
      tag: 'Showcase',
      type: 'showcase',
      tagBg: 'bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]',
      shadow: 'rgba(2, 132, 199, 0.25)',
      initialRotate: -7,
      floatDuration: 3.6
    },
    {
      title: 'Green Room meetings',
      desc: 'Private one-on-one meetings with investors interested in your startup.',
      tag: 'Showcase',
      type: 'showcase',
      tagBg: 'bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]',
      shadow: 'rgba(2, 132, 199, 0.25)',
      initialRotate: -4,
      floatDuration: 3.2
    },
    {
      title: 'ODS website listing',
      desc: 'Your startup listed on the ODS website as a showcased startup.',
      tag: 'Showcase',
      type: 'showcase',
      tagBg: 'bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]',
      shadow: 'rgba(2, 132, 199, 0.25)',
      initialRotate: -6,
      floatDuration: 3.5
    },
    {
      title: 'Pitch on the ODS stage',
      desc: 'Present your startup live to a panel of judges.',
      tag: 'Competition',
      type: 'competition',
      tagBg: 'bg-[#FCE7F3] text-[#E11D48] border-[#FBCFE8]',
      shadow: 'rgba(225, 29, 72, 0.25)',
      initialRotate: -5,
      floatDuration: 3.3
    },
    {
      title: 'Feedback from judges',
      desc: 'Hear what experienced judges think of your business and pitch.',
      tag: 'Competition',
      type: 'competition',
      tagBg: 'bg-[#FCE7F3] text-[#E11D48] border-[#FBCFE8]',
      shadow: 'rgba(225, 29, 72, 0.25)',
      initialRotate: -7,
      floatDuration: 3.7
    },
    {
      title: 'Win a grant',
      desc: 'Winners receive a grant from the prize pool, announced before the summit.',
      tag: 'Competition',
      type: 'competition',
      tagBg: 'bg-[#FCE7F3] text-[#E11D48] border-[#FBCFE8]',
      shadow: 'rgba(225, 29, 72, 0.25)',
      initialRotate: -6,
      floatDuration: 3.0
    }
  ];

  const timelineSteps = [
    {
      step: '1',
      date: 'October 30',
      title: 'Applications close',
      desc: 'Submit the form by 11:59 PM WAT. Tick the competition box if you want to pitch.'
    },
    {
      step: '2',
      date: 'Before the summit',
      title: 'Selection',
      desc: 'We choose the 10 showcase startups, shortlist startups for the competition, then email everyone selected.',
      hasStar: true
    },
    {
      step: '3',
      date: 'November 25',
      title: 'Startup Competition',
      desc: 'Shortlisted startups pitch to the judges. Winners receive grants from the prize pool.'
    },
    {
      step: '4',
      date: 'November 26',
      title: 'Startup Showcase',
      desc: 'The 10 startups exhibit to attendees and investors, and meet interested investors in the Green Room.'
    }
  ];

  const faqs = [
    {
      q: 'Can I apply for both the showcase and the competition?',
      a: 'Yes. Fill the form once and tick "I also want to enter the Startup Competition."'
    },
    {
      q: "My startup isn't in Ogun State. Can I apply?",
      a: 'Yes, you can enter the Startup Competition. The showcase is for startups based in Ogun State that are earning revenue.'
    },
    {
      q: 'How many startups will be showcased?',
      a: '10 startups are selected for the Startup Showcase on November 26, 2026.'
    },
    {
      q: 'Does it cost anything?',
      a: 'No. Applying, showcasing and entering the competition are free.'
    },
    {
      q: 'How much is the grant?',
      a: "We'll announce the prize pool before the summit."
    },
    {
      q: 'Do winners give up equity?',
      a: 'No. Grants are not investments and take no ownership of your startup.'
    },
    {
      q: 'What is the Green Room?',
      a: "A private meeting space at the venue where investors meet the showcase startups they're interested in."
    },
    {
      q: 'When is the deadline?',
      a: 'October 30, 2026 at 11:59 PM West Africa Time.'
    }
  ];

  return (
    <div className='min-h-screen bg-[#FAF7F0] text-[#101611] font-sans selection:bg-[#008736] selection:text-white'>
      <Nav />

      {/* ==================== HERO SECTION ==================== */}
      <section className='relative overflow-hidden pt-10 pb-16 md:pt-14 md:pb-24 bg-[#FAF7F0]'>
        {/* Floating Sparkles with gentle pulse */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className='absolute top-12 left-[12%] hidden md:block'
        >
          <SparkleStar className='w-5 h-5 text-[#FF7B72]' />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className='absolute top-20 right-[14%] hidden md:block'
        >
          <SparkleStar className='w-6 h-6 text-[#FF7B72]' />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className='absolute bottom-28 right-[8%] hidden lg:block'
        >
          <SparkleStar className='w-4 h-4 text-[#FF7B72]' />
        </motion.div>

        <div className='max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FCEAE8] border border-[#F8C8C4] text-[#E05345] text-xs sm:text-sm font-semibold tracking-wide uppercase mb-6'
          >
            <Sparkles className='w-3.5 h-3.5' />
            <span>STARTUP COMPETITION & SHOWCASE</span>
            <Sparkles className='w-3.5 h-3.5' />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className='platypi-gf font-black text-4xl sm:text-5xl md:text-6xl lg:text-[70px] leading-[1.08] text-[#101611] tracking-tight max-w-4xl mx-auto'
          >
            Your Startup, On The
            <br />
            ODS Stage.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='inter-gf text-[#556052] text-sm sm:text-base md:text-lg max-w-2xl mx-auto mt-5 leading-relaxed'
          >
            Pitch for grants, showcase to investors, and connect with 10,000+ attendees at Ogun
            Digital Summit 2026. Free to enter and exhibit.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='flex flex-wrap items-center justify-center gap-4 mt-8'
          >
            <Link
              to='/register/startup'
              className='bg-[#008736] hover:bg-[#006e2c] text-white rounded-full font-semibold px-8 py-3.5 text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 group'
            >
              <span>Apply to Showcase</span>
              <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
            </Link>
            <Link
              to='/register/startup'
              className='bg-[#FAF7F0] border-2 border-[#101611] text-[#101611] hover:bg-[#101611] hover:text-white rounded-full font-semibold px-8 py-3.5 text-sm sm:text-base transition-all duration-200 flex items-center gap-2'
            >
              <span>Enter Competition</span>
            </Link>
          </motion.div>

          {/* 5 Hero Photo Cards Arched Arrangement */}
          <div className='relative mt-10 sm:mt-14 md:mt-16 pt-4 pb-8 flex items-center justify-center overflow-x-auto no-scrollbar'>
            {/* Sparkles around the arch */}
            <motion.div
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className='absolute top-2 left-[12%] hidden lg:block pointer-events-none'
            >
              <SparkleStar className='w-4 h-4 text-[#FF7B72]' />
            </motion.div>
            <motion.div
              animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.25, 1] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className='absolute top-0 right-[12%] hidden lg:block pointer-events-none'
            >
              <SparkleStar className='w-5 h-5 text-[#FF7B72]' />
            </motion.div>

            {/* Overlapping Arched Fan */}
            <div className='flex items-center justify-center min-w-max px-6 sm:px-10 py-6'>
              {heroCards.map((card, i) => {
                const isHovered = hoveredCard === i;
                const isAnyHovered = hoveredCard !== null;

                return (
                  <motion.div
                    key={i}
                    initial={{
                      opacity: 0,
                      y: card.y + 40,
                      scale: 0.9,
                      rotate: 0
                    }}
                    animate={{
                      opacity: 1,
                      y: isHovered ? card.y - 24 : [card.y, card.y - 6, card.y],
                      rotate: isHovered ? 0 : card.rotate,
                      scale: isHovered ? 1.14 : isAnyHovered ? 0.96 : 1,
                      zIndex: isHovered ? 60 : card.zIndex
                    }}
                    transition={
                      isHovered
                        ? { type: 'spring', stiffness: 350, damping: 20 }
                        : {
                            opacity: { duration: 0.5, delay: i * 0.1 },
                            y: {
                              duration: card.floatDuration,
                              repeat: Infinity,
                              repeatType: 'reverse',
                              ease: 'easeInOut',
                              delay: i * 0.3
                            },
                            rotate: { type: 'spring', stiffness: 220, damping: 18 },
                            scale: { type: 'spring', stiffness: 220, damping: 18 }
                          }
                    }
                    onMouseEnter={() => setHoveredCard(i)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className={`relative flex-shrink-0 w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-60 lg:h-60 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer select-none transition-shadow ${
                      i > 0 ? '-ml-5 sm:-ml-7 md:-ml-9 lg:-ml-10' : ''
                    }`}
                    style={{
                      boxShadow: isHovered
                        ? '0 25px 45px -8px rgba(0, 0, 0, 0.38), 0 10px 18px -4px rgba(0, 0, 0, 0.22)'
                        : '0 12px 28px -6px rgba(0, 0, 0, 0.24), 0 4px 10px -2px rgba(0, 0, 0, 0.12)',
                      transformOrigin: 'bottom center'
                    }}
                  >
                    <motion.img
                      src={card.src}
                      alt={card.alt}
                      animate={{ scale: isHovered ? 1.06 : 1 }}
                      transition={{ duration: 0.3 }}
                      className='w-full h-full object-cover pointer-events-none'
                      loading='eager'
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== STATS METRIC RIBBON ==================== */}
      <section className='bg-[#008736] text-white relative py-5 sm:py-6 overflow-hidden'>
        <div className='max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between'>
          {/* Left pixel checkerboard */}
          <div className='hidden md:block'>
            <PixelChecker rows={4} cols={4} size={11} darkColor='#006627' lightColor='#008736' />
          </div>

          {/* 4 Stats */}
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full md:px-8 text-center'>
            <div className='flex flex-col items-center justify-center'>
              <span className='font-bold text-lg sm:text-xl md:text-2xl uppercase tracking-tight text-white'>
                10 Startups
              </span>
              <span className='text-xs sm:text-sm text-[#C2F5D3] mt-0.5'>
                Selected For Showcase
              </span>
            </div>

            <div className='flex flex-col items-center justify-center'>
              <span className='font-bold text-lg sm:text-xl md:text-2xl tracking-tight text-white'>
                Non-equity
              </span>
              <span className='text-xs sm:text-sm text-[#C2F5D3] mt-0.5'>
                Grants For Top 3 Startups
              </span>
            </div>

            <div className='flex flex-col items-center justify-center'>
              <span className='font-bold text-lg sm:text-xl md:text-2xl tracking-tight text-white'>
                Oct 30, 2026
              </span>
              <span className='text-xs sm:text-sm text-[#C2F5D3] mt-0.5'>Applications Close</span>
            </div>

            <div className='flex flex-col items-center justify-center'>
              <span className='font-bold text-lg sm:text-xl md:text-2xl tracking-tight text-white'>
                Nov 25-26, 2026
              </span>
              <span className='text-xs sm:text-sm text-[#C2F5D3] mt-0.5'>
                At June 12 Cultural Centre
              </span>
            </div>
          </div>

          {/* Right pixel checkerboard */}
          <div className='hidden md:block'>
            <PixelChecker rows={4} cols={4} size={11} darkColor='#006627' lightColor='#008736' />
          </div>
        </div>
      </section>

      {/* ==================== HOW TO TAKE PART SECTION ==================== */}
      <section className='bg-[#C8F2CD] py-16 sm:py-24 relative overflow-hidden'>
        <div className='max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Header */}
          <div className='flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-14'>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className='platypi-gf font-black text-3xl sm:text-4xl md:text-5xl text-[#101611]'
            >
              How To Take Part
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className='text-sm sm:text-base text-[#1E4B28] max-w-md font-medium leading-relaxed'
            >
              Showcase your startup to investors or compete for cash prizes. Or do both if you're
              eligible.
            </motion.p>
          </div>

          {/* Unified Card Container */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ type: 'spring', stiffness: 140, damping: 20 }}
            className='bg-[#FAF6EC] rounded-3xl sm:rounded-[36px] shadow-2xl border border-[#E2DCBA] overflow-hidden'
          >
            <div className='grid grid-cols-1 lg:grid-cols-12 items-stretch'>
              {/* Left Column (6 cols): Text content */}
              <div className='lg:col-span-6 p-7 sm:p-10 md:p-14 flex flex-col justify-center'>
                {/* Item 1: Startup Competition */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ x: 4 }}
                  className='group transition-transform cursor-pointer'
                >
                  <span className='block text-[#F8C4BF] font-black text-4xl sm:text-5xl leading-none select-none mb-3 group-hover:text-[#FA8E84] transition-colors'>
                    #1
                  </span>

                  <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEEAE8] border border-[#FBCBC7] text-[#E05345] text-xs font-semibold mb-3.5 shadow-xs'>
                    <Calendar className='w-3.5 h-3.5 text-[#E05345]' />
                    <span>November 25, 2026</span>
                  </div>

                  <h3 className='font-bold text-2xl sm:text-3xl text-[#101611] tracking-tight mb-2.5 group-hover:text-[#008736] transition-colors'>
                    Startup Competition
                  </h3>

                  <p className='text-sm sm:text-base text-[#4A5568] leading-relaxed mb-3 font-normal'>
                    Shortlisted startups pitch live to a panel of judges. The best pitches win a
                    grant from the prize pool, with no equity taken.
                  </p>

                  <p className='italic text-xs sm:text-sm font-semibold text-[#1F2937]'>
                    For: Startups based in Ogun State that are already earning revenue.
                  </p>
                </motion.div>

                {/* Subtle Divider */}
                <div className='my-8 sm:my-10 border-t border-[#ECE5D4]' />

                {/* Item 2: Startup Showcase */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ x: 4 }}
                  className='group transition-transform cursor-pointer'
                >
                  <span className='block text-[#F8C4BF] font-black text-4xl sm:text-5xl leading-none select-none mb-3 group-hover:text-[#FA8E84] transition-colors'>
                    #2
                  </span>

                  <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEEAE8] border border-[#FBCBC7] text-[#E05345] text-xs font-semibold mb-3.5 shadow-xs'>
                    <Calendar className='w-3.5 h-3.5 text-[#E05345]' />
                    <span>November 26, 2026</span>
                  </div>

                  <h3 className='font-bold text-2xl sm:text-3xl text-[#101611] tracking-tight mb-2.5 group-hover:text-[#008736] transition-colors'>
                    Startup Showcase
                  </h3>

                  <p className='text-sm sm:text-base text-[#4A5568] leading-relaxed mb-3 font-normal'>
                    We select 10 startups to exhibit at the summit, with investors in the room to
                    see them. Investors who are interested meet the founders privately in the Green
                    Room.
                  </p>

                  <p className='italic text-xs sm:text-sm font-semibold text-[#1F2937]'>
                    For: Startups from anywhere, at any stage, from idea to revenue.
                  </p>
                </motion.div>
              </div>

              {/* Right Column (6 cols): Photo + Wavy Seam + Badges */}
              <div className='lg:col-span-6 relative min-h-[460px] sm:min-h-[540px] lg:min-h-full overflow-hidden bg-zinc-800 flex items-stretch'>
                {/* The Photograph with Hover Zoom */}
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className='w-full h-full relative'
                >
                  <img
                    src='/img/Rectangle 240662493.png'
                    alt='ODS Startup founders smiling'
                    className='w-full h-full object-cover object-top select-none'
                  />

                  {/* Watermark in background */}
                  <div
                    className='absolute top-4 right-4 sm:top-8 sm:right-8 font-black text-6xl sm:text-7xl md:text-8xl tracking-tight text-transparent select-none pointer-events-none opacity-25'
                    style={{ WebkitTextStroke: '2px rgba(255, 255, 255, 0.75)' }}
                  >
                    ODS2026
                  </div>
                </motion.div>

                {/* Organic Wavy Cutout Divider */}
                <motion.svg
                  viewBox='0 0 100 800'
                  preserveAspectRatio='none'
                  animate={{ scaleX: [1, 1.06, 0.96, 1] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                  className='absolute top-0 bottom-0 -left-1 w-12 sm:w-16 md:w-20 h-full z-10 fill-[#FAF6EC] pointer-events-none hidden lg:block'
                  style={{ transformOrigin: 'left center' }}
                >
                  <path d='M0,0 L45,0 C85,65 85,135 45,200 C5,265 5,335 45,400 C85,465 85,535 45,600 C5,665 5,735 45,800 L0,800 Z' />
                </motion.svg>

                {/* Overlaid Badges on bottom-left */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 240, damping: 20, delay: 0.25 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className='absolute bottom-6 left-4 sm:bottom-8 sm:left-6 md:left-8 z-20 flex flex-col shadow-2xl cursor-pointer select-none'
                >
                  {/* Top Badge: 10 Startups */}
                  <div className='flex items-stretch'>
                    {/* Solid Red Box */}
                    <div className='bg-[#EB3528] text-white px-5 py-3 flex flex-col justify-center min-w-[130px] sm:min-w-[145px]'>
                      <span className='text-3xl font-black leading-none tracking-tight'>10</span>
                      <span className='text-xs font-semibold tracking-wide text-white/95 mt-1'>
                        Startups
                      </span>
                    </div>

                    {/* Red Hatched Stripes */}
                    <div
                      className='w-14 sm:w-16'
                      style={{
                        background:
                          'repeating-linear-gradient(45deg, #EB3528, #EB3528 2.5px, #FFFFFF 2.5px, #FFFFFF 7.5px)'
                      }}
                    />
                  </div>

                  {/* Bottom Badge: Great prices / To be won */}
                  <div className='flex items-stretch'>
                    {/* Solid Coral Box */}
                    <div className='bg-[#FA756A] text-white px-5 py-3 flex flex-col justify-center min-w-[170px] sm:min-w-[195px]'>
                      <span className='text-lg sm:text-xl font-bold leading-none tracking-tight'>
                        Great prices
                      </span>
                      <span className='text-xs font-normal text-white/90 mt-1'>To be won</span>
                    </div>

                    {/* Coral Hatched Stripes */}
                    <div
                      className='w-14 sm:w-16'
                      style={{
                        background:
                          'repeating-linear-gradient(45deg, #FA756A, #FA756A 2.5px, #FFFFFF 2.5px, #FFFFFF 7.5px)'
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== PRIZE POOL SECTION ==================== */}
      <section className='bg-[#008736] text-white py-14 sm:py-20 relative overflow-hidden'>
        <div className='max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-8'>
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className='max-w-xl'
            >
              <h2 className='platypi-gf font-black text-3xl sm:text-4xl md:text-5xl lg:text-[54px] leading-[1.1] mb-3 text-white tracking-tight'>
                Startup Competition
                <br />
                prize pool
              </h2>
              <p className='text-sm sm:text-base md:text-lg text-[#C2F5D3] leading-relaxed'>
                We'll announce the total grant prize pool before the summit.
                <br />
                Apply now so you're in the running when it's revealed.
              </p>
            </motion.div>

            {/* Right: Blurred Prize Display (Permanently blurred, no toggle) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className='flex flex-col md:items-end items-start justify-center relative'
            >
              <span className='text-sm sm:text-base font-semibold tracking-wide text-[#E2F896] mb-3'>
                Revealing soon
              </span>
              <div className='relative'>
                {/* Soft ambient aura pulse */}
                <motion.div
                  animate={{ opacity: [0.35, 0.65, 0.35], scale: [0.95, 1.05, 0.95] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className='absolute -inset-4 bg-[#4ADE80]/30 rounded-3xl blur-2xl pointer-events-none'
                />
                {/* Blurred money */}
                <motion.div
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className='relative select-none pointer-events-none py-2 px-3'
                >
                  <span
                    className='platypi-gf font-black text-4xl sm:text-5xl md:text-6xl text-[#A7F3D0] tracking-tight block select-none pointer-events-none'
                    style={{
                      filter: 'blur(16px)',
                      userSelect: 'none'
                    }}
                    aria-hidden='true'
                  >
                    ₦500,000
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== FROM APPLICATION TO THE STAGE (DARK) ==================== */}
      <section className='bg-[#0A120B] text-white py-16 sm:py-24 relative overflow-hidden'>
        {/* Tech Grid Background Pattern */}
        <div
          className='absolute inset-0 pointer-events-none opacity-40'
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(34, 197, 94, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(34, 197, 94, 0.08) 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />

        {/* Horizontal Connecting Guideline Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ transformOrigin: 'left' }}
          className='absolute top-[55%] left-0 right-0 h-[1.5px] bg-[#22C55E]/75 shadow-[0_0_10px_#22C55E] z-10 hidden lg:block pointer-events-none'
        />

        {/* Scattered Sparkle Stars */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], rotate: [0, 15, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className='absolute top-6 left-[6%] hidden md:block pointer-events-none'
        >
          <SparkleStar className='w-4 h-4 text-[#FF7B72]' />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className='absolute bottom-10 left-[4%] hidden md:block pointer-events-none'
        >
          <SparkleStar className='w-5 h-5 text-[#FF7B72]' />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.25, 1], rotate: [0, 20, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className='absolute bottom-14 right-[3%] hidden lg:block pointer-events-none'
        >
          <SparkleStar className='w-5 h-5 text-[#FF7B72]' />
        </motion.div>

        <div className='max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center'>
            {/* Left Collage (5 cols) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className='lg:col-span-5 relative'
            >
              <div className='relative max-w-[440px] mx-auto lg:mx-0'>
                {/* Top Row: Two photos + badges */}
                <div className='grid grid-cols-12 gap-3 items-end'>
                  {/* Left Column (5 cols): Audience photo + Competition badge below */}
                  <div className='col-span-5 flex flex-col'>
                    <motion.div
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.25 }}
                      className='rounded-2xl overflow-hidden shadow-xl border border-white/10 h-32 sm:h-36 bg-zinc-800'
                    >
                      <img
                        src='/img/Rectangle 19.png'
                        alt='ODS Startup audience'
                        className='w-full h-full object-cover select-none'
                      />
                    </motion.div>
                    {/* Startup Competition Badge */}
                    <motion.div
                      whileHover={{ y: -3, scale: 1.02 }}
                      className='bg-[#FF6B61] text-white px-3.5 py-2.5 rounded-2xl shadow-lg mt-2 flex flex-col justify-center'
                    >
                      <span className='font-bold text-xs sm:text-sm leading-tight'>
                        Startup Competition
                      </span>
                      <span className='text-[11px] text-white/90 font-medium mt-0.5'>
                        November 25
                      </span>
                    </motion.div>
                  </div>

                  {/* Right Column (7 cols): Women photo + Blue Application badge */}
                  <div className='col-span-7 relative'>
                    {/* Floating Blue Application Badge */}
                    <motion.div
                      whileHover={{ y: -3, scale: 1.03 }}
                      className='absolute -top-3.5 right-0 bg-[#4FA4D7] text-[#0F172A] px-3.5 py-1.5 sm:py-2 rounded-2xl shadow-xl flex items-center gap-2.5 z-20 border border-white/20'
                    >
                      <div className='w-6 h-6 rounded-full bg-white/35 flex items-center justify-center text-[#0F172A]'>
                        <Brain className='w-3.5 h-3.5' />
                      </div>
                      <div>
                        <span className='font-bold text-xs sm:text-sm block leading-tight'>
                          Startup Application
                        </span>
                        <span className='text-[10px] text-[#0F172A]/85 font-medium block leading-tight'>
                          October 30
                        </span>
                      </div>
                    </motion.div>

                    {/* Women photo */}
                    <motion.div
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.25 }}
                      className='rounded-2xl overflow-hidden shadow-xl border border-white/10 h-44 sm:h-52 bg-zinc-800 mt-2'
                    >
                      <img
                        src='/img/Rectangle 18.png'
                        alt='ODS Founders'
                        className='w-full h-full object-cover select-none'
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Bottom Wide Photo + Yellow Showcase Badge */}
                <div className='relative mt-3'>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.25 }}
                    className='rounded-2xl overflow-hidden shadow-xl border border-white/10 h-36 sm:h-44 bg-zinc-800'
                  >
                    <img
                      src='/img/Rectangle 21.png'
                      alt='ODS exhibition hall crowd'
                      className='w-full h-full object-cover select-none'
                    />
                  </motion.div>

                  {/* Yellow Showcase Badge */}
                  <motion.div
                    whileHover={{ y: -3, scale: 1.03 }}
                    className='absolute bottom-3 left-3 bg-[#ECC660] text-[#101611] px-4 py-2 sm:py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 z-20 border border-white/20'
                  >
                    <div className='w-6 h-6 rounded-md bg-black/15 flex items-center justify-center text-[#101611]'>
                      <Store className='w-3.5 h-3.5' />
                    </div>
                    <div>
                      <span className='font-bold text-xs sm:text-sm block leading-tight'>
                        Startup Showcase
                      </span>
                      <span className='text-[10px] text-[#101611]/85 font-medium block leading-tight'>
                        November 26
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Right Timeline: 2x2 Grid (7 cols) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className='lg:col-span-7'
            >
              <h2 className='platypi-gf font-black text-3xl sm:text-4xl md:text-5xl text-white mb-8 sm:mb-12'>
                From Application To The Stage
              </h2>

              {/* 2x2 Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-8 sm:gap-y-12 relative'>
                {timelineSteps.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.45 }}
                    whileHover={{ y: -3 }}
                    className='group relative p-4 -m-4 rounded-2xl hover:bg-white/[0.03] transition-all duration-200'
                  >
                    {/* Circle green badge with icon */}
                    <div className='w-6 h-6 rounded-full bg-[#15803D]/40 text-[#4ADE80] border border-[#4ADE80]/40 flex items-center justify-center text-xs mb-2.5 shadow-sm group-hover:bg-[#15803D] group-hover:text-white transition-colors'>
                      <Check className='w-3.5 h-3.5 stroke-[3]' />
                    </div>

                    <div>
                      <span className='text-xs font-semibold uppercase tracking-wider text-[#9EE3B3] block mb-1 group-hover:text-[#34D399] transition-colors'>
                        {item.date}
                      </span>

                      <h3 className='text-lg sm:text-xl font-bold text-white mb-2 flex items-center gap-2'>
                        <span>{item.title}</span>
                        {item.hasStar && (
                          <motion.div
                            animate={{ rotate: [0, 20, -20, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            <SparkleStar className='w-3.5 h-3.5 text-[#FF7B72]' />
                          </motion.div>
                        )}
                      </h3>

                      <p className='text-xs sm:text-sm text-[#A0AEC0] leading-relaxed'>
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== WHAT YOUR STARTUP GETS ==================== */}
      <section className='bg-white py-16 sm:py-24 relative overflow-hidden'>
        {/* Winding Green Snake Ribbon in Background */}
        <div className='absolute inset-0 pointer-events-none overflow-hidden'>
          <svg
            className='w-full h-full'
            viewBox='0 0 1200 800'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            preserveAspectRatio='none'
          >
            <motion.path
              d='M 1250 80 C 1100 80, 850 40, 800 160 C 750 280, 500 240, 600 360 C 700 480, 720 540, 650 620 C 580 700, 380 660, 420 740 C 450 800, 200 820, 100 860'
              stroke='#B2E0AF'
              strokeWidth='28'
              strokeLinecap='round'
              strokeLinejoin='round'
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
            />
          </svg>
        </div>

        <div className='max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
          {/* 3x3 Grid on lg screens, 2-col on md, 1-col on mobile */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6'>
            {/* Cell 1: Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className='p-4 sm:p-6 flex flex-col justify-center'
            >
              <h2 className='platypi-gf font-black text-3xl sm:text-4xl md:text-5xl text-[#101611] leading-[1.12] mb-4'>
                What Your
                <br />
                Startup Gets
              </h2>
              <p className='text-sm sm:text-base text-[#556052] font-medium leading-relaxed max-w-xs'>
                Each benefit is marked with the programme it comes from.
              </p>
            </motion.div>

            {/* Cells 2 through 9: 8 Benefit Cards */}
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                whileHover={{ y: -6, scale: 1.015 }}
                className='bg-[#FFF9EE] rounded-[28px] p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 min-h-[190px] group border border-[#F3EDE0]'
              >
                <div>
                  <h3 className='font-bold text-lg sm:text-xl text-[#101611] tracking-tight mb-2 group-hover:text-[#008736] transition-colors'>
                    {b.title}
                  </h3>
                  <p className='text-xs sm:text-sm text-[#556052] leading-relaxed'>{b.desc}</p>
                </div>

                {/* Floating, Moving Button Badge */}
                <div className='flex justify-end pt-4'>
                  <motion.div
                    animate={{
                      y: [0, -3.5, 1, -2.5, 0],
                      rotate: [
                        b.initialRotate,
                        b.initialRotate + 4,
                        b.initialRotate - 3,
                        b.initialRotate + 2,
                        b.initialRotate
                      ]
                    }}
                    transition={{
                      duration: b.floatDuration,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.15
                    }}
                    whileHover={{
                      scale: 1.15,
                      rotate: [b.initialRotate, 3, -3, 0],
                      y: -6,
                      boxShadow: `0 8px 20px ${b.shadow}`
                    }}
                    whileTap={{ scale: 0.95 }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-xs border cursor-pointer select-none transition-shadow ${b.tagBg}`}
                  >
                    {b.type === 'both' && <Diamond className='w-3.5 h-3.5 fill-current' />}
                    {b.type === 'showcase' && <Store className='w-3.5 h-3.5' />}
                    {b.type === 'competition' && <Trophy className='w-3.5 h-3.5' />}
                    <span>{b.tag}</span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== MEET INVESTORS IN THE GREEN ROOM ==================== */}
      <section className='bg-[#C8F2CD] py-16 sm:py-24 relative overflow-hidden'>
        <div className='max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ type: 'spring', stiffness: 140, damping: 20 }}
            className='bg-[#78A877] rounded-3xl sm:rounded-[36px] shadow-2xl border border-[#6B9668]/30 overflow-hidden relative'
          >
            {/* Ambient Soft Glow */}
            <motion.div
              animate={{ opacity: [0.15, 0.35, 0.15] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className='absolute -top-32 -left-32 w-80 h-80 bg-white/20 rounded-full blur-3xl pointer-events-none'
            />

            <div className='grid grid-cols-1 lg:grid-cols-12 items-stretch'>
              {/* Left Content (6 cols) */}
              <div className='lg:col-span-6 p-7 sm:p-10 md:p-14 flex flex-col justify-between relative z-10'>
                <div>
                  <motion.h2
                    initial={{ opacity: 0, x: -25 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className='platypi-gf font-black text-3xl sm:text-4xl md:text-5xl text-white mb-4 sm:mb-5 leading-[1.12] tracking-tight'
                  >
                    Meet investors in
                    <br />
                    the Green Room
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className='text-sm sm:text-base text-white/95 leading-relaxed mb-8 font-normal max-w-lg'
                  >
                    We're bringing investors to ODS 2026 to see the 10 showcase startups. When an
                    investor wants to know more about your startup, you talk privately in the Green
                    Room, a quiet space at the venue set aside for these conversations.
                  </motion.p>
                </div>

                {/* Warm Golden Yellow Note Box */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.2 }}
                  whileHover={{ y: -3, scale: 1.015 }}
                  className='bg-[#ECD27D] rounded-2xl p-5 sm:p-6 text-[#3A2A08] shadow-md border border-[#E0C46A] cursor-default transition-all duration-200'
                >
                  <h4 className='font-bold text-sm sm:text-base mb-2 text-[#352504] tracking-tight'>
                    Come prepared with
                  </h4>
                  <ul className='text-xs sm:text-sm space-y-1.5 font-medium text-[#3A2A08]'>
                    <li className='flex items-center gap-2'>
                      <span className='w-1.5 h-1.5 rounded-full bg-[#3A2A08] flex-shrink-0' />
                      <span>Your traction and revenue numbers</span>
                    </li>
                    <li className='flex items-center gap-2'>
                      <span className='w-1.5 h-1.5 rounded-full bg-[#3A2A08] flex-shrink-0' />
                      <span>How much you're raising and what it's for</span>
                    </li>
                    <li className='flex items-center gap-2'>
                      <span className='w-1.5 h-1.5 rounded-full bg-[#3A2A08] flex-shrink-0' />
                      <span>Your next 12 months</span>
                    </li>
                  </ul>
                </motion.div>
              </div>

              {/* Right Image (6 cols) with S-Curve Divider and Overlaid Badges */}
              <div className='lg:col-span-6 relative min-h-[380px] sm:min-h-[460px] lg:min-h-full flex items-center justify-center overflow-hidden bg-[#F3EDE2]'>
                {/* Organic Wavy S-Curve Divider Overlay */}
                <div className='absolute inset-y-0 -left-1 w-14 sm:w-20 md:w-24 z-10 pointer-events-none hidden lg:block overflow-hidden'>
                  <svg
                    className='w-full h-full'
                    viewBox='0 0 100 800'
                    preserveAspectRatio='none'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M 0 0 L 70 0 C 35 160, 95 280, 40 400 C -10 520, 85 660, 50 800 L 0 800 Z'
                      fill='#78A877'
                    />
                  </svg>
                </div>

                {/* Investors Photo */}
                <motion.img
                  src='/img/Rectangle 240662493 (1).png'
                  alt='ODS Green Room Investors'
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className='w-full h-full object-cover object-center select-none'
                />

                {/* Overlaid Badges on bottom-left */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 240, damping: 20, delay: 0.25 }}
                  animate={{ y: [0, -4, 0] }}
                  whileHover={{ scale: 1.05, y: -6 }}
                  className='absolute bottom-6 left-4 sm:bottom-8 sm:left-6 md:left-8 z-20 flex flex-col shadow-2xl cursor-pointer select-none'
                >
                  {/* Top Badge: INVESTORS */}
                  <div className='flex items-stretch'>
                    <div className='bg-[#C7F9C4] text-[#005A20] px-5 py-2.5 sm:py-3 flex items-center justify-center min-w-[140px] sm:min-w-[160px]'>
                      <span className='text-sm sm:text-base font-black tracking-wider uppercase'>
                        INVESTORS
                      </span>
                    </div>
                    {/* Mint Hatched Stripes */}
                    <div
                      className='w-14 sm:w-16'
                      style={{
                        background:
                          'repeating-linear-gradient(45deg, #005A20, #005A20 2px, #C7F9C4 2px, #C7F9C4 7.5px)'
                      }}
                    />
                  </div>

                  {/* Bottom Badge: IN GREEN ROOM */}
                  <div className='flex items-stretch'>
                    <div className='bg-[#009E48] text-white px-5 py-2.5 sm:py-3 flex items-center justify-center min-w-[185px] sm:min-w-[210px]'>
                      <span className='text-sm sm:text-base font-black tracking-wider uppercase'>
                        IN GREEN ROOM
                      </span>
                    </div>
                    {/* Green Hatched Stripes */}
                    <div
                      className='w-14 sm:w-16'
                      style={{
                        background:
                          'repeating-linear-gradient(45deg, #009E48, #009E48 2px, #C7F9C4 2px, #C7F9C4 7.5px)'
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== FREQUENTLY ASKED QUESTIONS ==================== */}
      <section className='bg-white py-16 sm:py-24 border-t border-[#EAE5DA]'>
        <div className='max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='mb-8 sm:mb-10'
          >
            <h2 className='platypi-gf font-black text-3xl sm:text-4xl md:text-5xl text-[#101611] tracking-tight'>
              Frequently Asked Questions
            </h2>
          </motion.div>

          {/* Cards List */}
          <div className='space-y-3.5'>
            {faqs.map((faq, index) => {
              const isOpen = openFaqs.includes(index);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{
                    y: -2.5,
                    boxShadow:
                      '0 10px 24px -4px rgba(0, 166, 81, 0.08), 0 4px 10px -2px rgba(0, 166, 81, 0.04)',
                    borderColor: '#86EFAC'
                  }}
                  className='group bg-[#F2FAF4] border border-[#E1F3E6] rounded-2xl px-6 py-4.5 sm:px-7 sm:py-5 transition-all duration-200 cursor-pointer select-none'
                  onClick={() => toggleFaq(index)}
                >
                  <div
                    className={`flex justify-between gap-4 transition-all ${isOpen ? 'items-start' : 'items-center'}`}
                  >
                    <div className='flex-1'>
                      <h3 className='font-bold text-sm sm:text-base text-[#101611] tracking-tight group-hover:text-[#008736] transition-colors'>
                        {faq.q}
                      </h3>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                            className='overflow-hidden'
                          >
                            <p className='text-xs sm:text-sm text-[#4B5563] leading-relaxed font-normal pt-1'>
                              {faq.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Circular Green Icon Button */}
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className={`flex-shrink-0 w-6 h-6 rounded-full bg-[#00A651] text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-110 transition-transform select-none ${
                        isOpen ? 'mt-0.5' : ''
                      }`}
                    >
                      <span className='leading-none select-none'>{isOpen ? '−' : '+'}</span>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
