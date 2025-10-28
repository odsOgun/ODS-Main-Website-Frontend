export interface CustomTabBarProps {
  tabs: string[];
  activeTab: number;
  setActiveTab: (tab: number) => void;
}

function CustomTabBar({ tabs, activeTab, setActiveTab }: CustomTabBarProps) {
  const md = window.matchMedia('1200px');

  return (
    <div className='bg-[#F7F8F8] md:w-[550px] w-full h-[45px] rounded-xl flex relative'>
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => setActiveTab(index)}
          className={`font-semibold text-xs md:text-base tracking-[0.2px] basis-1/3 text-[#627587]`}
        >
          {tab}
        </button>
      ))}
      <button
        className='md:w-[calc(550px/3)] w-[calc(100%/3)] h-[45px] bg-[#FA6C20] absolute rounded-xl text-white font-semibold text-xs md:text-base'
        style={{
          left: md ? `calc(100%/3 * ${activeTab})` : `calc(550px/3 * ${activeTab})`,
          transition: 'left 0.3s ease-in-out'
        }}
      >
        {tabs[activeTab]}
      </button>
    </div>
  );
}

export default CustomTabBar;
