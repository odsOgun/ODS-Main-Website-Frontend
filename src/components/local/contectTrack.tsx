const ContectTrack = () => {
  const tracks = [
    {
      title: 'AI & Innovation',
      icon: '/img/Ai.png',
      bg: '#DFFFED'
    },
    {
      title: 'The Creative Economy',
      icon: '/img/$bulb.png',
      bg: '#FEF5E5'
    },
    {
      title: 'The Future of Work',
      icon: '/img/wheel.png',
      bg: '#FEE5E5'
    },
    {
      title: 'Blockchain and Web3',
      icon: '/img/web.png',
      bg: '#E5EEFE'
    },
    {
      title: 'AgriTech',
      icon: '/img/agric.png',
      bg: '#EAEAEA'
    },
    {
      title: 'The Creative Economy',
      icon: '/img/economy.png',
      bg: '#E8E8FF'
    },
    {
      title: 'Startup Investment',
      icon: '/img/investment.png',
      bg: '#EDFEE5'
    }
  ];
  return (
    <div className='bg-white '>
      <div className='max-w-[1120px] w-full px-5 md:px-8 mx-auto py-20 md:py-[128px] xl:box-content '>
        <div className='md:w-[472px] md:mx-auto'>
          <h2 className='text-2xl font-semibold text-center text-[#23323F] md:text-4xl platypi-gf'>
            Content Tracks
          </h2>
          <p className='text-[14px] font-normal inter-gf tracking-[0.2px] leading-[22px] text-[#627587] mt-4 mb-10 text-center'>
            We are not limited to a topic, listen to industry experts talk across these topics and
            gain unreplaceable insights
          </p>
        </div>
        <div className='flex flex-wrap gap-9 items-center justify-center'>
          {tracks.map((track, index) => (
            <div
              key={index}
              className='w-full sm:w-[203.39px]  flex flex-col items-center justify-center p-7 rounded-lg border-[1.32px] md:border-[0.89px] border-[#FFFFFF59] '
              style={{ backgroundColor: track.bg }}
            >
              <img src={track.icon} alt={track.title} className='mb-2' />
              <h3 className='text-[12px] font-semibold text-[#23323F]'>{track.title}</h3>
            </div>
          ))}   



        </div>
      </div>
    </div>
  );
};

export default ContectTrack;
