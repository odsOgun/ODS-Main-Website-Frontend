interface ModalProps {
  onClose: () => void;
}

function SpeakerModal({ onClose }: ModalProps) {
  return (
    <div className='fixed inset-0 flex items-center justify-center z-50'>
      {/* Backdrop */}
      <div className='absolute inset-0 z-40' onClick={onClose} aria-hidden='true'></div>

      {/* Modal Content */}
      <div
        className='w-[95%] max-w-[542px] mx-auto relative z-50 bg-[#FFFFFF] rounded-[12px] p-8 md:px-[56px] md:py-[68px] flex flex-col justify-center items-center'
        role='dialog'
        aria-labelledby='modal-title'
        aria-describedby='modal-description'
      >
        <button
          className='absolute top-4 right-4 text-[#70707B] text-[24px] font-bold'
          onClick={onClose}
          aria-label='Close modal'
        >
          &times;
        </button>
        <h5
          id='modal-title'
          className='text-[#1D1E2C] text-[20px] leading-[30px] font-semibold text-center mb-4'
        >
          Speaker Applications Are Closed
        </h5>
        <p
          id='modal-description'
          className='text-[#70707B] text-[16px] text-center leading-[150%] font-normal inter-gf mb-4'
        >
          Thank you for your interest in speaking at Ogun Digital Summit 2026.The speaker
          application form is now closed. If you submitted an application, kindly look out for
          further communication from the ODS team. If you were unable to apply before the form
          closed, we appreciate your interest and hope to hear from you in the next edition. See you
          at ODS 2026.
        </p>
      </div>
    </div>
  );
}

export default SpeakerModal;
