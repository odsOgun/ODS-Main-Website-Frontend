import { ArrowRight, ArrowRightGreen } from '@/assets/icons';
import ODSLogo from '@/assets/svgs/nav/ODSLogo.svg';
import ODSLogoMobile from '@/assets/svgs/nav/ODSLogo2.svg';
import MenuSvg from '@/assets/svgs/nav/menu.svg';
import { useState } from 'react';
import Sitelinks from '@/mock/sitelinks.json';
import { Link } from 'react-router-dom';
import Modal from '../modal';
import SponsorForm from '../form/sponsor';
import ExhibitorsForm from '../form/exhibitor';
import SucessModal from '../form/sucessModal';
import ComingSoon from '../comingModal';

function Nav() {
  // Define types for navigation items
  interface NavItemProps {
    label: string;
    hasIcon?: boolean;
    icon?: React.ReactNode;
    link?: string | (() => void);
  }
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [showExhibitorModal, setShowExhibitorModal] = useState(false);
  const [showSucessModal, setShowSucessModal] = useState(false);
  const [showComingModal, setShowComingModal] = useState(false);

  // const openSponsorModal = () => setShowSponsorModal(true);
  const closeSponsorModal = () => setShowSponsorModal(false);
  // const openComingModal = () => setShowComingModal(true);
  const closeComingModal = () => setShowComingModal(false);
  // const openExhibitorModal = () => setShowExhibitorModal(true);
  const closeExhibitorModal = () => setShowExhibitorModal(false);
  const openSucessModal = () => setShowSucessModal(true);
  const closeSucessModal = () => setShowSucessModal(false);

  const navItems: NavItemProps[] = [
    { label: 'Home', link: '/' },
    { label: 'About', link: '/about' },
    { label: 'Sponsor', link: '/register/sponsors' },
    // { label: 'Sponsor', link: openSponsorModal },
    { label: 'Store', link: 'https://selar.co/m/ods2024' },
    { label: 'Exhibitors', link: '/register/exhibitors' },
    // { label: 'Exhibitors', link: openExhibitorModal },
    { label: 'Speakers', link: '/speaker' }
  ];

  const [navState, setNavState] = useState<boolean>(false);

  return (
    <nav className={` flex items-center justify-center w-full`}>
      <div
        className={`flex items-center h-[54px] w-full py-2 max-w-[1120px] px-2 md:h-16 md:py-[10px] md:px-2 max-md:justify-between `}
      >
        <Link to='/'>
          <img src={ODSLogo} className='logo md:hidden' alt='ODS logo' />
          <img src={ODSLogoMobile} className='logo max-md:hidden' alt='ODS logo' />
        </Link>

        <div className='flex items-center justify-center flex-1 gap-4 text-sm font-semibold leading-6 text-[#627587] tracking-[0.2px] max-md:hidden'>
          {navItems.map((item, index) => {
            if (typeof item.link === 'string') {
              const target = item.link.startsWith('/') ? '_self' : '_blank';
              return (
                <a href={item.link} target={target} key={index}>
                  <div
                    className={`py-[2px] px-3 cursor-pointer ${
                      item.hasIcon ? 'flex justify-center items-center gap-[10px]' : ''
                    }`}
                  >
                    {item.label}
                  </div>
                </a>
              );
            } else if (typeof item.link === 'function') {
              return (
                <div
                  key={index}
                  onClick={item.link}
                  className={`py-[2px] px-3 cursor-pointer ${
                    item.hasIcon ? 'flex justify-center items-center gap-[10px]' : ''
                  }`}
                >
                  {item.label}
                </div>
              );
            }
            return null;
          })}
        </div>

        <button
          type='button'
          className='bg-[#178A2D] font-semibold h-10 min-w-[110px] w-[200px] rounded flex justify-center items-center text-white tracking-[0.2px] max-md:hidden'
          onClick={() => window.dispatchEvent(new Event('openDownloadReportModal'))}
        >
          <span className='text-sm font-semibold'>Download 2025 Report</span>
          <ArrowRight />
        </button>

        {/* mobile */}
        <div onClick={() => setNavState(!navState)}>
          <img src={MenuSvg} className='cursor-pointer md:hidden' alt='Hamburger' />
        </div>
      </div>
      {/* mobileNav */}

      <MobileNav />
    </nav>
  );

  function MobileNav() {
    return (
      <div className=''>
        <div
          className={`mobileNav fixed h-fit w-[90vw] left-4 bg-white px-5 pt-5 pb-10 md:hidden ${navState ? 'showNav' : ''}`}
          onClick={() => setNavState(!navState)}
        >
          <div className='flex flex-col w-full gap-6'>
            {navItems.map((item, index) => {
              if (typeof item.link === 'string') {
                const target = item.link?.startsWith('/') ? '_self' : '_blank';

                return (
                  <a
                    href={item?.link}
                    target={target}
                    key={index}
                    onClick={() => setNavState(!navState)}
                  >
                    <div className='flex items-center cursor-pointer h-7'>
                      <div className='font-semibold text-base leading-6 tracking-[0.2px] text-[#627587]'>
                        {item.label}
                      </div>
                    </div>
                  </a>
                );
              } else if (typeof item.link === 'function') {
                return (
                  <div
                    key={index}
                    onClick={item.link}
                    className={`font-semibold text-base leading-6 tracking-[0.2px] py-[2px] text-[#627587] cursor-pointer ${
                      item.hasIcon
                        ? 'flex justify-center text-[#627587] items-center gap-[10px]'
                        : ''
                    }`}
                  >
                    {item.label}
                  </div>
                );
              }
              return null;
            })}
          </div>
          <div className='flex flex-col items-center gap-6 mt-6'>
            <button
              type='button'
              className='w-full rounded bg-[#178A2D] font-semibold h-10 text-white tracking-[0.2px]'
              onClick={() => {
                window.dispatchEvent(new Event('openDownloadReportModal'));
                setNavState(!navState);
              }}
            >
              <span className='text-sm font-semibold'>Download 2025 Report</span>
              <ArrowRight />
            </button>
            <a href={Sitelinks.becomeAsponsor} target='_blank' className='w-full'>
              <button className='w-full rounded-[2px] h-6 bg-white flex justify-center items-center gap-2'>
                <span className='text-[#178A2D] text-sm font-semibold'>Become a sponsor</span>
                <ArrowRightGreen />
              </button>
            </a>
          </div>
        </div>
        {navState && (
          <div
            className='fixed right-0 top-0 w-[100vh] h-full bg-[#000000] bg-opacity-70 cursor-pointer z-10'
            onClick={() => setNavState(!navState)}
          ></div>
        )}
        <Modal show={showSponsorModal} onClose={closeSponsorModal}>
          <SponsorForm onClose={closeSponsorModal} openModal={openSucessModal} />
        </Modal>

        <Modal show={showExhibitorModal} onClose={closeExhibitorModal}>
          <ExhibitorsForm onClose={closeExhibitorModal} openModal={openSucessModal} />
        </Modal>

        <Modal show={showSucessModal} onClose={closeSucessModal}>
          <SucessModal />
        </Modal>
        <Modal show={showComingModal} onClose={closeComingModal}>
          <ComingSoon onClose={closeComingModal} />
        </Modal>
      </div>
    );
  }
}

export default Nav;
