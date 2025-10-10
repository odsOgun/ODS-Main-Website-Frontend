import { ArrowRight, ArrowRightGreen } from '@/assets/icons';
import GrazacLogo from '@/assets/svgs/sponsors/grazac.svg';
import AfexLogo from '@/assets/svgs/sponsors/afex.svg';
import OgunGov from '@/assets/svgs/sponsors/ogunGov.svg';
import TechEconomy from '@/assets/svgs/sponsors/techeconomy.svg';
import CountDown from './countdown';
// import useIsScreenWidthBelow from '@/hooks/useIsScreenWidthBelow';
import OgunDailyMobile from '/img/mobile/ogunDaily.svg';
// import AfexMobile from '/img/mobile/afex.svg';
// import AlxMobile from '/img/mobile/alx2.svg';
// import BushaMobile from '/img/mobile/Busha.svg';
// import CondiaMobile from '/img/mobile/Condia.svg';
// import OGTVMobile from '/img/mobile/OGTV.svg';
// import TechCabalMobile from '/img/mobile/TechCabal.svg';
// import TechPointMobile from '/img/mobile/TechPoint Africa.svg';
import Alx from '@/assets/svgs/sponsors/alx2.png';
import Busha from '@/assets/svgs/sponsors/busha2.svg';
import Condia from '@/assets/svgs/sponsors/Condia.png';
import OGTV from '@/assets/svgs/sponsors/OGTV.jpeg';
import TechCabal from '@/assets/svgs/sponsors/TechCabal.png';
import TechPoint from '@/assets/svgs/sponsors/TechPoint Africa.png';
import Bunker from '@/assets/svgs/sponsors/theBUNKer Logo.png';
import SouthKitchen from '@/assets/svgs/sponsors/south kitchen.png';
import TheSouth from '@/assets/svgs/sponsors/TheSouth_Logo.png';

import { motion } from 'framer-motion';

const sponsors = [
  { label: 'Grazac', icon: GrazacLogo },
  { label: 'Afex', icon: AfexLogo },
  { label: 'OgunDailyMobile', icon: OgunDailyMobile },
  { label: 'Ogun Gov', icon: OgunGov },
  { label: 'Tech Economy', icon: TechEconomy },
  { label: 'Alx', icon: Alx },
  { label: 'Busha', icon: Busha },
  { label: 'Condia', icon: Condia },
  { label: 'OGTV', icon: OGTV },
  { label: 'TechCabal', icon: TechCabal },
  { label: 'TechPoint', icon: TechPoint },
  { label: 'Bunker', icon: Bunker },
  { label: 'SouthKitchen', icon: SouthKitchen },
  { label: 'TheSouth', icon: TheSouth }
];
function SponsorLogos() {
  return (
    <div className='relative w-full overflow-hidden bg-white py-6'>
      <motion.div
        className='flex w-max gap-12'
        animate={{ x: ['0%', '-100%'] }}
        transition={{
          repeat: Infinity,
          duration: 80,
          ease: 'linear'
        }}
      >
        {[...sponsors, ...sponsors].map((s, i) => (
          <div key={i} className='flex items-center shrink-0'>
            <img src={s.icon} alt={s.label} className='h-12 md:h-16 w-auto object-contain' />
            {/* <span className="text-sm font-medium">{s.label}</span> */}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
// interface SectionOneProps {
//   // onOpenSponsorModal: () => void;
//   onOpenComingModal: () => void;
// }
function Hero() {
  return (
    <div className='relative'>
      <div className='hero-bg px-5 pt-10 pb-[120px] md:pt-[100px] md:pb-[76px]'>
        <div className='max-w-[713px] mx-auto'>
          <div className='flex flex-col gap-6 md:gap-8'>
            <div className='text-[34px] md:text-6xl leading-[40px] md:leading-[64px] text-left md:text-center tracking-[0.5px] md:tracking-[-1px] text-[#23323F] max-md:max-w-[332px]'>
              <h2 className='italic font-normal platypi-gf'>
                The largest digital summit in Ogun State
              </h2>
            </div>

            <p className='text-sm md:text-base leading-[22px] md:leading-[22px] font-normal tracking-[0.2px] text-[#627587]  md:text-center'>
              Ogun Digital Summit is a gathering of creatives, entrepreneurs, innovators, investors,
              tech and business leaders with focus on igniting conversations towards technology
              advancement and showcasing innovations in our ecosystem
            </p>

            <div className='flex flex-wrap items-center gap-4 mt-1 md:justify-center'>
              <a
                href='https://checkout.mainstack.co/ods2025/AelYp9iEF5RO'
                target='_blank'
                className='bg-[#178A2D] font-semibold h-10 min-w-[110px] rounded flex justify-center items-center tracking-[0.2px] text-white'
              >
                <span className='text-sm font-semibold'>Register</span>
                <ArrowRight />
              </a>

              <a href='/register/sponsors'>
                <button className='min-w-[161px] h-6 rounded-[2px] bg-white flex justify-center items-center gap-2'>
                  <span className='text-[#178A2D] text-sm font-semibold'>Become a sponsor</span>
                  <ArrowRightGreen />
                </button>
              </a>
            </div>
          </div>
        </div>

        <div className='max-w-[713px] mx-auto mt-20 md:mt-[100px]'>
          <div className='flex flex-col justify-center w-full'>
            <p className='text-xs md:text-base font-semibold leading-5 md:leading-5 uppercase text-[#627587] tracking-[3px] md:text-center'>
              Proudly supported by
            </p>
            <SponsorLogos />
          </div>
        </div>
      </div>

      <CountDown />
      <div className='art-bg' />
    </div>
  );
}

export default Hero;
