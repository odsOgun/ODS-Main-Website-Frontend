import { useState, useEffect } from 'react';
import IMG_0063 from '/src/assets/img/register/ODS2025-1.jpg';
import IMG_0064 from '/src/assets/img/register/ODS2025-2.jpg';
import IMG_0134 from '/src/assets/img/register/ODS2025-3.jpg';
import IMG_0661 from '/src/assets/img/register/ODS2025-4.jpg';
import IMG_0726 from '/src/assets/img/register/ODS2025-5.jpg';
import IMG_0751 from '/src/assets/img/register/ODS2025-6.jpg';
import IMG_2007 from '/src/assets/img/register/ODS2025-7.jpg';
import IMG_9798 from '/src/assets/img/register/ODS2025-8.jpg';
import IMG_9851 from '/src/assets/img/register/ODS2025-9.jpg';
import IMG_9927 from '/src/assets/img/register/ODS2025-10.jpg';

const SlideShow = () => {
  const images = [
    IMG_0063,
    IMG_0064,
    IMG_0134,
    IMG_0661,
    IMG_0726,
    IMG_0751,
    IMG_2007,
    IMG_9798,
    IMG_9851,
    IMG_9927
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className='relative h-screen overflow-hidden'>
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            style={{ backgroundImage: `url(${image})` }}
            className='h-full w-full bg-cover bg-center'
          />
        </div>
      ))}

      {/* Slide indicators */}
      {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div> */}
    </div>
  );
};

export default SlideShow;
