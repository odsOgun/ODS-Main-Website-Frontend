import React from 'react';
import Countdown, { CountdownRenderProps } from 'react-countdown';

interface TimeUnit {
  value: number;
  label: string;
}

const renderer = ({ days, hours, minutes, seconds }: CountdownRenderProps): JSX.Element => {
  const timeUnits: TimeUnit[] = [
    { value: days, label: 'DAYS' },
    { value: hours, label: 'HRS' },
    { value: minutes, label: 'MIN' },
    { value: seconds, label: 'SEC' }
  ];

  return (
    <div className='flex py-3 pl-3 max-md:max-w-[232px] max-md:h-[58px] justify-center items-center'>
      {timeUnits.map((item) => (
        <div key={item.label} className='flex flex-col w-16 h-[42px] md:h-12 text-center gap-1'>
          <div className='text-sm md:text-xl leading-5 md:leading-6 font-normal md:font-semibold text-[#F2F9FF] tracking-[-0.2px] md:tracking-[-0.5px]'>
            {item.value}
          </div>
          <div className='text-xs md:text-xs leading-5 font-semibold md:font-semibold tracking-[3px] text-[#B0C5D6]'>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

const CountDown: React.FC = () => {
  return (
    <div className='md:h-[72px] w-[88vw] max-md:max-w-[335px] md:w-[719px] rounded-2xl bg-[#0E140F] absolute position-center max-md:px-2'>
      <div className='flex items-center justify-between w-full max-md:flex-col'>
        <Countdown date={new Date(2025, 11, 20)} renderer={renderer} />

        <div className='max-md:mt-1 max-md:mb-1 md:py-[13px] md:pr-4'>
          <div className='flex flex-col gap-1 max-md:text-center'>
            <div className=' text-xs md:text-sm leading-5 font-semibold text-[#F2F9FF] tracking-[3px]'>
              Nov 20, 2025
            </div>
            <div className='text-xs md:text-sm leading-[18px] md:leading-[22px] font-normal text-[#B0C5D6] tracking-[0.2px]'>
              June 12 cultural centre, Kuto, Abeokuta Ogun state
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountDown;
