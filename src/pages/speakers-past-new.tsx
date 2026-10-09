import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Nav from '@/components/local/nav';
import Footer from '@/components/local/footer';
import MobileApp from '@/components/local/mobileApp';

const allSpeakers = [
  {
    name: 'Salem King',
    title: 'Content Creator, Storyteller',
    image: '/Rectangle 24066248511.png'
  },
  { name: 'Kiki Osinbajo', title: 'CEO, Glam', image: '/Rectangle 240662485 (11).png' },
  {
    name: 'Kashifu Inuwa',
    title: 'Director General NITDA',
    image: '/Rectangle 240662485 (12).png'
  },
  { name: 'Dr Ishola Adebayo', title: 'Founder, ODS/TCN', image: '/Rectangle 240662485 (13).png' },
  { name: 'Olabamisi Pelewuro', title: 'Product Manager', image: '/Rectangle 240662485.png' },
  {
    name: 'Harrison Obafemi',
    title: 'Co-host, Founders HQ',
    image: '/Rectangle 240662485 (1).png'
  },
  {
    name: 'Odunayo Eweniyi',
    title: 'Co-founder, Piggyvest',
    image: '/Rectangle 240662485 (2).png'
  },
  {
    name: 'Yonda Adekunle',
    title: 'Product Marketing, Binance',
    image: '/Rectangle 240662485 (3).png'
  },
  { name: 'Joshua Chizoba', title: 'Co-founder, Paystack', image: '/Rectangle 240662484 (8).png' }
];

const testimonials = [
  {
    text: "ODS gave me endless hours of pure value... I'm highly recommending attending your life stage at any point you possibly can. It opened my eyes to so much more in tech.",
    name: 'Pelumi Morakinyo',
    role: 'Product Designer',
    image: '/ceo.png'
  },
  {
    text: 'ODS was a transformative experience. It taught me so much and challenged my thinking, pushed me past my usual limit. I met so many incredible people in the space.',
    name: 'Pelumi Morakinyo',
    role: 'Product Designer',
    image: '/ceo.png'
  },
  {
    text: "ODS has been a massive net positive for my tech journey. I have met incredible folks and gotten to really tap into a community I didn't even know I had access to.",
    name: 'Pelumi Morakinyo',
    role: 'Product Designer',
    image: '/ceo.png'
  }
];

