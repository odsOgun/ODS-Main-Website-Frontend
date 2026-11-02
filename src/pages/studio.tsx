import { Studio } from 'sanity';
import config from '@/studio/sanity.config';
import { useEffect } from 'react';

function StudioPage() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
      <Studio config={config} />
    </div>
  );
}

export default StudioPage;
