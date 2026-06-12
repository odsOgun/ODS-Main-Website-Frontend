import Nav from '@/components/local/nav';
import HeroImg from '@/assets/img/speaker-hero.png';
import speaker1 from '@/assets/img/Speaker1.png';
import speaker2 from '@/assets/img/speaker2.png';
import speaker3 from '@/assets/img/speaker3.png';
import speaker4 from '@/assets/img/speaker4.png';
import speaker5 from '@/assets/img/speaker5.png';
import speaker10 from '@/assets/img/speaker10.png';
import speaker7 from '@/assets/img/speaker7.png';
import speaker8 from '@/assets/img/speaker8.png';
import speaker9 from '@/assets/img/speaker9.png';
import speaker11 from '@/assets/img/speaker11.png';
import speaker12 from '@/assets/img/speaker12.png';
import speaker13 from '@/assets/img/speaker13.png';
import speaker14 from '@/assets/img/speaker14.png';
import speaker15 from '@/assets/img/speaker17.png';
import speaker17 from '@/assets/img/speaker16.png';
import speaker18 from '@/assets/img/speaker15.png';
// import master1 from '@/assets/img/master1.png';
// import master2 from '@/assets/img/master2.png';
// import master3 from '@/assets/img/master3.png';
// import master4 from '@/assets/img/master5.png';
import Guest from '@/assets/img/guest.png';
import Guest1 from '@/assets/img/guest1.png';
import Guest2 from '@/assets/img/guest2.png';
import Guest3 from '@/assets/img/guest3.png';
import Guest4 from '@/assets/img/guest4.png';
import { useEffect, useRef, useState } from 'react';
import MobileApp from '@/components/local/mobileApp';
import Footer from '@/components/local/footer';
import { ArrowRight } from '@/assets/icons';
// import { ArrowLeft } from '@/assets/icons';

