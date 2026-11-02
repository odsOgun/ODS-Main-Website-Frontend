// import Nav from "@/components/local/nav";
import MobileApp from '@/components/local/mobileApp';
import keyboard_arrow_right from '../assets/img/keyboard_arrow_right.png';
import Grazacblue from '../assets/img/Grazacblue.png';
import Grazacborder from '../assets/img/Grazacborder.png';
import Afex from '../assets/img/Afexcard.png';
import techeconomycard from '../assets/img/techeconomycard.png';
import Oguncard from '../assets/img/Oguncard.png';
import Afexcard1 from '../assets/img/Afexcard1.png';
import Afexcard2 from '../assets/img/Afexcard2.png';
import techeconomycard1 from '../assets/img/techeconomycard1.png';
import users from '../assets/img/users.png';
import facestar from '../assets/img/facestar.png';
import database from '../assets/img/database.png';
import africa from '../assets/img/africa.png';
import smallgrazac from '../assets/img/smallgrazac.png';
import smallgrazac1 from '../assets/img/smallgrazac1.png';
import smallafex from '../assets/img/smallafex.png';
import smalltechnoeconomy from '../assets/img/smalltechnoeconomy.png';
import smallogundaily from '../assets/img/smallogundaily.png';
import capsafex from '../assets/img/capsafex.png';
import smallogun from '../assets/img/smallogun.png';
import Nav from '@/components/local/nav';
import Footer from '@/components/local/footer';

