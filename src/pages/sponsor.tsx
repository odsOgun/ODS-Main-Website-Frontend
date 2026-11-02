// import pastspeakers from "../assets/img/pastspeakers.png";
import Nav from '@/components/local/nav';

const Sponsor = () => {
  return (
    <div>
      <div className='container max-md:px-5'>
        <Nav />
      </div>
      <div className="w-[100%] h-[618px] bg-[url('src/assets/img/pastspeakers.png')] ">
        <h1 className='w-[765px] h-[128px] pt-[389px] ml-[60px] leading-[3.75rem] tracking-wide text-[#F2F9FF] font-semibold text-6xl '>
          <span className='italic font-normal'>Past Speakers:</span> Leading Digital Transformation
        </h1>
        <p className='text-[#B0C5D6] pt-[141px] ml-[60px] font-[inter] font-normal text-base leading-6 tracking-wide'>
          Meet the speakers who discussed about diversities and culture in digital
          transformation{' '}
        </p>
      </div>
    </div>
  );
};

export default Sponsor;
