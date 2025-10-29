interface ModalProps {
  onClose: () => void;
  
 
}

function ComingSoon({ onClose }: ModalProps) {
  return (
    <div className='fixed inset-0 flex items-center justify-center z-50'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 z-40'
        onClick={onClose}
        aria-hidden='true'
      ></div>

      {/* Modal Content */}
      <div
        className='w-[95%] max-w-[542px] h-[362px] mx-auto relative z-50 bg-[#FFFFFF] rounded-[12px] p-8 md:px-[56px] md:py-[68px] flex flex-col justify-center items-center'
        role='dialog'
        aria-labelledby='modal-title'
        aria-describedby='modal-description'
      >
        {/* <button
          className='absolute top-4 right-4 text-[#70707B] text-[16px] font-bold'
          onClick={onClose}
          aria-label='Close modal'
        >
          &times;
        </button> */}
        <h5
          id='modal-title'
          className='text-[#1D1E2C] text-[20px] leading-[30px] font-semibold text-center mb-2'
        >
          Opening soon...
        </h5>
        <p
          id='modal-description'
          className='text-[#70707B] text-[14px] text-center leading-[150%] font-normal inter-gf '
        >
          Participants registration for Ogun Digital Summit 2025 will be opened by <span className='font-bold'>September 1st 2025.</span>
        </p>
        <p
          id='modal-description'
          className='text-[#70707B] text-[14px] text-center leading-[150%] font-normal inter-gf mb-4 '
        >
          Kindly follow us on X, Instagram and Tiktok @ogundgtsummit to stay updated”
        </p>
        <div className='flex justify-center items-center gap-10 w-full md:w-[376px] mx-auto bg-[#00000033] rounded-[16px] p-[11px]'>
          <a
            href='https://www.instagram.com/ogundgtsummit/'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img src='/img/instagram.png' alt='Instagram' className='w-6 h-6 cursor-pointer' />
          </a>
          <a href='https://x.com/ogundgtsummit' target='_blank' rel='noopener noreferrer'>
            <img src='/img/x.png' alt='X' className='w-6 h-6 cursor-pointer' />
          </a>
          <a href='https://www.tiktok.com/@ogundgtsummit' target='_blank' rel='noopener noreferrer'>
            <img src='/img/tiktok.png' alt='TikTok' className='w-6 h-6 cursor-pointer' />
          </a>
        </div>
      </div>
    </div>
  );
}

export default ComingSoon;
