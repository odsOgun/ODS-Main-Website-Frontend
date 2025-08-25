import { useState, useEffect } from 'react';

const SlideShow = () => {
  const images = [
    '/src/assets/img/register/IMG_0063.jpg',
    '/src/assets/img/register/IMG_0134.jpg',
    '/src/assets/img/register/IMG_0661.jpg',
    '/src/assets/img/register/IMG_0726.jpg',
    '/src/assets/img/register/IMG_0751.jpg',
    '/src/assets/img/register/IMG_2007.jpg',
    '/src/assets/img/register/IMG_9798.jpg',
    '/src/assets/img/register/IMG_9851.jpg',
    '/src/assets/img/register/IMG_9927.jpg'
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
