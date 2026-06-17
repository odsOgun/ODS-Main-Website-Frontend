import { ArrowRight } from '@/assets/icons';
import { useState } from 'react';
import CustomTabBar from '../ui/customTabbar';
import CalendarCard from '../ui/calendarCard';
import SponsorCard, { SponsorCardProps } from '../ui/sponsorCard';
import SectionTwoImg from '@/assets/img/section-two-image.png';
import SectionTwoImg2 from '@/assets/img/section-two-image2.png';
import SectionTwoImg3 from '@/assets/img/speakers.png';
import Sitelinks from '@/mock/sitelinks.json';

// import GrazacLogo from '@/assets/svgs/sponsors/grazac.svg';
// import AfexLogo from '@/assets/svgs/sponsors/afex.svg';
// import OgunGov from '@/assets/svgs/sponsors/ogunGov.svg';
// import TechEconomy from '@/assets/svgs/sponsors/techeconomy.svg';
// import OgunDaily from '@/assets/svgs/sponsors/ogunDaily.svg';
// import useIsScreenWidthBelow from '@/hooks/useIsScreenWidthBelow';
// // mobile
// import GrazacLogoMobile from '/img/mobile/grazac.svg';
// import AfexLogoMobile from '/img/mobile/afex.svg';
// import OgunGovMobile from '/img/mobile/ogunGov.svg';
// import TechEconomyMobile from '/img/mobile/techeconomy.svg';
// import OgunDailyMobile from '/img/mobile/ogunDaily.svg';

// function SponsorLogos() {
//   const isBelow = useIsScreenWidthBelow(768);

//   const sponsors = [
//     { label: 'Grazac', icon: isBelow ? GrazacLogoMobile : GrazacLogo },
//     { label: 'Afex', icon: isBelow ? AfexLogoMobile : AfexLogo },
//     { label: 'Ogun Gov', icon: isBelow ? OgunGovMobile : OgunGov },
//     { label: 'Tech Economy', icon: isBelow ? TechEconomyMobile : TechEconomy },
//     { label: 'Ogun Daily', icon: isBelow ? OgunDailyMobile : OgunDaily }
//   ];
//   return (
//     <div className='max-md:gap-3 flex items-center justify-between md:px-6 mt-2 h-[62px] md:h-[72px] md:mt-5'>
//       {sponsors.map(({ label, icon }) => (
//         <div key={label}>
//           <img src={icon} alt={label} />
//         </div>
//       ))}
//     </div>
//   );
// }

enum Tabs {
  Conference,
  OffConference,
  All
}

const events = [
  {
    day: 'Wednesday',
    date: ' Nov 25th, 2026.',
    title: 'Startup Pitch Competition',
    items: [
      'Strictly by Invitation',
      'Only for selected Startups',
      'Details Later...'
      // 'Judges Deliberation'
    ],
    filter: Tabs.OffConference
  },
  // {
  //   day: 'Wednesday',
  //   date: '30th October',
  //   title: 'Conference Day 1',
  //   items: [
  //     'Art and Culture',
  //     'Entertainment Industry',
  //     'Creative Economy',
  //     'Cultural and Art Exhibition',
  //     'Outdoor Party',
  //     'Demos'
  //   ],
  //   filter: Tabs.Conference
  // },
  {
    day: 'Thursday',
    date: 'Nov 26th, 2026.',
    title: 'Main conference Day',
    items: [
      'Details later...'
      // 'Funding for Business/Startup',
      // 'Technology and Mental Health',
      // 'Blockchain Opportunity for Africa',
      // 'Think Local: Go Global',
      // 'Free Masterclass Sessions',
      // 'Announcement of Winners for Startup Competition',
      // 'Demos from Partners'
    ],
    filter: Tabs.Conference
  }
  // {
  //   day: 'Friday',
  //   date: '1st November',
  //   title: 'Founders Mixers',
  //   items: ['Networking and Dinner', 'For founders, entrepreneurs and talents.'],
  //   filter: Tabs.OffConference
  // }
];

const sponsorCardItems = [
  {
    title: 'Network',
    image: '/img/sponsor1.png',
    description: "Meet the biggest players in Africa's innovation and business community.",
    bgColor: '#E5EEFE'
  },
  {
    title: 'Generate Leads',
    image: '/img/sponsor2.png',
    description: 'Meet future clients and partners for your business.',
    bgColor: '#FEF5E5'
  },
  {
    title: 'Gain Exposure',
    image: '/img/sponsor3.png',
    description:
      "Get your brands in front of the people that matter in Africa's startup and business community.",
    bgColor: '#FEE5E5'
  },
  {
    title: 'Innovate',
    image: '/img/sponsor4.png',
    description: 'Find opportunities to collaborate and create new solutions.',
    bgColor: '#EDFEE5'
  }
] satisfies Array<SponsorCardProps>;

