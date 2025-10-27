export interface CustomTabBarProps {
  tabs: string[];
  activeTab: number;
  setActiveTab: (tab: number) => void;
}

function CustomTabBar({ tabs, activeTab, setActiveTab }: CustomTabBarProps) {
  return (
    <div className='bg-[#F7F8F8] md:w-[550px] w-full h-[45px] rounded-xl flex relative overflow-hidden'>
      {/* Active tab highlight */}
      <div
        className='absolute top-0 h-[45px] bg-[#FA6C20] rounded-xl transition-all duration-300'
        style={{
          width: `calc(100% / ${tabs.length})`,
          left: `calc((100% / ${tabs.length}) * ${activeTab})`
        }}
      />

      {tabs.map((tab, index) => {
        const isActive = activeTab === index;
        return (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`
              flex-1 z-10 font-semibold tracking-[0.2px]
              text-xs md:text-base transition-all duration-300
              ${isActive ? 'text-white' : 'text-[#627587]'}
              whitespace-normal text-center px-1
            `}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}

export default CustomTabBar;
