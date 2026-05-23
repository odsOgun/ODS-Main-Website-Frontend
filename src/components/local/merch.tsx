import { ArrowRight } from '@/assets/icons';
import Merch1 from '@/assets/img/merch1.png';
import Merch2 from '@/assets/img/merch2.png';
import Merch3 from '@/assets/img/merch3.png';
import Merch4 from '@/assets/img/merch4.png';

const Merch = () => {
  return (
    <div className='mx-auto w-[90%] md:max-w-[1120px] mt-20'>
      <div className='md:basis-1/2 md:w-[479px]'>
        <h1 className='text-[#23323F] text-2xl md:text-4xl platypi-gf font-semibold'>
          Get the Ogun digital summit ‘26 Merch
        </h1>
        <p className='text-base font-normal tracking-[0.2px] text-[#627587] my-5'>
          We have various nice branded Ogun Digital Summit ‘24 merch
        </p>
        <a href='https://selar.co/m/ods2024' target='_blank'>
          <button className='bg-[#178A2D] font-semibold h-10 w-full max-w-[135px] rounded flex justify-center items-center tracking-[0.2px] text-white'>
            <span className='text-sm font-semibold'>Shop Merch</span>
            <ArrowRight />
          </button>
        </a>
      </div>
      <div className='bg-[#F7F8F8] border-[#F2F3F4]  min-h-[285px] flex flex-wrap justify-center items-center mt-[48px] mb-[100px] md:mt-[80px]'>
        <img src={Merch1} alt='merch' />
        <img src={Merch2} alt='merch' />
        <img src={Merch3} alt='merch' />
        <img src={Merch4} alt='merch' />
      </div>
    </div>
  );
};

export default Merch;
