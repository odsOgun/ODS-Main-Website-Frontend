import { useEffect } from 'react';

function StudioPage() {
  useEffect(() => {
    window.location.replace('http://localhost:3333/studio');
  }, []);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-[#101611]'>
      <div className='w-8 h-8 border-4 border-[#178A2D] border-t-transparent rounded-full animate-spin mb-4' />
      <p className='text-[#B0C5D6] text-sm'>Opening Sanity Studio…</p>
    </div>
  );
}

export default StudioPage;
