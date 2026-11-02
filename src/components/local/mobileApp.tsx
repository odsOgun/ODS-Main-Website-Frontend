// import { AppStore, GoogleStore } from '@/assets/icons';
import AppImg from '@/assets/img/readme/appPic.png';
import AppImgDesktop from '@/assets/img/readme/appPicDesktop.png';
import comingSoon2 from '@/assets/img/comingSoon2.png';
import comingSoon1 from '@/assets/img/comingSoon1.png';

const MobileApp = () => {
  return (
    // p-20 px-5 md:px-40 md:py-[100px] changePadding
    <div className=''>
      <div className='max-w-[1120px] mx-auto my-0 w-full p-20 px-8 xl:box-content  '>
        <div className='flex flex-col items-center justify-center w-full md:flex-row md:justify-between md:items-start md:gap-[90px]  '>
          <div>
            <div className='flex flex-col gap-4 w-full max-w-[335px] md:max-w-[558px] '>
              <h3 className='platypi-gf text-center text-[#23323F] font-semibold text-2xl leading-[34px] tracking-[-0.5px] md:text-[40px] md:leading-[48px] md:tracking-[-1px] md:text-left changeFont-wh213o '>
                Unlocking Tech Innovations Without Boundaries
              </h3>
              <p className='text-center text-[#627587] text-sm leading-[22px] tracking-[0.2px] font-normal md:text-base md:text-left '>
                The ODS 25 Mobile App is your all-in-one tool for an immersive tech experience at
                your fingertip. Connect with like minds like never before
              </p>
            </div>
            <div className='flex items-center justify-center gap-4 mt-8 md:items-start md:justify-start'>
              {/* <AppStore /> */}
              <img src={comingSoon1} alt='coming soon ...' className=' max-w-[124px] h-[42px]' />
              {/* <GoogleStore /> */}
              <img src={comingSoon2} alt='coming soon ...' className=' max-w-[124px] h-[42px]' />
            </div>
          </div>

          <div className='mt-12 md:mt-0'>
            <img
              src={AppImg}
              alt='Ogun ODS App Pic'
              className='object-cover object-center w-full max-w-[335px] h-[290px] md:hidden'
            />
            <img
              src={AppImgDesktop}
              alt='Ogun ODS App Pic'
              className='object-contain object-top w-full max-md:hidden w-[472px] h-[432px]'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileApp;
