import Nav from '@/components/local/nav';
import HeroImg from '@/assets/img/past-speaker-hero.png';
import olubunmi from '@/assets/img/past-speaker/olubunmi.png';
import harrison from '@/assets/img//past-speaker/harrison.png';
import ibikun from '@/assets/img/past-speaker/ibikun.png';
import Joshua from '@/assets/img//past-speaker/joshua.png';
import odunayo from '@/assets/img/past-speaker/odunayo.png';
// import bayo from '@/assets/img/past-speaker/bayo.png';
import fayemi from '@/assets/img/daniel-fayemi.jpg';

import tolulope from '@/assets/img/past-speaker/Tolulope.png';
import rahaman from '@/assets/img/past-speaker/rahaman.png';
import joel from '@/assets/img/past-speaker/joel.png';
import lanre from '@/assets/img/past-speaker/lanre.png';
import ilori from '@/assets/img/past-speaker/ilori.png';
import Edidiong from '@/assets/img/past-speaker/Edidiong.png';
import bolaji from '@/assets/img/past-speaker/bolaji.png';
import oluwajoba from '@/assets/img/past-speaker/Oluwajoba.png';
import mohammed from '@/assets/img/past-speaker/mohammed.png';
import freeman from '@/assets/img/past-speaker/freeman.png';
import amedu from '@/assets/img/past-speaker/amedu.png';
import abel from '@/assets/img/past-speaker/abel.png';
import blessing from '@/assets/img/past-speaker/blessing.png';
import onyeka from '@/assets/img/past-speaker/onyeka.png';
import aderenle from '@/assets/img/past-speaker/aderenle.png';
import daniel from '@/assets/img/past-speaker/daniel.png';
import raheem from '@/assets/img/past-speaker/raheem.png';
import owolabi from '@/assets/img/past-speaker/owolabi.png';
import oluwatobi from '@/assets/img/past-speaker/oluwatobi.png';
import oyeniyi from '@/assets/img/past-speaker/oyeniyi.png';
import falola from '@/assets/img/past-speaker/falola.png';
import justice from '@/assets/img/past-speaker/justice.jpeg';
import yosola from '@/assets/img/past-speaker/yosolaade.jpg';

// import speaker1 from '@/assets/img/Speaker1.png';
import speaker2 from '@/assets/img/speaker2.png';
// import speaker3 from '@/assets/img/speaker3.png';
import speaker4 from '@/assets/img/speaker4.png';
import speaker5 from '@/assets/img/speaker5.png';
import speaker10 from '@/assets/img/speaker10.png';
// import speaker7 from '@/assets/img/speaker7.png';
import speaker8 from '@/assets/img/speaker8.png';
import speaker9 from '@/assets/img/speaker9.png';
// import speaker11 from '@/assets/img/speaker11.png';
import speaker12 from '@/assets/img/speaker12.png';
import speaker13 from '@/assets/img/speaker13.png';
import speaker14 from '@/assets/img/speaker14.png';
import speaker15 from '@/assets/img/speaker17.png';
import speaker17 from '@/assets/img/speaker16.png';
import speaker18 from '@/assets/img/speaker15.png';
import master1 from '@/assets/img/master1.png';
import master2 from '@/assets/img/master2.png';
import master3 from '@/assets/img/master3.png';
import master4 from '@/assets/img/master5.png';

import { useEffect, useRef, useState } from 'react';
import MobileApp from '@/components/local/mobileApp';
import Footer from '@/components/local/footer';
import { ArrowRight } from '@/assets/icons';
import { ArrowLeft } from '@/assets/icons';

