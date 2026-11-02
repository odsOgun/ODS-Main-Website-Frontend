// interface ModalProps {
//   onClose: () => void;
//   Modal: () => void;
// }

function SucessModal() {
  //redirect to home page
  const redirectToHome = () => {
    window.location.href = '/';
  };
  return (
    <>
      <div className='max-w-[542px] m-auto relative z-10 bg-[#FFFFFF] rounded-[20px] p-8 md:px-16 overflow-y-auto'>
        <div className=' mb-2'>
          <h1 className='text-[#000000] text-[20px] md:text-[20px] leading-[31.2px] md:leading-[60px] font-bold text-center'>
            Application Received!
          </h1>
        </div>
        <p className='text-[#70707B] text-[14px] text-center leading-[21px] font-normal mb-8'>
          Your application has been sent successfully, our team will reach out to you for more
          information
        </p>
        <div className='flex justify-center'>
          <button
            onClick={redirectToHome}
            className='bg-[#178A2D] font-semibold h-10 w-[190px] text-sm text-[#ffff] rounded-[2px] items-center tracking-[0.2px] text-[#23323F] !self-center'
          >
            Done
          </button>
        </div>
      </div>
      {/* <div className='absolute top-0 left-0 w-full h-full bg-[#000000] bg-opacity-70 z-5'></div> */}
    </>
  );
}

export default SucessModal;
