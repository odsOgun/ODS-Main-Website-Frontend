import React from 'react';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-3'>
      <div
        className='absolute top-0 left-0 w-full h-full bg-[#000000] bg-opacity-70 cursor-pointer'
        onClick={onClose}
      />
      <div className='relative z-10'>{children}</div>
    </div>
  );
};

export default Modal;
