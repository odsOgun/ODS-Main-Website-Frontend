import { useEffect, useState } from 'react';
import Nav from '@/components/local/nav';
import { HeartIcon, PersonIcon, ConcentricCirclesIcon, StarIcon } from '@/assets/icons';
import HeroImg from '@/assets/img/about-hero.png';
import MapImage from '@/assets/img/about-one.png';
import Image2 from '@/assets/img/about-two.png';
import Image3 from '@/assets/img/about-3.png';
import Image4 from '@/assets/img/about-4.png';
import Image5 from '@/assets/img/about-5.png';
import Image6 from '@/assets/img/about-6.png';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Sitelinks from '@/mock/sitelinks.json';
import { ArrowRight } from '@/assets/icons';
import MobileApp from '@/components/local/mobileApp';
import Footer from '@/components/local/footer';
import hero2 from '@/assets/img/hero2.png';
import hero3 from '@/assets/img/hero3.png';
import { Link } from 'react-router-dom';
const items = [
  {
    icon: HeartIcon,
    title: '7,500+ Inspired Minds',
    description:
      'Over the past three years, more than 6,000 participants have joined our summit, each one leaving with the inspiration, knowledge, and connections needed to pursue careers in the digital technology sector. '
  },
  {
    icon: PersonIcon,
    title: 'Quadrupling Talent',
    description:
      'The digital talent ecosystem in Ogun State has seen unprecedented growth, with the number of tech professionals quadrupling since our first summit in 2020. This surge in talent is a direct result of the opportunities and networks created through our events.'
  },
  {
    icon: ConcentricCirclesIcon,
    title: 'Community Empowerment',
    description:
      'We believe that technology should be accessible to everyone, regardless of where they live. In line with this belief, we established a digital economy station in the Isara community, valued at over 8 million naira. This state-of-the-art facility provides local students with early exposure to computers and IT, opening up new avenues for learning and growth.'
  },
  {
    icon: StarIcon,
    title: 'Startup Success',
    description:
      'Our summit has been a fertile ground for innovative ideas, connecting startup founders with visionary investors. These collaborations have led to groundbreaking projects and startups that are now making waves in the industry.'
  }
];

const carouselItems = [
  { img: Image3, alt: 'Workshops' },
  { img: Image4, alt: 'Isara Digital Economy Station' },
  { img: Image5, alt: 'Investor-Startup Collaborations' },
  { img: Image6, alt: 'Trainings' }
];

const journeyItems = [
  {
    title: 'ODS 2024: Innovation: Pathway to our Nation’s Prosperity',
    bgColor: '#E5E9EC',
    points: [
      'Experts discussed sustainable innovation and the future of technology.',
      '50+ startups connected with investors, leading to successful partnerships.',
      'Expanded outreach programs, introducing tech to underserved communities.'
    ]
  },
  {
    title: 'ODS 2023 : Innovating Beyond Boundaries : Exploring AI and Web 2 Evolutionary Impact',
    bgColor: '#EDFEE5',
    points: [
      'Experts discussed the impact of AI and and web 3 in our daily lives',
      'Startups connected with VCs and Investors in a closed door meeting',
      'Industry experts shared their stories on building startups in the 21st century.'
    ]
  },
  {
    title: 'ODS 2022 : Digital Technology : Key to Sustainable Future',
    bgColor: '#E5EEFE',
    points: [
      'Keynote delivered by Eng. Noimot Salako Oyedele, Deputy Governor of Ogun State',
      'Industry leaders discussed utilizing social media as a tool for business/startup growth',
      'Built ICT digital station worth NGN 10 million to give pupils in local community access to tech'
    ]
  },
  {
    title: 'ODS 2021 : Competency for the future',
    bgColor: '#FEF5E5',
    points: [
      'Focus was on the future of work and how to best prepare ahead',
      'Global Leaders discussed how to prepare for global opportunities',
      'Leaders discussed the do’s and don’t when it comes to building startup in Africa'
    ]
  },
  {
    title: 'ODS 2020 : Building the tech ecosystem in Ogun : Way Forward',
    bgColor: '#FEE5E5',
    points: [
      'Launched the first edition of Ogun Digital Summit laying the foundation for a digital revolution.',
      'Experts discussed how to harness the opportunities in the state based on the available tertiary institutions.',
      'Brought together talents, creatives and tech entrepreneurs for the first time in Ogun State'
    ]
  }
];
const images = [
  { src: HeroImg, alt: 'Hero Image' },
  { src: hero2, alt: 'Image 1' },
  { src: hero3, alt: 'Image 2' }
];