export default function SpeakersPastNewPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(allSpeakers.length / itemsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(0, prev - 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));

  const currentSpeakers = allSpeakers.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <main className='min-h-screen bg-[#fcfdfa] overflow-hidden pt-16'>
      {/* Sticky Nav */}
      <div className='bg-white w-full max-md:px-5 fixed top-0 z-50'>
        <Nav />
      </div>

      {/* Hero Section */}
      <section className='relative min-h-[60vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-20 bg-black'>
        <div className='absolute inset-0 z-0'>
          <img
            src='/IMG_0919 1.png'
            alt='Hero background'
            className='w-full h-full object-cover opacity-30'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent' />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className='relative z-10 max-w-4xl mx-auto flex flex-col items-center mt-12 mb-20'
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className='text-white font-bold tracking-widest text-sm mb-6 uppercase'
          >
            [ ODS 2019 TO 2024 ]
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className='text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight'
          >
            Celebrating the voices
            <br />
            that shaped our journey
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className='text-gray-300 max-w-2xl font-medium text-sm md:text-base leading-relaxed'
          >
            Over the years, Ogun Digital Summit has hosted innovators, policymakers, and industry
            leaders shaping Africa's digital future.
          </motion.p>
        </motion.div>
      </section>

      {/* Grid Section */}
      <section className='py-24 px-4 max-w-7xl mx-auto'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6'>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className='text-[#00a65a] font-bold tracking-widest text-xs mb-4 uppercase'>
              [ PAST SPEAKERS ]
            </p>
            <h2 className='text-3xl md:text-5xl font-extrabold text-[#151B19]'>
              Our inspiring Speakers
              <br />
              in the Past 4 Years
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className='text-gray-500 max-w-md font-medium text-sm md:text-base leading-relaxed'
          >
            It all started with a dream in 2019 to bring together startup entrepreneurs, talents,
            creatives and founders with a strong focus to promote youth empowerment, tech
            entrepreneurship and social innovation.
          </motion.p>
        </div>

        {/* Filter Row */}
        <div className='flex flex-col md:flex-row justify-between items-center mb-12 gap-4 border-b border-gray-200 pb-4'>
          <h3 className='text-2xl font-bold text-gray-400'>ODS 2024: The Future of Work in Tech</h3>
          <button className='bg-[#00a65a] text-white px-6 py-2.5 rounded-md flex items-center gap-2 font-bold hover:bg-green-600 transition-colors shadow-lg'>
            ODS 2024 <ChevronDown size={18} />
          </button>
        </div>

        {/* Speakers Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 min-h-[350px]'>
          {currentSpeakers.map((speaker, index) => (
            <motion.div
              key={speaker.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className='flex flex-col group cursor-pointer'
            >
              <div className='relative w-full aspect-square mb-4 bg-gray-100 overflow-hidden rounded-sm'>
                <img
                  src={speaker.image}
                  alt={speaker.name}
                  className='w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105'
                />
              </div>
              <h3 className='font-bold text-[#151B19] text-lg mb-1'>{speaker.name}</h3>
              <p className='text-sm font-medium text-gray-500'>{speaker.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <div className='flex justify-center items-center gap-4'>
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors ${
              currentPage === 0
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-[#00a65a] text-[#00a65a] hover:bg-green-50 cursor-pointer'
            }`}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-lg ${
              currentPage === totalPages - 1
                ? 'bg-gray-200 text-gray-400 shadow-none cursor-not-allowed'
                : 'bg-[#00a65a] text-white hover:bg-green-600 shadow-green-500/30 cursor-pointer'
            }`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='relative py-24 px-4 bg-[#151B19] overflow-hidden'>
        <div
          className='absolute inset-0 z-0 opacity-20 pointer-events-none'
          style={{
            backgroundImage:
              'linear-gradient(to right, #00a65a 1px, transparent 1px), linear-gradient(to bottom, #00a65a 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            transform: 'perspective(1200px) rotateX(70deg) scale(2) translateY(-10%)',
            transformOrigin: 'top center'
          }}
        />
        <div
          className='absolute inset-0 z-0 opacity-20 pointer-events-none'
          style={{
            backgroundImage:
              'linear-gradient(to right, #00a65a 1px, transparent 1px), linear-gradient(to bottom, #00a65a 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            transform: 'perspective(1200px) rotateX(-70deg) scale(2) translateY(10%)',
            transformOrigin: 'bottom center'
          }}
        />
        <div className='absolute inset-0 bg-gradient-to-b from-[#151B19] via-[#151B19]/60 to-[#151B19] z-0 pointer-events-none' />

        <div className='relative z-10 max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='text-[#00a65a] font-bold tracking-widest text-xs mb-4 uppercase'
            >
              [ WHAT PAST ATTENDEES HAVE TO SAY ]
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className='text-3xl md:text-5xl font-extrabold text-white'
            >
              See how ODS has inspired and
              <br />
              transformed attendees
            </motion.h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className='bg-white rounded-2xl p-8 shadow-xl flex flex-col'
              >
                <p className='text-gray-600 font-medium leading-relaxed mb-8 flex-grow text-sm'>
                  "{testimonial.text}"
                </p>
                <div className='flex items-center gap-4'>
                  <div className='relative w-12 h-12 rounded-full overflow-hidden bg-gray-200'>
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <div>
                    <h4 className='font-bold text-[#151B19] text-sm'>{testimonial.name}</h4>
                    <p className='text-xs text-gray-500 font-medium'>{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Back link */}
      <div className='bg-[#fcfdfa] py-8 flex justify-center'>
        <Link
          to='/speakers'
          className='text-[#00a65a] font-bold hover:underline flex items-center gap-2'
        >
          ← Back to Speakers
        </Link>
      </div>

      <MobileApp />
      <Footer />
    </main>
  );
}
