import { useEffect, useState } from 'react';
import Modal from './modal';
import DownloadReportModal from './form/downloadReport';

function DownloadReportProvider({ children }: { children: React.ReactNode }) {
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const handleOpen = () => setShowReportModal(true);
    window.addEventListener('openDownloadReportModal', handleOpen);

    return () => window.removeEventListener('openDownloadReportModal', handleOpen);
  }, []);

  const closeReportModal = () => setShowReportModal(false);

  return (
    <>
      {children}
      <Modal show={showReportModal} onClose={closeReportModal}>
        <DownloadReportModal onClose={closeReportModal} />
      </Modal>
    </>
  );
}

export default DownloadReportProvider;