const Speakers = () => {
  const whatToLookForwardItems = [
    {
      title: 'Kashifu Inuwa',
      position: 'DG, NITDA',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: speaker17
    },
    {
      title: 'Iyin Aboyeji',
      position: 'Managing Partner, Accelerate Africa',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: speaker11
    },
    {
      title: 'Mohammed Jega',
      position: 'Co-founder Domineum',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: speaker1
    },
    {
      title: 'Mayowa Kuyoro',
      position: 'Partner McKinsey',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: speaker14
    },
    {
      title: 'Salem King',
      position: 'Content Creator/Storyteller',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: speaker13
    },
    {
      title: 'Dr. Ademola Adenubi',
      position: 'Founder, EduTAMS',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: speaker15
    },

    {
      title: 'Bayo Omoboriowo',
      position: 'Founder Madhouse by tikera',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: speaker4
    },
    {
      title: 'Kiki Osinbajo',
      position: 'CEO, Ciar',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: speaker5
    },

    {
      title: 'Dr. Smile',
      position: 'Comedian',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: speaker3
    },
    {
      title: 'Dr Ajidahun Olusina',
      position: 'Co-founder tryprivhealth',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: speaker10
    },
    {
      title: 'Dr Ishola Adebayo',
      position: 'Lecturer, Tai Solarin UOE',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: speaker18
    },
    {
      title: 'Adenrele Sonariwo',
      position: 'Entrepreneur and Art curator',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: speaker7
    },
    {
      title: 'Rahaman Abiola',
      position: 'Editor-in-Chief - Legit.ng',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: speaker8
    },
    {
      title: 'Dr Gbonjubola Abiri',
      position: 'CEO, Redi-Med Services',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: speaker2
    },
    {
      title: 'Niyi Fagbemi',
      position: 'Travel Film Maker',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: speaker9
    },

    {
      title: 'Samuel Ogunyinka (Psalmist)',
      position: 'Spoken word artist',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: speaker12
    }
  ];

  // Define the types for state variables
  const [currentIndex] = useState<number>(0);
  const itemsPerPage: number = 8; // Define how many items per page
  const sectionRef = useRef<HTMLDivElement | null>(null); // Ref for the section to scroll to
  const visibleItems = whatToLookForwardItems.slice(currentIndex, currentIndex + itemsPerPage);

  // // Handle the 'Previous' button click
  // const handlePrev = (): void => {
  //   if (currentIndex - itemsPerPage >= 0 && sectionRef.current) {
  //     sectionRef.current.scrollIntoView({ behavior: 'smooth' });
  //     setCurrentIndex(currentIndex - itemsPerPage);
  //   }
  // };
  // // Handle the 'Next' button click
  // const handleNext = (): void => {
  //   const totalItems: number = 10; // Example total items
  //   if (currentIndex + itemsPerPage < totalItems && sectionRef.current) {
  //     sectionRef.current.scrollIntoView({ behavior: 'smooth' });
  //     setCurrentIndex(currentIndex + itemsPerPage);
  //   }
  // };
  // const Master = [
  //   {
  //     title: 'Omolara Dada',
  //     position: 'Growth Lead, Anchor',
  //     description:
  //       'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
  //     image: master1
  //   },
  //   {
  //     title: 'Sodiq Akinjobi',
  //     position: 'Developer Ecostystem CM at google',
  //     description:
  //       'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
  //     image: master2
  //   },
  //   {
  //     title: 'Kutaje O. Joseph',
  //     position: 'UX design mentor, Designlab ',
  //     description:
  //       'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
  //     image: master3
  //   },
  //   {
  //     title: 'Ibiniyi Obikoya',
  //     position: 'Tech Lead, Korapay',
  //     description:
  //       'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
  //     image: master4
  //   }
  // ];

  const [showNav, setShowNav] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showModal] = useState<number | null>(null);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(window.innerWidth <= 768);
  const handleScroll = () => {
    const currentScrollPos = window.scrollY;
    setShowNav(currentScrollPos > 0);
  };
  const handleResize = () => {
    setIsSmallScreen(window.innerWidth <= 500);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      {/* Navigation and Hero Section */}
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
            style={{
              backgroundImage: `url(${HeroImg})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover'
            }}
          ></div>

          <div className='md:w-[55%] md:leading-[64px] absolute bottom-16 md:left-28'>
            <h1 className='md:text-[60px] platypi-gf md:leading-[64px] text-white font-semibold text-4xl p-6'>
              <span className='font-normal italic'></span> Speakers Lineup:
            </h1>
            <p className='text-[#B0C5D6] inter-gf text-base leading-6 pl-6'>
              We're bringing together a remarkable group of bold innovators and doers from across
              Africa, spanning industries such as entertainment, technology, agriculture, the
              creative sector, finance, and policy-making.
            </p>
          </div>
        </div>
      </div>
      <section
        ref={sectionRef}
        // className={`py-10 sm:py-[160px] relative  ${showModal !== null ? 'bg-[#101611B2] opacity-7' : ''}`}
        className={`   ${showModal !== null ? 'bg-[#101611B2] opacity-7' : ''}`}
      >
        <div
          // className={` relative m-auto w-[90%] lg:w-[1280px] sm:grid md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 grid-rows-1  justify-between gap-[24px] md:flex-row  transition-all duration-300 translate-x-  ease-in-out ${showModal ? '' : ''}`}
          className={` relative m-auto w-[90%] lg:w-[1280px] sm:grid md:grid-cols-3 lg:grid-cols-4    justify-between gap-[24px] md:flex-row  transition-all duration-300 translate-x-  ease-in-out ${showModal ? '' : ''}`}
        >
          {(isSmallScreen ? visibleItems.slice(0, 2) : visibleItems).map((item, index) => (
            <div
              key={index}
              className={`relative rounded-2xl h-[360px] lg:max-w-[300px] w-auto overflow-hidden sm:mb-0 mb-[16px] cursor-pointer transition-transform transform ${showModal === index ? 'w-[475px] h-[456px] absolute z-30 bg-white pt-[56px] ' : 'h-[360px] w-[300px]'}`}
              style={{
                backgroundImage: showModal === index ? 'none' : `url(${item.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`h-[200px] w-[447px] rounded-md mx-auto   ${showModal === index ? 'block' : 'hidden'}`}
                style={{
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              ></div>
              <div
                className={`absolute bottom-0 w-full p-6 ${showModal === index ? ' ' : 'bg-[#101611]'} text-white transition-all duration-300 ease-in-out ${
                  hoveredIndex === index
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-full'
                }`}
              >
                <h1 className='font-semibold text-base text-[#F2F9FF] mb-2'>{item.title}</h1>
                <p className='text-sm leading-6 text-[#B0C5D6]'>{item.position}</p>
                <p
                  className={`text-sm leading-6 text-[#B0C5D6] ${showModal === index ? 'block' : 'hidden'} `}
                >
                  {item.description}
                </p>
                {/* <span
                  className={`flex items-center text-[12px] leading-6 text-[#ACFAAC]  ${showModal === index ? "hidden" : "block"}`}
                  onClick={() => setShowModal(index)}
                >
                  Read More
                  <ArrowRightGreen />
                </span> */}
              </div>
            </div>
          ))}
          <div className='absolute top-0 left-0 w-full h-full bg-[#000000] backdrop-blur-lg bg-opacity-60  sm:rounded-xl '>
            <div className=' h-2/10 sm:max-w-[458px] m-auto flex flex-col justify-center absolute top-[40%]  lg:left-1/3'>
              <h1 className='font-semibold text-[40px] leading-10 platypi-gf text-[#FFFFFF] text-center '>
                Coming soon...
              </h1>
              <p className='text-[16px] leading-6 font-normal text-[#FFFFFF] mt-4 text-center inter-gf'>
                Exciting news! Stay tuned as we unveil the incredible speakers for the Ogun Digital
                Summit 2026.
              </p>
            </div>
          </div>
        </div>

        {/* <div className='flex justify-center items-center gap-6 mt-10  sm:mt-[64px]'>
          <span
            className={`rounded-full flex justify-center items-center bg-[#CDD5DC] h-[56px] w-[56px] transform -translate-y-1/2 cursor-pointer${
              currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handlePrev}
          >
            <ArrowLeft fill='#2B4155' />
          </span>
          <span
            className={`rounded-full bg-[#CDD5DC] flex justify-center items-center h-[56px] w-[56px] transform -translate-y-1/2 cursor-pointer ${
              currentIndex + itemsPerPage >= whatToLookForwardItems.length
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
            onClick={handleNext}
          >
            <ArrowRight fill='#2B4155' />
          </span>
        </div> */}
      </section>
      <section className='md:flex md:flex-row-reverse gap-20  justify-center items-center mb-8 md:mb-0 md:py-[100px] m-auto lg:ml-[160px]'>
        <div className='xl:w-[505px] xl:mx-0  mx-auto w-[90%]  md:mb-[80px] mb-[40px]'>
          <h1 className=' md:w-[358px] text-[34px] platypi-gf leading-10 font-semibold text-[#23323F] md:text-4xl platypi-gf'>
            Our speakers in the last 6 years.
          </h1>
          <p className='text-base font-normal tracking-[0.2px] text-[#627587] my-5'>
            It all started with a dream in 2020 to bring together startup entrepreneurs, talents,
            creatives and founders with a strong focus to promote youth empowerment, tech
            entrepreneurship and social innovation.
          </p>
          <a href='/past-speaker'>
            <button className='bg-[#178A2D] font-semibold h-10 min-w-[190px] rounded-[2px] flex justify-center items-center tracking-[0.2px] text-[#23323F]'>
              <span className='text-sm text-[#ffff] font-semibold'>View past Speakers</span>
              <ArrowRight fill='#ffff ' />
            </button>
          </a>
        </div>
        <div>
          <div className=' '>
            <div className='xl:w-[535px] xl:m-0 w-[95%] sm:block hidden mx-auto'>
              <img src={Guest} alt='one' />
            </div>
            <div className='flex flex-col justify-center sm:hidden items-center gap-[19px] w-[90%] mx-auto'>
              <div className='w-auto'>
                <img src={Guest1} alt='one' />
              </div>
              <div className='w-auto'>
                <img src={Guest2} alt='one' />
              </div>
              <div className='w-auto'>
                <img src={Guest3} alt='one' />
              </div>
              <div className='w-auto'>
                <img src={Guest4} alt='one' />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <section className={``}>
        <div className=' mx-auto flex flex-col gap-4 w-full max-w-[335px] md:max-w-[558px] md:mb-[80px] mb-[40px] '>
          <h3 className='platypi-gf text-center text-[#23323F] font-semibold text-2xl leading-[34px] tracking-[-0.5px] md:text-[40px] md:leading-[48px] md:tracking-[-1px]  changeFont-wh213o '>
            Masterclass Trainers
          </h3>
          <p className='text-center text-[#627587] text-sm leading-[22px] tracking-[0.2px] font-normal md:text-base  '>
            Meet our masterclass trainers who will help us train young individuals at ODS. It’s free
            and we don’t charge anyone for this.
          </p>
        </div>
        <div
          className={`md:flex flex-row justify-center  items-center gap-[19px] md:w-[80%] w-{90%} mx-auto`}
        >
          {Master.map((item, index) => (
            <div
              key={index}
              className={`relative rounded-2xl h-[360px] md:w-[300px] w-[90%] md:m-0 mb-[16px] mx-auto  overflow-hidden cursor-pointer transition-transform transform ${showModal === index ? 'w-[475px] h-[456px] absolute z-30 bg-white pt-[56px] ' : 'h-[360px] w-[300px]'}`}
              style={{
                backgroundImage: showModal === index ? 'none' : `url(${item.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`h-[200px] w-[447px] rounded-md mx-auto ${showModal === index ? 'block' : 'hidden'}`}
                style={{
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              ></div>
              <div
                className={`absolute bottom-0 w-full p-6 ${showModal === index ? ' ' : 'bg-[#101611]'} text-white transition-all duration-300 ease-in-out ${
                  hoveredIndex === index
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-full'
                }`}
              >
                <h1 className='font-semibold text-base text-[#F2F9FF] mb-2'>{item.title}</h1>
                <p className='text-sm leading-6 text-[#B0C5D6]'>{item.position}</p>
                <p
                  className={`text-sm leading-6 text-[#B0C5D6] ${showModal === index ? 'block' : 'hidden'} `}
                >
                  {item.description}
                </p>
                
              </div>
            </div>
          ))}
        </div>
      </section> */}
      <MobileApp />
      <Footer />
    </div>
  );
};

export default Speakers;
