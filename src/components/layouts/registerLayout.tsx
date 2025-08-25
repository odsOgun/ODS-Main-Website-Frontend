import { X } from 'lucide-react';
import SlideShow from '../register/slideShow';
import { useNavigate } from 'react-router-dom';

function RegisterLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <div className='w-screen h-screen flex items-start overflow-hidden min-h-dvh'>
      <div className='w-1/4 h-full hidden md:block'>
        <SlideShow />
      </div>
      <div
        className='absolute top-4 right-4 bg-white rounded-full p-2'
        onClick={() => navigate('/')}
      >
        <X />
      </div>
      <div className='w-full md:w-3/4 h-full min-h-dvh overflow-y-auto pb-10'>{children}</div>
    </div>
  );
}

export default RegisterLayout;
