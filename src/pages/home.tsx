import { useState } from 'react';
import Hero from '@/components/local/hero';
import MobileApp from '@/components/local/mobileApp';
import Nav from '@/components/local/nav';
import SectionOne from '@/components/local/sectionOne';
import SectionTwo from '@/components/local/sectionTwo';
import Footer from '@/components/local/footer';
import Merch from '@/components/local/merch';
import SponsorForm from '@/components/form/sponsor';
import ExhibitorsForm from '@/components/form/exhibitor';
import Modal from '@/components/modal';
import SucessModal from '@/components/form/sucessModal';
import ComingSoon from '@/components/comingModal';

function Home() {
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

  return (
    <div>
      <div className='container max-md:px-5'>
        <Nav />
      </div>
      <Hero />
      <SectionOne />
      <SectionTwo
      // onOpenSponsorModal={openSponsorModal}
      // onOpenExhibitorModal={openExhibitorModal}
      // onOpenComingModal={openComingModal}
      />
      <div>
        <Merch />
      </div>
      <div>
        <MobileApp />
      </div>
      <div>
        <Footer />
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
      <Modal show={showComingModal} onClose={closeComingModal}>
        <ComingSoon onClose={closeComingModal} />
      </Modal>
    </div>
  );
}

export default Home;