function About() {
  const [showNav, setShowNav] = useState(false);

  const handleScroll = () => {
    const currentScrollPos = window.scrollY;

    if (currentScrollPos === 0) setShowNav(false);
    else setShowNav(true);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <div className='h-screen'>
        <div
          className={`bg-white w-full max-md:px-5 fixed ${showNav ? 'top-0' : '-top-20'} z-50
           transition-all duration-200 ease-linear`}
        >
          <Nav />
        </div>
        <div
          className={`${showNav ? 'scale-90' : 'scale-100'} transition-all duration-200 ease-linear`}
        >
          <div
            className='w-full h-screen bg-red-50'
            // style={{ backgroundImage: `url(${HeroImg})`, backgroundPosition: 'center' }}
            style={{
              backgroundImage: `url(${images[currentIndex].src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>

          <div className='md:w-1/2  absolute bottom-16 md:left-28'>
            <h1 className='md:text-[60px] md:leading-[64px] platypi-gf text-white font-semibold text-4xl p-6'>
              <span className='font-normal italic'>About Us: </span>Shaping The Future Tech
              Landscape
            </h1>
          </div>
        </div>
      </div>
      <div className='bg-[#101611]'>
        <div className='max-w-[1120px] w-full px-8 mx-auto py-20 xl:box-content'>
          <div className='md:py-20 flex justify-between flex-col md:flex-row'>
            <div className='md:w-1/2'>
              <h2 className='text-2xl font-semibold text-[#F2F9FF] md:text-4xl platypi-gf'>
                Our Story
              </h2>
              <p className='text-base font-normal tracking-[0.2px] text-[#B0C5D6] my-5'>
                Ogun Digital Summit started in 2020 with a strong focus on building and shaping the
                tech ecosystem development in Ogun State and this was inspired based on the need to
                bring together tech talents, creatives, entrepreneurs, investors and ecosystem
                players under one roof. Through previous editions, the Ogun Digital Summit has
                ignited a fire within the hearts of more than 7,500+ individuals, propelling them to
                not only forge careers in the digital technology sector but also to harness the
                power of technology in tackling significant challenges, thereby revolutionizing our
                digital economy.
              </p>
            </div>
            <img src={MapImage} alt='map' className='md:w-[285px] md:h-[248px] py-8 md:py-0' />
          </div>
          <div className='md:mt-20 mt-0'>
            <div className='relative flex flex-col-reverse md:h-[700px]'>
              <div className='md:w-[747px] md:h-[498px] md:absolute rounded-xl md:my-auto md:top-[calc(100%/2-498px/2)]'>
                <img src={Image2} alt='image2' className='object-cover' />
              </div>
              <div className='bg-[#202020] text-white md:absolute md:right-0 md:w-[505px] md:p-8 p-4 md:rounded-2xl md:h-[700px] flex justify-center items-center'>
                <div>
                  <svg
                    width='106'
                    height='65'
                    viewBox='0 0 106 65'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    className='absolute opacity-15 top-0'
                  >
                    <path
                      d='M45.95 41.8501C45.7625 54.5401 35.525 64.6801 23.0675 64.5001C10.6175 64.4851 0.529999 54.2101 0.514999 41.5276V35.7526C-0.0999985 10.8976 19.1375 -9.78742 43.55 -10.4999C45.0764 -10.4841 46.534 -9.86303 47.6028 -8.77318C48.6715 -7.68332 49.264 -6.21381 49.25 -4.68742C49.25 -1.47742 46.7 1.12508 43.55 1.12508C38.026 1.22474 32.6282 2.79404 27.9118 5.67159C23.1954 8.54914 19.3307 12.6311 16.715 17.4976C16.5663 17.7592 16.5233 18.0678 16.595 18.3601C16.6293 18.5067 16.6924 18.645 16.7805 18.7671C16.8686 18.8892 16.98 18.9927 17.1084 19.0715C17.2367 19.1503 17.3793 19.2029 17.5281 19.2262C17.6768 19.2496 17.8287 19.2433 17.975 19.2076C19.8451 18.7235 21.7739 18.5038 23.705 18.5551C36.1625 18.7351 46.1225 29.1676 45.95 41.8501ZM101.555 41.1976C101.728 53.8876 91.775 64.3201 79.3175 64.5001C66.8675 64.4851 56.7725 54.2101 56.7575 41.5276V35.7526C56.15 10.8976 75.3875 -9.77992 99.8 -10.4999C101.326 -10.4841 102.784 -9.86303 103.853 -8.77318C104.922 -7.68332 105.514 -6.21381 105.5 -4.68742C105.5 -1.47742 102.95 1.12508 99.8 1.12508C94.276 1.22474 88.8782 2.79404 84.1618 5.67159C79.4454 8.54914 75.5807 12.6311 72.965 17.4976C72.8143 17.7612 72.7713 18.073 72.845 18.3676C72.8802 18.5135 72.9438 18.651 73.0323 18.7723C73.1208 18.8936 73.2323 18.9962 73.3605 19.0742C73.4887 19.1523 73.6311 19.2042 73.7795 19.2271C73.9278 19.25 74.0792 19.2434 74.225 19.2076C75.89 18.7801 77.6 18.5626 79.3175 18.5551C91.5275 18.7351 101.383 28.7626 101.555 41.1976Z'
                      fill='#ACFAAC'
                    />
                  </svg>

                  <h1 className='md:text-4xl text-2xl platypi-gf font-semibold mb-4'>
                    Letter To You
                  </h1>
                  <p className='text-[#B0C5D6] text-base leading-6 mb-4 italic'>
                    Dear Friends and Partners,
                  </p>
                  <p className='text-[#B0C5D6] text-base leading-6 mb-4 italic'>
                    Welcome to the Ogun Digital Summit. This summit began as a vision—one that seeks
                    to leverage the potential of technology to drive societal progress. Since 2020,
                    we have been on a journey to inspire, educate, and connect individuals with the
                    resources they need to make meaningful contributions to our digital economy.
                  </p>
                  <p className='text-[#B0C5D6] text-base leading-6 mb-4 italic'>
                    As the convener of this summit, I am proud of the incredible strides we have
                    made together. From empowering young minds to bridging the digital divide in
                    rural communities, our work is a testament to the power of collaboration and
                    shared purpose. But our journey is far from over. Together, we will continue to
                    push the boundaries of what is possible, shaping a future where technology is a
                    force for good in every corner of Ogun State and beyond.
                  </p>
                  <p className='text-[#B0C5D6] text-base leading-6 mb-4 italic'>
                    Thank you for being a part of this movement.
                  </p>
                  <p className='text-[#F2F9FF] text-base leading-6'>Warm regards,</p>
                  <p className='text-[#F2F9FF] text-base leading-6'>Victor Adeleye</p>
                  <p className='text-[#F2F9FF] text-base leading-6'>
                    Convener, Ogun Digital Summit
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-[1120px] w-full px-8 mx-auto md:py-20 py-8 pt-20 xl:box-content'>
        <div className='md:w-1/2'>
          <h2 className='text-2xl font-semibold text-[#23323F] md:text-4xl platypi-gf'>
            Building a Brighter Future, One Step at a Time
          </h2>
          <p className='text-base font-normal tracking-[0.2px] text-[#627587] my-5 mb-10 md:mb-5'>
            Since its inception, the Ogun Digital Summit has been a beacon of innovation and
            empowerment, leaving an indelible mark on individuals, communities, and the broader
            digital landscape. Our commitment to driving change through technology has translated
            into tangible results that continue to resonate across the region.
          </p>
        </div>
        <div className='md:grid md:grid-cols-2 md:gap-10 md:my-20'>
          {items.map((item, index) => (
            <div key={index} className=''>
              <item.icon />
              <h3 className='text-lg font-semibold text-[#23323F] mt-2'>{item.title}</h3>
              <p className='text-base font-normal tracking-[0.2px] text-[#627587] my-5'>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className='w-full mb-20'>
        <Carousel className='' opts={{ align: 'center' }}>
          <CarouselContent className='md:-ml-20'>
            {carouselItems.map((item, index) => (
              <CarouselItem key={index} className='md:pl-20'>
                <div className='md:w-[447px] w-[256px] md:h-[480px] h-[280px] rounded-xl'>
                  <img src={item.img} alt={item.alt} className='w-full h-full object-cover' />
                </div>
                <p className='text-base text-[#23323F] mt-2 italic'>{item.alt}</p>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className='bg-[#101611]'>
        <div className='max-w-[1120px] w-full px-8 mx-auto pt-20'>
          <div className='text-center md:w-1/2 mx-auto'>
            <h2 className='text-2xl font-semibold text-[#F2F9FF] md:text-4xl platypi-gf'>
              Our Journey So Far
            </h2>
            <p className='text-base font-normal tracking-[0.2px] text-[#B0C5D6] my-5'>
              Ogun Digital Summit has grown into a key player in driving the digital age change,
              connecting visionaries and empowering communities in Ogun State.
            </p>
          </div>
          <div className='mt-20'>
            {journeyItems.map((item, index) => (
              <div
                key={index}
                className={`px-10 py-6 rounded-lg my-5 last:my-0 mx-auto ${
                  [
                    'md:w-full',
                    'md:w-[calc(100%-50px)]',
                    'md:w-[calc(100%-100px)]',
                    'md:w-[calc(100%-200px)]',
                    'md:w-[calc(100%-300px)]'
                  ][index]
                }`}
                style={{ backgroundColor: item.bgColor }}
              >
                <h3 className='md:text-lg font-semibold mb-4'>{item.title}</h3>
                <ul className='list-disc md:ml-6'>
                  {item.points.map((point, index) => (
                    <li key={index} className='text-[#627587] text-sm mb-3'>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className='flex justify-center py-20'>
            <a href={Sitelinks.ourImpact} target='_blank'>
              <button className='bg-[#178A2D] font-semibold h-10 min-w-[171px] rounded-[2px] flex justify-center items-center tracking-[0.2px] text-[#23323F]'>
                <span className='text-sm font-semibold text-white'>Our Impact</span>
                <ArrowRight />
              </button>
            </a>
            {/* <a href={Sitelinks.ourImpact} target='_blank'> */}
            <Link to='/statistics'>
              <button className='bg-transparent font-semibold h-10 min-w-[171px] rounded-[2px] flex justify-center items-center tracking-[0.2px] text-[#23323F] border border-[#ffff] ml-5'>
                <span className='text-sm font-semibold text-white'>Our Statistics</span>
                <ArrowRight />
              </button>
            </Link>
            {/* </a> */}
          </div>
        </div>
      </div>
      {/* <div className=''>
        <div className='max-w-[1120px] w-full px-8 mx-auto py-20'>
          <WhatToLookForwardTo />
        </div>
      </div> */}
      <MobileApp />
      <Footer />
    </div>
  );
}

export default About;