const Exhibitor = () => {
  return (
    <div>
      <div className='container max-md:px-5'>
        <Nav />
      </div>
      {/* Hero */}
      <div className="  shrink-0     lg:w-[100%] lg:h-[618px] object-contain bg-[url('src/assets/img/Stagex.png')]">
        <h1 className='font-[Platypi] text-3xl font-semibold text-[#fff] w-[343px] h-[80px] leading-9 tracking-tighter pt-[241px] pl-[16px] pr-[16px]       lg:font-[Platypi] lg:font-semibold lg:text-[#fff] lg:w-[765px] lg:h-[128px] lg:text-6xl lg:leading-[3.75rem] lg:pt-[226px] lg:pl-[60px] lg:tracking-tighter '>
          Exhibitors making a mark at ODS’25
        </h1>
        <p className=' text-sm leading-5   pl-[16px] pr-[16px]   pt-[90px]                                 font-[inter] lg:w-[765px] lg:h-[72px] text-[#B0C5D6] font-normal lg:text-base lg:leading-6 lg:pt-[150px] lg:pl-[60px]'>
          It all started with a dream in 2020 to bring together startup entrepreneurs, talents,
          creatives and founders with a strong focus to promote youth empowerment, tech
          entrepreneurship and social innovation.
        </p>
        <button className='flex  font-[inter] font-semibold text-sm rounded ml-[16px]  pt-[10px] pr-[12px] pb-[10px] pl-[12px] lg:ml-[60px] lg:mt-[100px] mt-[16px]  bg-[#ACFAAC] w-[155px]'>
          Join Exhibitors <img className='' src={keyboard_arrow_right} alt='' />
        </button>
      </div>
      {/* Meet Our Exhibitors */}
      <div className=' h-[946px]                 pt-[100px]        lg:w-[100%] lg:h-[812px] bg-[#101611]'>
        <h2 className=' h-[40px] mt-[80px] font-[Platypi] font-semibold text-[#F2F9FF] pl-[16px]     lg:pl-[60px] pt-[100px] text-3xl  leading-10 tracking-tighter'>
          Meet Our Exhibitors
        </h2>
        <p className='text-sm leading-5 font-[inter] font-normal text-[#B0C5D6]  pl-[16px]  lg:leading-6  tracking-wide lg:text-base pt-[40px] lg:pl-[60px]'>
          Have a glimpse of our exhibitors at the ODS’25
        </p>

        <div className='hidden lg:block'>
          <div className=' flex justify-between align-center gap-[32px] ml-[60px] mr-[60px] mt-[48px]'>
            <div>
              <img src={Grazacblue} alt='grazacbluecard' />
            </div>
            <div>
              <img src={Grazacborder} alt='grazaccard' />
            </div>
            <div>
              <img src={Afex} alt='Afexcard1' />
            </div>
            <div>
              <img src={techeconomycard} alt='economycard' />
            </div>
          </div>
          <div className='flex justify-between align-center gap-[32px] ml-[60px] mr-[60px] mt-[32px] '>
            <div>
              <img src={Oguncard} alt='oguncardcard' />
            </div>
            <div>
              <img src={Afexcard1} alt='afexcard' />
            </div>
            <div>
              <img src={Afexcard2} alt='afexcard2' />
            </div>
            <div>
              <img src={techeconomycard1} alt='techeconomycard' />
            </div>
          </div>
        </div>
        <div className=' lg:hidden'>
          <div className='flex justify-between align-center mt-[32px] '>
            <div className='w-[50%] ml-[16px] mr-[16px]'>
              <img src={smallgrazac} alt='mobilegrazac' />
            </div>
            <div className='w-[50%] ml-[16px] mr-[16px]'>
              <img src={smallgrazac1} alt='mobilegrazac1' />
            </div>
          </div>
          <div className='flex justify-between align-center '>
            <div className='w-[50%] ml-[16px] mr-[16px]'>
              <img src={smallafex} alt='mobileafexcard' />
            </div>
            <div className='w-[50%] ml-[16px] mr-[16px]'>
              <img src={smalltechnoeconomy} alt='mobiletechoeconmycard' />
            </div>
          </div>
          <div className='flex justify-between align-center '>
            <div className='w-[50%] ml-[16px] mr-[16px]'>
              <img src={smallogundaily} alt='mobileogundaily' />
            </div>
            <div className='w-[50%] ml-[16px] mr-[16px]'>
              <img src={capsafex} alt='mobilecapafexcard' />
            </div>
          </div>
          <div className='flex justify-between align-center '>
            <div className='w-[50%] ml-[16px] mr-[16px]'>
              <img src={smallogun} alt='mobileoguncard' />
            </div>
          </div>
        </div>
      </div>
      {/*Leading Companies  */}
      <div className='w-[100%] h-[1,296px]   lg:w-[100%] lg:h-[766px] bg-[#101611] pt-[100px]'>
        <h2 className=' leading-9 ml-[20px] mr-[20px] lg:mt-[8px] font-[Playtpi] font-semibold text-[#F2F9FF] lg:w-[700px] lg:h-[120px] text-3xl lg:leading-10 tracking-tighter lg:ml-[60px] '>
          Why Leading Companies Choose to <br /> Exhibit at Ogun Digital Summit Every <br />
          Year
        </h2>
        <p className='font-[Inter]   font-normal ml-[20px] mr-[20px]         mt-[16px] text-[#B0C5D6] lg:w-[700px] lg:h-[88px] lg:ml-[60px] text-sm'>
          Ogun Digital Summit is where the global tech ecosystem converges—offering exhibitors a
          unique opportunity to connect with visionary tech talents, entrepreneurs, investors, and
          industry leaders, all in one place. It's the ideal platform to showcase your innovations,
          foster key relationships, and be a part of the continuous cycle of tech advancement.
        </p>
        <div className='flex lg:flex-row flex-col justify-between align-center ml-[20px] mr-[20px]  lg:mr-[60px]  mt-[80px]'>
          <div className='lg:ml-[40px]  '>
            <img src={users} alt='usersicon' />
            <h4 className='mt-[8px]  h-[24px] text-[#F2F9FF] font-[inter] font-semibold text-lg leading-6 tracking-wide'>
              Reach a Targeted Audience
            </h4>
            <p className=' h-[88px] lg:w-[544px] lg:h-[44px] text-[#B0C5D6] text-sm font-normal'>
              You can directly and indirectly learn and engage with industry experts, offering
            </p>
          </div>
          <div className='lg:mr-[60px] '>
            <img src={africa} alt='africaicon' />
            <h4 className='mt-[8px] w-[255px] h-[24px] text-[#F2F9FF] font-semibold text-lg leading-6 tracking-wide'>
              Boost Brand Visibility
            </h4>
            <p className='lg:w-[544px] lg:h-[44px] text-[#B0C5D6] text-sm font-normal'>
              We bring together the best talents in Nigeria tech ecosystem to create opportunities
              for professional growth and aid collaboration and <br /> partnerships.
            </p>
          </div>
        </div>
        <div className='flex  lg:flex-row flex-col  justify-between align-center  ml-[20px] mr-[20px]  mt-[32px]'>
          <div className='lg:ml-[40px]'>
            <img src={database} alt='databaseicon' />
            <h4 className='mt-[8px] text-[#F2F9FF] font-[inter]  font-semibold text-lg leading-6 tracking-wide'>
              Network with Industry Leaders
            </h4>
            <p className=' lg:w-[544px] lg:h-[44px] text-[#B0C5D6] text-sm font-normal'>
              The world is growing at a very fast pace with new technologies like AI and blockchain
              having a strong effect on our daily lives. We analyse and help you on how to best
              adapt for these changes
            </p>
          </div>
          <div className='lg:mr-[60px]'>
            <img src={facestar} alt='' />
            <h4 className=' mt-[8px] text-[#F2F9FF] font-[inter] font-semibold text-lg leading-6  tracking-wide'>
              Have Fun and Unwind
            </h4>
            <p className='  lg:w-[544px] lg:h-[66px] text-[#B0C5D6] text-sm font-normal'>
              Our ambience and environment provides the right avenue and space to <br /> regain
              motivation and energy not just to grow your talent but to innovate <br /> and create
              new ideas.
            </p>
          </div>
        </div>
      </div>
      <div>
        <MobileApp />
      </div>
      <Footer />
    </div>
  );
};

{
  /* <div>
  <Nav/>
</div> */
}

export default Exhibitor;
