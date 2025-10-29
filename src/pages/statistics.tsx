import Nav from "@/components/local/nav"
import { ArrowRight } from '@/assets/icons';
import Merch from "@/components/local/merch";
import MobileApp from "@/components/local/mobileApp";
import Footer from "@/components/local/footer";
import BarChartComponent from "@/components/local/barchart";


const Statistics = () => {
    const cardValues = [
        {id: 1, attendees: 7265, title: 'Total Attendees', bg: '#EDEEFC'},
        {id: 1, attendees: 3671, title: 'Total Registered', bg: '#E6F1FD'},
        {id: 1, attendees: 36, title: 'Total Speakers', bg: '#E2EFE4'},
    ]
  return (
    <div>
        <div className='container max-md:px-5'>
            <Nav />
        </div>
        <div className="max-w-[713px] mx-0 md:mx-auto my-0 md:my-[148px] px-[20px] md:px-0 py-10 md:py-0">
            <h1 className="platypi-gf font-[600] text-[#23323F] text-[34px] md:text-[60px] md:text-center leading-[40px] md:leading-[64px] tracking-[-0.5%] md:tracking-[-1%] mb-[32px]">Our Journey So Far</h1>
            <p className="font-[400] text-[14px] md:text-[16px] text-[#627587] md:text-center leading-[22px] md:leading-[24px] tracking-[0.2%] mb-[24px] md:mb-[32px]">
                From our start to now, the Ogun Digital Summit has grown into a key player in driving digital change, connecting visionaries, 
                and empowering communities across Ogun State.
            </p>
            <a target='_blank'>
              <button className='bg-[#178A2D] font-semibold h-10 min-w-[110px] md:mx-auto rounded-[2px] flex justify-center items-center tracking-[0.2px] text-[#fff]'>
                <span className='text-[14px] leading-[20px] tracking-[0.2px] font-semibold'>Register</span>
                <ArrowRight fill='#fff' />
              </button>
            </a>
        </div>
        <div className='art-bg' />
        <div className=" py-[83px] px-[16px] md:px-0">
            <div className="flex justify-center flex-col md:flex-row items-center gap-[28px]">
                {cardValues.map((cardValue) => (<div className='w-full md:w-[200px] rounded-[16px] p-[24px]' key={cardValue.id} style={{background:cardValue.bg}}>
                    <h2 className="font-regular text-[14px] text-[#000] leading-[20px] mb-[8px]">{cardValue.title}</h2>
                    <p>{cardValue.attendees}</p> 
                </div>))}
            </div>
            <BarChartComponent />
        </div>
        <Merch />
        <MobileApp />
        <Footer />
    </div>
  )
}

export default Statistics