const PastSpeakers = () => {
  const Ods24 = [
    {
      title: 'Kashifu Inuwa',
      position: 'DG, NITDA',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: speaker17
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
  const Ods23 = [
    {
      title: 'Olubunmi Fabanwo',
      position: 'Affiliate Program Manager',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: olubunmi
    },
    {
      title: 'Harrison Obiefule',
      position: 'Co-lead , superteamNG',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: harrison
    },
    {
      title: 'Ibikun Adeleke',
      position: 'Chief Investment officer , Emergence Capital',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: ibikun
    },
    {
      title: 'Yosola Adekanmbi',
      position: 'Flutter Mobile Developer, Beebz Inc ',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: yosola
    },
    {
      title: 'Joshua Chibueze',
      position: 'Co-founder, piggyvest',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: Joshua
    },
    {
      title: 'Raheem Yusuf',
      position: 'Vice-president, T & I AFEX. ',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: raheem
    },

    {
      title: 'Justice Eziefule',
      // position: 'SA to governor of Ogun State ,2015- 2023',
      position: 'Co-founder, Metastable Labs',

      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: justice
    },
    {
      title: 'Odunayo Eweniyi',
      position: 'Co-founder, piggyvest',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: odunayo
    },
    // {
    //   title: 'Bayo Omoboriowo',
    //   position: 'Photographer to the former president.',
    //   description:
    //     'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
    //   image: bayo
    // },

    {
      title: 'Daniel Fayemi',
      position: 'Ex- Engineering Lead, Binance',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: fayemi
    }
  ];

  const [selectedYear, setSelectedYear] = useState(0);

  const Ods22 = [
    {
      title: 'Tolulope Famakinwa',
      position: 'Founder of mauzu Africa',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: tolulope
    },
    {
      title: ' Ifeoluwa Oyeniyi',
      position: 'Senior Product Manager, Vigipay ',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: oyeniyi
    },
    {
      title: 'Rahaman Abiola',
      position: 'Head of News, Legit.ng',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: rahaman
    },
    {
      title: 'Joel Ogunsola',
      position: ' CEO Prunedge ',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: joel
    },
    {
      title: 'Lanre Ogundipe',
      position: 'CEO pave, Founder imperial EdTech',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: lanre
    },
    {
      title: 'Ilori julius',
      position: 'CEO, Learners Corner Edu. Tech-hub',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: ilori
    },
    {
      title: 'Edidiong Ekong',
      position: 'Marketing Executive Specialist',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: Edidiong
    },
    {
      title: 'Oluwaseyi Falola',
      position: 'Senior Product Designer, Lazerpay',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: falola
    },
    {
      title: 'Bolaji Ajibare',
      position: 'Founder, The social media Oga',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: bolaji
    },
    {
      title: 'Oluwajoba Olabo',
      position: 'Co-founder Nest innovation Techpark',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: oluwajoba
    },
    {
      title: 'Omolara Dada',
      position: 'Growth Lead, Anchor',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: master1
    },
    {
      title: 'Sodiq Akinjobi',
      position: 'Developer Ecostystem CM at google',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: master2
    },
    {
      title: 'Kutaje O. Joseph',
      position: 'UX design mentor, Designlab ',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: master3
    },
    {
      title: 'Ibiniyi Obikoya',
      position: 'Tech Lead, Korapay',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: master4
    }
  ];
  const Ods21 = [
    {
      title: 'Mohammed Jega',
      position: 'Co founder, Domineum',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: mohammed
    },
    {
      title: 'Freeman Osonuga',
      position: 'CEO, AdLoyalthy BN',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: freeman
    },
    {
      title: 'Amedu O. Adebayo',
      position: 'CEO Ckrowd LLC (USA).',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: amedu
    },
    {
      title: 'Abel Adejoh Omachi',
      position: 'Co-founder & CEO pettysave.',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: abel
    },

    {
      title: 'Blessing Abeng',
      position: 'DOC, ingressive for Good',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: blessing
    },
    {
      title: 'Onyeka Akumah',
      position: 'Foundry and CEO farmcrowdy',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: onyeka
    },
    {
      title: 'Aderenle Sonarinwo',
      position: 'Founder, Rele Art Gallery',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: aderenle
    },
    {
      title: 'Daniel Adeyemi',
      position: 'Senior journalist at Techcoba',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: daniel
    }
  ];
  const Ods20 = [
    {
      title: 'Blessing Abeng',
      position: 'Einsteinette limited',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: blessing
    },
    {
      title: 'Oluwatobi Owolabi',
      position: 'Lead, GBG Abeokuta',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: owolabi
    },
    {
      title: 'Oluwatobi Akinpelu',
      position: 'Software engineer farmcrowdy',
      description:
        'I’m a highly motivated and solution oriented software engineer and tech entrepreneur. I use my skills and knowledge to develop and contribute innovative ideas. I am interested in Edtech, Startup Ecosytem, Investment, Blockchain, Artificial Intelligence, Machine Learning and Decentralized Finance.',
      image: oluwatobi
    }
  ];
  const [showNav, setShowNav] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showModal] = useState<number | null>(null);

  const handleScroll = () => {
    const currentScrollPos = window.scrollY;
    setShowNav(currentScrollPos > 0);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (index: number): void => {
    setSelectedYear(index);
  };
  const handleNextMobile = (index: number): void => {
    if (index < 4) {
      setSelectedYear(index + 1);
    }
  };

  const handlePrevMobile = (index: number): void => {
    if (index > 0) {
      setSelectedYear(index - 1);
    }
  };
  // Define the types for state variables
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const itemsPerPage: number = 8; // Define how many items per page
  const sectionRef = useRef<HTMLDivElement | null>(null); // Ref for the section to scroll to
  const visibleItems = Ods22.slice(currentIndex, currentIndex + itemsPerPage);
  const visibleItems2 = Ods24.slice(currentIndex, currentIndex + itemsPerPage);
  const totalItems: number =
    Ods24.length || Ods23.length || Ods22.length || Ods21.length || Ods20.length;

  // Handle the 'Previous' button click
  const handlePrev = (): void => {
    if (currentIndex - itemsPerPage >= 0 && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
      setCurrentIndex(currentIndex - itemsPerPage);
    }
  };
  // Handle the 'Next' button click
  const handleNext = (): void => {
    if (currentIndex + itemsPerPage < totalItems && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
      setCurrentIndex(currentIndex + itemsPerPage);
    }
  };
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
          className={` ${showNav ? 'scale-90' : 'scale-100'} transition-all duration-200 ease-linear`}
        >
          <div
            className='w-full h-screen bg-red-50 '
            style={{
              backgroundImage: `url(${HeroImg})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover'
            }}
          ></div>

          <div className='md:w-[55%] md:leading-[64px] absolute bottom-16 md:left-28'>
            <h1 className='md:text-[60px] platypi-gf md:leading-[64px] text-white font-semibold text-4xl p-6'>
              <span className='font-normal italic'>Past Speakers:</span>
            </h1>
            <p className='text-[#B0C5D6] inter-gf text-base leading-6 pl-6'>
              See the line-up of amazing speakers we have had graced Ogun digital summit over the
              years
            </p>
          </div>
        </div>
      </div>
      <section
        className={`m-auto w-[90%] lg:w-[1280px] py-10 sm:py-[160px] ${showModal !== null ? 'bg-[#101611B2] opacity-7' : ''}`}
      >
        <div className=' max-w-[335px] md:max-w-[669px] mb-14 md:mb-20 '>
          <h3 className='platypi-gf text-center text-[#23323F] md:mb-[16px] font-semibold text-2xl leading-[40px] tracking-[-0.5px] md:text-[34px]  md:text-left  '>
            Our past speakers in the last 5 years.
          </h3>
          <p className='text-center  text-[#627587] text-sm leading-[24px] tracking-[0.2px] font-normal md:text-base md:text-left '>
            For the past 5 years, we have had amazing array of speakers who have have graced Ogun
            digital summit over the years
          </p>
        </div>
        <div className='md:w-[668px]  h-[44px] bg-[#F7F8F8] rounded-[10px] hidden sm:flex justify-between items-center mb-10 md:mb-20 p-[2px] '>
          <button
            className='rounded-[10px] sm:text-sm text-xs font-semibold w-[166px] py-2'
            onClick={() => handleClick(0)}
            style={{
              backgroundColor: selectedYear === 0 ? '#FA6C20' : 'transparent',
              color: selectedYear === 0 ? '#ffff' : '#5A5A5A'
            }}
          >
            ODS 2024
          </button>
          <button
            className='rounded-[10px] sm:text-sm text-xs font-semibold w-[166px] py-2'
            onClick={() => handleClick(1)}
            style={{
              backgroundColor: selectedYear === 1 ? '#FA6C20' : 'transparent',
              color: selectedYear === 1 ? '#ffff' : '#5A5A5A'
            }}
          >
            ODS 2023
          </button>
          <button
            className='rounded-[10px] sm:text-sm text-xs font-semibold w-[166px] py-2'
            onClick={() => handleClick(2)}
            style={{
              backgroundColor: selectedYear === 2 ? '#FA6C20' : 'transparent',
              color: selectedYear === 2 ? '#ffff' : '#5A5A5A'
            }}
          >
            ODS 2022
          </button>
          <button
            className='rounded-[10px] sm:text-sm text-xs font-semibold w-[166px] py-2'
            onClick={() => handleClick(3)}
            style={{
              backgroundColor: selectedYear === 3 ? '#FA6C20' : 'transparent',
              color: selectedYear === 3 ? '#ffff' : '#5A5A5A'
            }}
          >
            ODS 2021
          </button>
          <button
            className='rounded-[10px] sm:text-sm text-xs font-semibold w-[166px] py-2'
            onClick={() => handleClick(4)}
            style={{
              backgroundColor: selectedYear === 4 ? '#FA6C20' : 'transparent',
              color: selectedYear === 4 ? '#ffff' : '#5A5A5A'
            }}
          >
            ODS 2020
          </button>
        </div>
        <div className=' flex justify-center gap-[21px] items-center mb-12 sm:hidden'>
          <button
            className={`rounded-full flex justify-center items-center bg-[#CDD5DC] h-[32px] w-[32px] transform  cursor-pointer ${
              selectedYear === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            // onClick={handlePrev}
            onClick={() => handlePrevMobile(selectedYear)}
          >
            <ArrowLeft fill={` ${selectedYear === 0 ? 'transparent' : '#2B4155'}`} />
          </button>
          {selectedYear === 0 && (
            <button className='rounded-[10px] sm:text-sm text-xs font-semibold w-[199px] py-2 bg-[#FA6C20] text-white h-10'>
              ODS 2024
            </button>
          )}
          {selectedYear === 1 && (
            <button className='rounded-[10px] sm:text-sm text-xs font-semibold w-[199px] py-2 bg-[#FA6C20] text-white h-10'>
              ODS 2023
            </button>
          )}
          {selectedYear === 2 && (
            <button className='rounded-[10px] sm:text-sm text-xs font-semibold w-[199px] py-2 bg-[#FA6C20] text-white h-10'>
              ODS 2022
            </button>
          )}
          {selectedYear === 3 && (
            <button className='rounded-[10px] sm:text-sm text-xs font-semibold w-[199px] py-2 bg-[#FA6C20] text-white h-10'>
              ODS 2021
            </button>
          )}
          {selectedYear === 4 && (
            <button className='rounded-[10px] sm:text-sm text-xs font-semibold w-[199px] py-2 bg-[#FA6C20] text-white h-10'>
              ODS 2020
            </button>
          )}

          <button
            className={`rounded-full bg-[#CDD5DC] flex justify-center items-center h-[32px] w-[32px] transform  cursor-pointer ${
              selectedYear === 4 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            // onClick={handleNext}
            onClick={() => handleNextMobile(selectedYear)}
          >
            <ArrowRight fill={` ${selectedYear === 4 ? 'transparent' : '#2B4155'}`} />
          </button>
        </div>
        <>
          {selectedYear === 0 && (
            <div
              ref={sectionRef}
              className={`m-auto w-[90%] lg:w-[1280px] sm:grid md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 grid-rows-1  justify-between gap-[24px] md:flex-row  transition-all duration-300 translate-x-  ease-in-out ${showModal ? '' : ''}`}
            >
              {visibleItems2.map((item, index) => (
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
                    className={`absolute bottom-0 w-full px-4 py-6 ${showModal === index ? ' ' : 'bg-[#101611]'} text-white transition-all duration-300 ease-in-out ${
                      hoveredIndex === index
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-full'
                    }`}
                  >
                    <h1 className='font-semibold text-base text-[#F2F9FF] mb-2'>{item.title}</h1>
                    <p className='text-[12px] leading-6 text-[#B0C5D6]'>{item.position}</p>
                    <p
                      className={`text-sm leading-6 text-[#B0C5D6] ${showModal === index ? 'block' : 'hidden'} `}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
        <>
          {selectedYear === 1 && (
            <div
              ref={sectionRef}
              className={`m-auto w-[90%] lg:w-[1280px] sm:grid md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 grid-rows-1  justify-between gap-[24px] md:flex-row  transition-all duration-300 translate-x-  ease-in-out ${showModal ? '' : ''}`}
            >
              {Ods23.map((item, index) => (
                <div
                  key={index}
                  className={`relative rounded-2xl h-[360px] lg:max-w-[300px] w-auto overflow-hidden grayscale sm:mb-0 mb-[16px] cursor-pointer transition-transform transform ${showModal === index ? 'w-[475px] h-[456px] absolute z-30 bg-white pt-[56px] ' : 'h-[360px] w-[300px]'}`}
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
                    className={`absolute bottom-0 w-full px-4 py-6 ${showModal === index ? ' ' : 'bg-[#101611]'} text-white transition-all duration-300 ease-in-out ${
                      hoveredIndex === index
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-full'
                    }`}
                  >
                    <h1 className='font-semibold text-base text-[#F2F9FF] mb-2'>{item.title}</h1>
                    <p className='text-[12px] leading-6 text-[#B0C5D6]'>{item.position}</p>
                    <p
                      className={`text-sm leading-6 text-[#B0C5D6] ${showModal === index ? 'block' : 'hidden'} `}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
        <>
          {selectedYear === 2 && (
            <div
              ref={sectionRef}
              className={`m-auto w-[90%] lg:w-[1280px] sm:grid md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 grid-rows-1  justify-between gap-[24px] md:flex-row  transition-all duration-300 translate-x-  ease-in-out ${showModal ? '' : ''}`}
            >
              {visibleItems.map((item, index) => (
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
                    className={`absolute bottom-0 w-full px-4 py-6 ${showModal === index ? ' ' : 'bg-[#101611]'} text-white transition-all duration-300 ease-in-out ${
                      hoveredIndex === index
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-full'
                    }`}
                  >
                    <h1 className='font-semibold text-base text-[#F2F9FF] mb-2'>{item.title}</h1>
                    <p className='text-[12px] leading-6 text-[#B0C5D6]'>{item.position}</p>
                    <p
                      className={`text-sm leading-6 text-[#B0C5D6] ${showModal === index ? 'block' : 'hidden'} `}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
        <>
          {selectedYear === 3 && (
            <div
              className={`m-auto w-[90%] lg:w-[1280px] sm:grid md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 grid-rows-1  justify-between gap-[24px] md:flex-row  transition-all duration-300 translate-x-  ease-in-out ${showModal ? '' : ''}`}
            >
              {Ods21.map((item, index) => (
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
                    className={`absolute bottom-0 w-full px-4 py-6 ${showModal === index ? ' ' : 'bg-[#101611]'} text-white transition-all duration-300 ease-in-out ${
                      hoveredIndex === index
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-full'
                    }`}
                  >
                    <h1 className='font-semibold text-base text-[#F2F9FF] mb-2'>{item.title}</h1>
                    <p className='text-[12px] leading-6 text-[#B0C5D6]'>{item.position}</p>
                    <p
                      className={`text-sm leading-6 text-[#B0C5D6] ${showModal === index ? 'block' : 'hidden'} `}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
        <>
          {selectedYear === 4 && (
            <div
              className={`m-auto w-[90%] lg:w-[1280px] sm:grid md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 grid-rows-1  justify-between gap-[24px] md:flex-row  transition-all duration-300 translate-x-  ease-in-out ${showModal ? '' : ''}`}
            >
              {Ods20.map((item, index) => (
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
                    className={`absolute bottom-0 w-full px-4 py-6 ${showModal === index ? ' ' : 'bg-[#101611]'} text-white transition-all duration-300 ease-in-out ${
                      hoveredIndex === index
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-full'
                    }`}
                  >
                    <h1 className='font-semibold text-base text-[#F2F9FF] mb-2'>{item.title}</h1>
                    <p className='text-[12px] leading-6 text-[#B0C5D6]'>{item.position}</p>
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
            </div>
          )}
        </>
        <div className='flex justify-center items-center gap-6 mt-10  sm:mt-[64px]'>
          <span
            className={`rounded-full flex justify-center items-center bg-[#CDD5DC] h-[56px] w-[56px] transform -translate-y-1/2 cursor-pointer ${
              currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handlePrev}
          >
            <ArrowLeft fill='#2B4155' />
          </span>
          <span
            className={`rounded-full bg-[#CDD5DC] flex justify-center items-center h-[56px] w-[56px] transform -translate-y-1/2 cursor-pointer ${
              currentIndex + itemsPerPage >= totalItems ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleNext}
          >
            <ArrowRight fill='#2B4155' />
          </span>
        </div>
      </section>

      <MobileApp />
      <Footer />
    </div>
  );
};

export default PastSpeakers;
