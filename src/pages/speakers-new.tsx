import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Nav from '@/components/local/nav';
import Footer from '@/components/local/footer';
import MobileApp from '@/components/local/mobileApp';

const currentSpeakers = [
  {
    name: 'Fola Olatunji-David',
    title: 'Founding Partner, Kickoff Africa',
    image: '/fola.jpg',
    bg: 'bg-[#00a65a]'
  },
  {
    name: 'Seyi Ademeso (Meshkiey)',
    title: 'Content Creator & Strategist | Co-Founder, Udu Media',
    image: '/seyi.jpeg',
    bg: 'bg-[#00a3e0]'
  },
  {
    name: 'Joseph Onaolapo (JayOnAir)',
    title: 'Media Personality and Founder, Work Culture',
    image: '/joseph.jpeg',
    bg: 'bg-[#462d7a]'
  },
  {
    name: 'Sulaimon Adebayo (Pooja)',
    title: 'Founder, Pooja Media and Communications',
    image: '/sulaimon.png',
    bg: 'bg-[#151B19]'
  },
  { name: 'Dafe Richards', title: 'Content Creator', image: '/Dafe.JPEG', bg: 'bg-[#4a3aff]' },
  { name: 'Idris Olubisi', title: 'Founder, Web3Afrika', image: '/idiris.jpg', bg: 'bg-[#4A514F]' },
  {
    name: 'Ayodeji Awosika',
    title: 'Founder, Web3 Bridge',
    image: '/Rectangle 240662484 (6).png',
    bg: 'bg-[#12a159]'
  },
  {
    name: 'Adebayo Adewole',
    title: 'Founder, Ninelm Technologies (LRR) | CTO, CAPP Nigeria',
    image: '/adebayo.pdf',
    bg: 'bg-[#e24c4c]'
  },
  { name: 'Dára Sobaloju', title: 'Founder of Pewbeam', image: '/Dara3.jpg', bg: 'bg-[#e24c4c]' }
];

const pastSpeakers = [
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

export default function SpeakersNewPage() {
  return (
    <main className='min-h-screen bg-[#fcfdfa] overflow-hidden pt-16'>
      {/* Sticky Nav */}
      <div className='bg-white w-full max-md:px-5 fixed top-0 z-50'>
        <Nav />
      </div>

      {/* Hero Section */}
      <section className='relative min-h-[70vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-20 bg-black'>
        <div className='absolute inset-0 z-0'>
          <img
            src='/IMG_0919 1.png'
            alt='Hero background'
            className='w-full h-full object-cover opacity-40'
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
            [ SPEAKERS // OGUN DIGITAL SUMMIT 2025 ]
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className='text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-8 tracking-tight leading-tight'
          >
            The Voices Shaping
            <br />
            Africa's Digital Future
          </motion.h1>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className='px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors shadow-xl text-lg'
          >
            Meet our Speakers
          </motion.button>
        </motion.div>
      </section>

      {/* Marquee Section */}
      <section className='bg-black py-4 overflow-hidden'>
        <div className='flex whitespace-nowrap animate-marquee text-white text-sm font-semibold tracking-wider'>
          {Array(4)
            .fill('Nov 20, 2025 • June 12 cultural centre, Kuto, Abeokuta Ogun state // ')
            .map((text, i) => (
              <span key={i} className='mx-2'>
                {text}
              </span>
            ))}
        </div>
      </section>

      {/* Checkerboard Pattern */}
      <div className='relative w-full z-20'>
        <div className='absolute top-0 left-0 w-24 h-24 flex flex-col'>
          <div className='flex h-12'>
            <div className='w-12 h-12 bg-transparent'></div>
            <div className='w-12 h-12 bg-black'></div>
          </div>
          <div className='flex h-12'>
            <div className='w-12 h-12 bg-black'></div>
            <div className='w-12 h-12 bg-transparent'></div>
          </div>
        </div>
        <div className='absolute top-0 right-0 w-24 h-24 flex flex-col'>
          <div className='flex h-12'>
            <div className='w-12 h-12 bg-black'></div>
            <div className='w-12 h-12 bg-transparent'></div>
          </div>
          <div className='flex h-12'>
            <div className='w-12 h-12 bg-transparent'></div>
            <div className='w-12 h-12 bg-black'></div>
          </div>
        </div>
      </div>

      {/* 2025 Speakers Lineup */}
      <section className='py-24 px-4 max-w-7xl mx-auto text-center'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='mb-16'
        >
          <p className='text-[#00a65a] font-bold tracking-widest text-xs mb-4 uppercase'>
            [ ODS 2025 SPEAKERS LINEUP ]
          </p>
          <h2 className='text-3xl md:text-5xl font-extrabold mb-6 text-gray-900'>
            Meet our Speakers
          </h2>
          <p className='text-gray-600 text-lg max-w-2xl mx-auto font-medium'>
            We're bringing together a remarkable group of bold innovators and doers from across
            Africa.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {currentSpeakers.map((speaker, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`${speaker.bg} text-white pt-6 px-6 pb-6 relative overflow-hidden group flex flex-col items-center justify-end h-80 shadow-lg`}
            >
              <div className='absolute top-6 left-6 text-left z-20'>
                <h3 className='font-extrabold text-xl mb-1'>{speaker.name}</h3>
                <p className='text-xs font-medium opacity-90 leading-tight max-w-[150px]'>
                  {speaker.title}
                </p>
              </div>
              <div className='relative w-48 h-56 z-10 mt-auto transform group-hover:scale-105 transition-transform duration-500 origin-bottom'>
                <img
                  src={speaker.image}
                  alt={speaker.name}
                  className='w-full h-full object-contain object-bottom filter grayscale group-hover:grayscale-0 transition-all duration-500'
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Past Speakers */}
      <section className='py-24 bg-[#151B19] px-4'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className='text-[#00a65a] font-bold tracking-widest text-xs mb-4 uppercase'>
                [ SPEAKERS IN THE LAST 4 YEARS ]
              </p>
              <h2 className='text-3xl md:text-5xl font-extrabold text-white'>Past Speakers</h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className='text-gray-400 max-w-md font-medium text-sm md:text-base leading-relaxed'
            >
              It all started with a dream in 2019 to bring together startup entrepreneurs, talents,
              creatives and founders with a strong focus to promote youth empowerment, tech
              entrepreneurship and social innovation.
            </motion.p>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12'>
            {pastSpeakers.map((speaker, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className='flex flex-col'
              >
                <div className='relative w-full aspect-square mb-4 bg-gray-800 overflow-hidden'>
                  <img
                    src={speaker.image}
                    alt={speaker.name}
                    className='w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500'
                  />
                </div>
                <h3 className='font-bold text-white text-sm md:text-base mb-1'>{speaker.name}</h3>
                <p className='text-xs text-gray-400'>{speaker.title}</p>
              </motion.div>
            ))}
          </div>

          <div className='flex justify-center'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link
                to='/speakers/past'
                className='px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors inline-flex items-center gap-2 shadow-xl'
              >
                See all past Speakers <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Diagonal Striped Border */}
      <div className='w-full h-8 bg-[repeating-linear-gradient(-45deg,#dcf5cc,#dcf5cc_10px,#bfe6a3_10px,#bfe6a3_20px)] opacity-50'></div>

      <MobileApp />
      <Footer />
    </main>
  );
}
