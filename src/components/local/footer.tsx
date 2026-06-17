import ODSlogo from '@/assets/img/ODSlogo.png';
import instagram from '@/assets/img/instagram.png';
import twitter from '@/assets/img/twitter.png';
import gmail from '@/assets/img/gmail.png';
import SponsorForm from '../form/sponsor';
import Modal from '../modal';
import ExhibitorsForm from '../form/exhibitor';
import SucessModal from '../form/sucessModal';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [showExhibitorModal, setShowExhibitorModal] = useState(false);
  const [showSucessModal, setShowSucessModal] = useState(false);

  // const openSponsorModal = () => setShowSponsorModal(true);
  const closeSponsorModal = () => setShowSponsorModal(false);

  // const openExhibitorModal = () => setShowExhibitorModal(true);
  const closeExhibitorModal = () => setShowExhibitorModal(false);
  const openSucessModal = () => setShowSucessModal(true);
  const closeSucessModal = () => setShowSucessModal(false);
  return (
    <div className='bg-[#101611]'>
      <div className='art-bg' />
      <div className='max-w-[1120px] mx-auto my-0 w-full p-20 px-8 xl:box-content'>
        <Link to='/'>
          <div className='flex justify-center align-center'>
            <img src={ODSlogo} alt='ogundigitalsummitlogo' />
          </div>
        </Link>

        <div className='flex justify-center align-center text-base font-semibold text-[#B0C5D6] pt-[48px] list-none gap-10 md:gap-16 leading-6 max-md:flex-col max-md:items-center'>
          <li>
            <a href='/about' target='_blank' rel='noopener noreferrer'>
              About
            </a>
          </li>
          {/* <li onClick={openSponsorModal} className='cursor-pointer'> */}
          <li className='cursor-pointer'>
            <a href='/register/sponsors'>Sponsors</a>
          </li>
          {/* <li>
            <a href='https://selar.co/m/ods2024' target='_blank' rel='noopener noreferrer'>
              Store
            </a>
          </li> */}
          {/* <li onClick={openExhibitorModal} className='cursor-pointer'> */}
          <li className='cursor-pointer'>
            <a href='/register/exhibitors'>Exhibitors</a>
          </li>
        </div>

        <div className='flex justify-around align-center mt-12 md:mt-[64px] max-md:flex-col max-md:items-center max-md:gap-12'>
          <div className='flex justify-center align-center gap-8'>
            <a
              href='https://www.instagram.com/ogundgtsummit'
              target='_blank'
              rel='noopener noreferrer'
            >
              <img src={instagram} alt='instagram logo' />
            </a>
            <a href='https://www.x.com/ogundgtsummit' target='_blank' rel='noopener noreferrer'>
              <img src={twitter} alt='twitter logo' />
            </a>
            <a href='mailto:hello@ogundigitalsummit.com' target='_blank' rel='noopener noreferrer'>
              <img src={gmail} alt='gmail logo' />
            </a>
          </div>

          <div className='text-[#627587] text-center text-xs md:text-base leading-[18px] md:leading-6 font-normal tracking-[-0.2px] md:tracking-[0.2px]'>
            <p>Copyright © 2026 Ogun Digital Summit. All rights reserved.</p>
          </div>
        </div>
      </div>
      <Modal show={showSponsorModal} onClose={closeSponsorModal}>
        <SponsorForm onClose={closeSponsorModal} openModal={openSucessModal} />
      </Modal>

      <Modal show={showExhibitorModal} onClose={closeExhibitorModal}>
        <ExhibitorsForm onClose={closeExhibitorModal} openModal={openSucessModal} />
      </Modal>

      <Modal show={showSucessModal} onClose={closeSucessModal}>
        <SucessModal />
      </Modal>
    </div>
  );
};

export default Footer;
