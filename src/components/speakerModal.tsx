import { useId, type ReactNode } from 'react';

export interface SpeakerModalProps {
  onClose: () => void;
  title?: ReactNode;
  message?: ReactNode;
  closeLabel?: string;
  isOpen?: boolean;
}

function SpeakerModal({
  onClose,
  title = 'Speakers Application is now closed',
  message = 'Thank you for your interest in speaking at Ogun Digital Summit 2026. The speakers application form is now closed.',
  closeLabel = 'Close',
  isOpen = true
}: SpeakerModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 z-40 bg-black bg-opacity-50'
        onClick={onClose}
        aria-hidden='true'
      ></div>

      {/* Modal Content */}
      <div
        className='w-[95%] max-w-[542px] mx-auto relative z-50 bg-[#FFFFFF] rounded-[12px] p-8 md:px-[56px] md:py-[68px] flex flex-col justify-center items-center'
        role='dialog'
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <button
          type='button'
          className='absolute top-4 right-4 text-[#70707B] text-[24px] font-bold'
          onClick={onClose}
          aria-label='Close modal'
        >
          &times;
        </button>
        <h5
          id={titleId}
          className='text-[#1D1E2C] text-[20px] leading-[30px] font-semibold text-center mb-4'
        >
          {title}
        </h5>
        <p
          id={descriptionId}
          className='text-[#70707B] text-[16px] text-center leading-[150%] font-normal inter-gf mb-4'
        >
          {message}
        </p>
        <button
          type='button'
          onClick={onClose}
          className='mt-4 bg-[#178A2D] text-white px-6 py-2 rounded font-semibold'
        >
          {closeLabel}
        </button>
      </div>
    </div>
  );
}

export default SpeakerModal;