const whatToLookForwardItems = [
  {
    title: 'Top Speakers',
    description:
      'We will feature leading founders, government ministers, enterprise tech leaders and high profile entrepreneurs recognised locally and globally.',
    image: '/img/top-speakers.png'
  },
  {
    title: 'Fresh Insights',
    description:
      'Gain practical insights into emerging technologies, industry trends, innovation strategies, and opportunities that will shape the future of work and business.',
    image: '/img/fresh-insight.png'
  },
  {
    title: 'Free Masterclass Sessions',
    description:
      'Gain full knowledge on growing your career globally, getting remote international gigs and also learn how to increase sales if you run a startup/business for free.',
    image: '/img/free-masterclass.png'
  },
  {
    title: 'Exploring Other Sectors',
    description:
      'We will be diverse this year as we also intend to explore opportunities in Art, culture and entertainment sector and the role technology plays',
    image: '/img/exploring.png'
  }
];
// interface SectionTwoProps {
//   onOpenSponsorModal: () => void;
//   onOpenComingModal: () => void;
//   onOpenExhibitorModal: () => void;
// }

function SectionTwo() {
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.Conference);
  return (
    <div className='bg-white' id='exhibitors'>
      <div className='max-w-[1120px] w-full px-8 mx-auto pt-20 xl:box-content'>
        <div className='w-full mb-20 md:flex md:justify-between md:mb-40'>
          <div className='mb-6 md:basis-1/3 md:mb-0'>
            <img src={SectionTwoImg3} alt='SectionTwo' />
          </div>
          <div className='md:basis-1/2'>
            <h1 className='text-[#23323F] text-2xl md:text-4xl platypi-gf font-semibold'>
              We are constantly looking out for speakers to grace Ogun Digital Summit 2026.
            </h1>
            <p className='text-base font-normal tracking-[0.2px] text-[#627587] my-5'>
              Join us to make a real impact and contribute to conversations to build Nigeria’s
              Digital Future.
            </p>
            {/* <a href={Sitelinks.becomeAnExhibitor} target='_blank'> */}
            <a
              href='/register/speakers'
              className='bg-[#178A2D] w-fit font-semibold h-10 min-w-[190px] rounded flex justify-center items-center tracking-[0.2px] text-white'
            >
              <span className='text-sm font-semibold'>Apply to Speak</span>
              <ArrowRight />
            </a>
            {/* </a> */}
          </div>
        </div>

        <div className='w-full mb-20 md:flex md:justify-between md:mb-40'>
          <div className='md:basis-1/2'>
            <h1 className='text-[#23323F] text-2xl md:text-4xl platypi-gf font-semibold'>
              Take a Masterclass session during Ogun Digital Summit 2026 and make a real impact.
            </h1>
            <p className='text-base font-normal tracking-[0.2px] text-[#627587] my-5'>
              Join our masterclass trainers to help us train young individuals at ODS. It's free and
              we don't charge anyone for this.
            </p>
            <a href={Sitelinks.applyMasterclass} target='_blank'>
              <button className='bg-[#178A2D] font-semibold h-10 w-full max-w-[260px] rounded flex justify-center items-center tracking-[0.2px] text-white'>
                <span className='text-sm font-semibold'>Apply to conduct a masterclass</span>
                <ArrowRight />
              </button>
            </a>
          </div>

          <div className='mt-6 md:basis-1/3 md:mb-0'>
            <img src={SectionTwoImg2} />
          </div>
        </div>

        <div className='w-full md:flex md:justify-between'>
          <div className='mb-6 md:basis-1/3 md:mb-0'>
            <img src={SectionTwoImg} alt='SectionTwo' />
          </div>
          <div className='md:basis-1/2'>
            <h1 className='text-[#23323F] text-2xl md:text-4xl platypi-gf font-semibold'>
              Would you like to showcase your startup or business to over 5,000 participants?
            </h1>
            <p className='text-base font-normal tracking-[0.2px] text-[#627587] my-5'>
              Increase your start visibility and reach by booking a boot with us today
            </p>
            {/* <a href={Sitelinks.becomeAnExhibitor} target='_blank'> */}
            <a
              href='/register/exhibitors'
              className='bg-[#178A2D] w-fit font-semibold h-10 min-w-[190px] rounded flex justify-center items-center tracking-[0.2px] text-white'
            >
              <span className='text-sm font-semibold'>Become an exhibitor</span>
              <ArrowRight />
            </a>
            {/* </a> */}
          </div>
        </div>

        <div className='my-20 text-center'>
          <div className=''>
            <h2 className='text-[#23323F] text-2xl md:text-4xl platypi-gf font-semibold'>
              Schedule of event
            </h2>
            <p className='text-base font-normal tracking-[0.2px] text-[#627587] my-4'>
              Get to know our agenda to help you plan ahead for this year
            </p>
          </div>
          <div className='flex flex-col items-center justify-center my-10'>
            <CustomTabBar
              tabs={['Conference days', 'Off conference', 'All']}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            <div
              // className={`flex flex-col md:flex-row ${activeTab === Tabs.All ? 'gap-4' : 'gap-10'} my-10 w-full `}
              className={`flex flex-col md:flex-row ${activeTab === Tabs.All ? 'gap-4' : 'gap-4'} my-10 w-[100%] md:w-[70%] max-w-full`}
            >
              {events.map((item, index) => (
                <CalendarCard
                  key={index}
                  day={item.day}
                  date={item.date}
                  title={item.title}
                  items={item.items}
                  showConditions={[
                    activeTab === Tabs.All,
                    activeTab === Tabs.Conference && item.filter === Tabs.Conference,
                    activeTab === Tabs.OffConference && item.filter === Tabs.OffConference
                  ]}
                />
              ))}
            </div>
          </div>
        </div>

        <div id='sponsor' className='flex flex-col items-center justify-center'>
          <div className='text-center md:w-2/3'>
            <h2 className='text-[#23323F] text-2xl md:text-4xl platypi-gf font-semibold'>
              Why join us as a Sponsor?
            </h2>
            <p className='text-base font-normal tracking-[0.2px] text-[#627587] my-4'>
              With over 5,000 participants expected to grace Ogun Digital Summit 2026, we’ve got the
              perfect audience for you.
            </p>
            {/* <a href={Sitelinks.becomeAsponsor} target='_blank'> */}
            <a
              href='/register/sponsors'
              className='bg-[#178A2D] w-fit font-semibold h-10 min-w-[190px] rounded flex justify-center items-center tracking-[0.2px] text-white mx-auto'
            >
              <span className='text-sm font-semibold'>Become a sponsor</span>
              <ArrowRight />
            </a>
            {/* </a> */}
          </div>

          <div className='my-20'>
            <div className='flex flex-col items-center gap-10 md:flex-row'>
              {sponsorCardItems.map((item, index) => (
                <SponsorCard
                  key={index}
                  index={index + 2}
                  title={item.title}
                  image={item.image}
                  description={item.description}
                  bgColor={item.bgColor}
                />
              ))}
            </div>
          </div>

          <div className='flex flex-col justify-between md:my-20 mb-20 md:flex-row'>
            <h2 className='text-[#23323F] text-2xl md:text-4xl platypi-gf font-semibold md:basis-2/5'>
              What to look forward to for this year's event
            </h2>
            <div className='md:basis-2/5'>
              <p className='text-base font-normal tracking-[0.2px] text-[#627587] my-4'>
                We're back with the most exciting and largest technology event in Ogun State. It all
                starts here, wherever you sit in the ecosystem, you'll find the insights,
                inspiration and connections that you need to thrive.
              </p>
              <button
                type='button'
                className='bg-[#178A2D] font-semibold h-10 min-w-[210px] rounded flex justify-center items-center tracking-[0.2px] text-white leading-6'
                onClick={() => window.dispatchEvent(new Event('openDownloadReportModal'))}
              >
                <span className='text-sm font-semibold'>Download Impact Report</span>
                <ArrowRight />
              </button>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 my-20 md:grid-cols-2 lg:grid-cols-4'>
            {whatToLookForwardItems.map((item, index) => (
              <div
                key={index}
                className='rounded-2xl p-6 h-[380px] flex'
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(16, 22, 17, 0.3), rgba(16, 22, 17, 0.7), rgba(16, 22, 17, 1)), url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className='mt-auto text-left text-white h-fit'>
                  <h1 className='font-semibold text-base text-[#F2F9FF] mb-2'>{item.title}</h1>
                  <p className='text-sm leading-6 text-[#B0C5D6]'>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* <div className='max-w-[713px] mx-auto mt-20 md:mt-[100px]'>
        <div className='flex flex-col justify-center w-full'>
          <p className='text-xs md:text-base font-semibold leading-5 md:leading-5 uppercase text-[#627587] tracking-[3px] md:text-center'>
            Proudly supported by
          </p>
          <SponsorLogos />
        </div>
      </div> */}
    </div>
  );
}

export default SectionTwo;
