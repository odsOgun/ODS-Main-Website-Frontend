import { ArrowRight } from '@/assets/icons';
import FireIcon from '@/assets/svgs/fire.svg';
import NorthAmericaIcon from '@/assets/svgs/northAmerica.svg';
import CodeIcon from '@/assets/svgs/code.svg';
import RocketIcon from '@/assets/svgs/rocket.svg';
import One from '@/assets/img/one.png';
import Two from '@/assets/img/two.png';
import Three from '@/assets/img/three.png';
import ContectTrack from './contectTrack';

const cardItems = [
  {
    icon: FireIcon,
    title: 'Access to Industry Experts',
    description:
      'You can directly and indirectly learn and engage with industry experts, offering valuable opportunities to gain deeper insights into your areas of interest'
  },
  {
    icon: NorthAmericaIcon,
    title: 'Connect and network',
    description:
      'We bring together the best talents in Nigeria tech ecosystem to create opportunities for professional growth and aid collaboration and partnerships.'
  },
  {
    icon: CodeIcon,
    title: 'Discover new technology trends',
    description:
      'The world is growing at a very fast pace with new technologies like AI and blockchain having a strong effect on our daily lives. We analyze and help you on how to best adapt for these changes'
  },
  {
    icon: RocketIcon,
    title: 'Have Fun and Unwind',
    description:
      'Our ambience and environment provides the right avenue and space to regain motivation and energy not just to grow your talent but to innovate and create new ideas.'
  }
];

function SectionOne() {
  return (
    <div className='bg-foreground'>
      <div className='max-w-[1120px] w-full px-8 mx-auto py-20 xl:box-content'>
        <div className='max-w-[420px]'>
          <h1 className='text-2xl font-semibold text-white md:text-4xl platypi-gf'>
            Our numbers in the last 5 years.
          </h1>
          <p className='text-base font-normal tracking-[0.2px] text-[#B0C5D6] my-5'>
            It all started with a dream in 2019 to bring together startup entrepreneurs, talents,
            creatives and founders with a strong focus to promote youth empowerment, tech
            entrepreneurship and social innovation.
          </p>
          <div className='flex gap-[10px]'>
            <a
              href='/register/sponsors'
              className='bg-[#ACFAAC] font-semibold h-10 min-w-[171px] rounded-[2px] flex justify-center items-center tracking-[0.2px] text-[#23323F]'
            >
              <span className='text-sm font-semibold'>Become a Sponsor</span>
              <ArrowRight fill='#23323F' />
            </a>
            <a href='/statistics'>
              <button className='bg-inherit font-semibold h-10 min-w-[171px] rounded-[2px] flex justify-center items-center tracking-[0.2px] text-[#ACFAAC]'>
                <span className='text-sm font-semibold'>View Our Statistics</span>
                <ArrowRight fill='#ACFAAC' />
              </button>
            </a>
          </div>
        </div>

        <div className='flex flex-col items-end w-full gap-8 py-20 md:flex-row'>
          <div className='md:w-1/3 md:h-2/3'>
            <img src={One} alt='one' />
          </div>
          <div className='md:w-1/3'>
            <img src={Three} alt='three' />
          </div>
          <div className='md:w-1/3 md:h-2/3'>
            <img src={Two} alt='two' />
          </div>
        </div>

        <div className='flex justify-between w-full bg-[#0E140F] p-6 overflow-hidden'>
          <h2 className='flex items-center gap-4 font-semibold text-white md:text-5xl'>
            9000+<span className='text-sm tracking-[3px]'>ATTENDEES</span>
          </h2>
          <h2 className='flex items-center gap-4 font-semibold text-white md:text-5xl'>
            65+<span className='text-sm tracking-[3px]'>SPEAKERS</span>
          </h2>
          <h2 className='flex items-center gap-4 font-semibold text-white md:text-5xl'>
            30+<span className='text-sm tracking-[3px]'>SESSIONS</span>
          </h2>
        </div>
      </div>
      <ContectTrack />
      <div className='max-w-[1120px] w-full px-8 mx-auto py-20 xl:box-content'>
        <div className='py-20'>
          <div className='md:w-1/2 md:mx-auto'>
            <h2 className='text-2xl font-semibold text-center text-white md:text-4xl platypi-gf'>
              We've made a real impact in people's lives.
            </h2>
            <p className='text-base font-normal tracking-[0.2px] text-[#B0C5D6] my-5 text-center'>
              Watch a glimpse of how we improved the lives of pupils in the local community and gave
              them access to ICT.
            </p>
          </div>

          <div className='h-[286px] md:h-[432px] w-full max-w-[900px]  mt-20 rounded-xl mx-auto'>
            <iframe
              frameBorder='0'
              width='100%'
              height='100%'
              src='https://www.youtube.com/embed/E5Y0KjFYG2Q?si=QKgVbHYpcPqsoGtk&amp;controls=0'
              title='YouTube video player'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              referrerPolicy='strict-origin-when-cross-origin'
              allowFullScreen
            ></iframe>
          </div>

          <div>
            <div className='max-w-[670px] md:mt-[100px] mt-[80px]'>
              <h1 className='text-2xl font-semibold text-white md:text-4xl platypi-gf'>
                Why thousands of young individuals attend Ogun Digital Summit annually.
              </h1>
              <p className='text-base font-normal tracking-[0.2px] text-[#B0C5D6] my-5'>
                Ogun Digital Summit is the global tech ecosystem - where visionaries, tech talents,
                entrepreneurs, investors and enterprise tech leaders come together in the right
                balance to accelerate the infinite cycle of tech innovation.
              </p>
            </div>

            <div className='flex flex-col gap-8 py-20 md:flex-row'>
              {cardItems.map(({ icon, title, description }, index) => (
                <div key={index} className=''>
                  <img src={icon} alt={title} />
                  <h3 className='mt-2 mb-4 text-base font-semibold text-white'>{title}</h3>
                  <p className='text-[#B0C5D6] text-sm'>{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SectionOne;
