import { ArrowRight, ArrowRightGreen } from '@/assets/icons';
import CountDown from './countdown';

function Hero() {
  return (
    <div className='relative'>
      <div className='hero-bg px-5 pt-10 pb-[120px] md:pt-[100px] md:pb-[76px]'>
        <div className='max-w-[713px] mx-auto'>
          <div className='flex flex-col gap-6 md:gap-8'>
            <div className='text-[34px] md:text-6xl leading-[40px] md:leading-[64px] text-left md:text-center tracking-[0.5px] md:tracking-[-1px] text-[#23323F] max-md:max-w-[332px]'>
              <h2 className='italic font-normal platypi-gf'>The Next Move</h2>
            </div>
            <p className='text-sm md:text-base leading-[22px] md:leading-[22px] font-normal tracking-[0.2px] text-[#627587]  md:text-center'>
              Ogun Digital Summit is focused on showcasing new innovations in Ogun Tech Ecosystem
              and bringing together 2,000+ founders, talents, policymakers, creators, and investors
              for bold conversations, real connections, and decisions that move Nigeria's tech
              ecosystem forward.
            </p>

            <div className='flex flex-wrap items-center md:justify-center gap-[8px] lg:gap-[16px]'>
              <div className='flex items-center gap-[8px]'>
                {/* <img src='/img/tech-brain.png' alt='tech-brain' /> */}
                <p className='font-medium md:font-normal text-[12px]  md:text-[18px] text-[#2D3936]'>
                  Technology, Innovation and Progress in Motion{' '}
                </p>
                {/* <p className=' md:ml-[16px] ml-[8px] h-[12px] md:h-[18px] border-r border-[#BCC1C1]'></p> */}
              </div>

              {/* <div className='flex items-center gap-[8px]'>
                <img src='/img/motion.png' alt='motion' />
                <p className='font-medium text-[12px]  md:text-[18px] text-[#2D3936]'>
                  Progress in Motion
                </p>
                <p className=' md:ml-[16px] ml-[8px] h-[12px] md:h-[18px] border-r border-[#BCC1C1]'></p>
              </div>
              <div className='flex items-center gap-[8px]'>
                <img src='/img/innovation.png' alt='innovation' />
                <p className='font-medium text-[12px]  md:text-[18px] text-[#2D3936]'>Innovation</p>
              </div> */}
            </div>

            <div className='flex flex-wrap items-center gap-4 mt-1 md:justify-center'>
              <a
                href='https://tix.africa/discover/ods2026'
                target='_blank'
                rel='noopener noreferrer'
                className='bg-[#178A2D] font-semibold h-10 min-w-[161px] rounded flex justify-center items-center tracking-[0.2px] text-white'
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
      </div>
      {/* <div> */}
      <CountDown />
      {/* </div> */}
      <div className='art-bg' />
    </div>
  );
}

export default Hero;
