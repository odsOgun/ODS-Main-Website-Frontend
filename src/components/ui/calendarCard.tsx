import { useEffect, useRef, useState } from 'react';

export interface CalendarCardProps {
  day: string;
  date: string;
  title: string;
  items: string[];
  showConditions?: boolean[];
}

function CalenderCard({ day, date, title, items, showConditions }: CalendarCardProps) {
  const showItem = showConditions?.map((condition) => condition).includes(true);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.clientHeight);
    }
  }, [headerRef]);

  return (
    <div
      className='w-full bg-[#F2F3F4] rounded-2xl p-4 min-h-[150px]'
      style={{
        display: showItem ? 'inline-block' : 'none'
      }}
    >
      <div className='bg-white mb-6 text-left rounded-xl py-2 px-4 relative' ref={headerRef}>
        <h3 className='text-lg font-semibold text-[#23323F] mb-2'>{day}</h3>
        <p className='text-sm font-normal text-[#23323F]'>{date}</p>
        <div
          className='w-[4px] rounded-l-3xl absolute bg-[#7A8C6B]'
          style={{
            height: headerHeight - 10,
            left: 0,
            top: 5
          }}
        ></div>
      </div>
      <div className='text-left'>
        <h4 className='text-base font-semibold text-[#23323F]'>{title}</h4>
        {items.map((item, index) => (
          <h6 className='text-[#627587] text-sm my-3' key={index}>
            {item}
          </h6>
        ))}
      </div>
    </div>
  );
}

export default CalenderCard;
