// import Sitelinks from '@/mock/sitelinks.json';
import { ArrowRight } from '@/assets/icons';

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
      'We will feature leading founders, government ministers, enterprise tech leaders and high profile entrepreneurs recognised locally and globally.',
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

function WhatToLookForwardTo() {
  return (
    <div>
      <div className='flex flex-col justify-between md:my-20 mb-20 md:flex-row'>
        <h2 className='text-[#23323F] text-2xl md:text-4xl platypi-gf font-semibold md:basis-2/5'>
          What to look forward to for this year's event
        </h2>
        <div className='md:basis-2/5'>
          <p className='text-base font-normal tracking-[0.2px] text-[#627587] my-4'>
            We're back with the most exciting and largest technology event in Ogun State. It all
            starts here, wherever you sit in the ecosystem, you'll find the insights, inspiration
            and connections that you need to thrive.
          </p>
          <button
            type='button'
            className='bg-[#178A2D] font-semibold min-w-[120px] rounded flex justify-center items-center tracking-[0.2px] text-white leading-6'
            onClick={() => window.dispatchEvent(new Event('openDownloadReportModal'))}
          >
            <span className='text-sm font-semibold'>Download 2025 Report</span>
            <ArrowRight />
          </button>
        </div>
      </div>

      <div className='flex flex-col justify-between gap-4 md:flex-row'>
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
  );
}

export default WhatToLookForwardTo;
