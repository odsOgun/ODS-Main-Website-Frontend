import { X } from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const SuccessModal = ({ isOpen, onClose, title, message }: SuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='relative w-[90%] max-w-md rounded-2xl bg-white p-8 shadow-xl'>
        <button
          onClick={onClose}
          className='absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors'
        >
          <X size={24} />
        </button>

        <div className='flex flex-col items-center text-center'>
          <div className='relative mb-6'>
            <div className='absolute inset-0 rounded-full bg-green-100 opacity-50 scale-125' />
            <div className='relative flex h-16 w-16 items-center justify-center rounded-full bg-[#E6F8EE]'>
              <CheckCircle2 className='h-8 w-8 text-[#178A2D]' />
            </div>
          </div>

          <h2 className='mb-3 text-2xl font-bold text-[#0F172A]'>{title}</h2>
          <p className='text-sm leading-6 text-[#6B7280]'>{message}</p>

          <button
            onClick={onClose}
            className='mt-8 w-full rounded-full bg-[#0F172A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e293b]'
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
