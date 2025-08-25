import { useState } from 'react';
import { BsArrowLeftShort } from 'react-icons/bs';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { ToastContainer, toast } from 'react-toastify';

interface ModalProps {
  onClose: () => void;
  openModal: () => void;
}
const initialFormData = {
  fullName: '',
  email: '',
  organisation: '',
  phoneNumber: ''
};
function ExhibitorsForm({ onClose, openModal }: ModalProps) {
  const [formData, setFormData] = useState(initialFormData);

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    organisation: '',
    phoneNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors({
      fullName: '',
      email: '',
      organisation: '',
      phoneNumber: ''
    });
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePhoneChange = (phone: string) => {
    setFormData({
      ...formData,
      phoneNumber: phone
    });
  };

  const validate = () => {
    let valid = true;
    const errors = {
      fullName: '',
      email: '',
      organisation: '',
      phoneNumber: ''
    };

    if (!formData.fullName) {
      errors.fullName = 'Full Name is required';
      valid = false;
    }

    if (!formData.email) {
      errors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid';
      valid = false;
    }

    if (!formData.organisation) {
      errors.organisation = 'Organization Name is required';
      valid = false;
    }

    if (!formData.phoneNumber || formData.phoneNumber.length !== 13) {
      errors.phoneNumber = 'Phone Number is required or invalid';
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      try {
        const response = await fetch('https://ods2025.onrender.com/api/v1/exhibitor/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        const responseData = await response.json();

        if (responseData.message === 'Successful.') {
          openModal();
          setFormData(initialFormData);
          setIsLoading(false);
        } else {
          toast.error(responseData.message);
          setIsLoading(false);
        }
      } catch (error) {
        toast.error('Error submitting form:' + error);
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <div className='max-w-[640px] h-[95vh] mx-auto relative z-10 bg-[#FFFFFF] rounded-[20px] p-8 md:p-20 overflow-y-auto'>
        <ToastContainer />
        <div className='flex justify-start gap-16 sm:gap-20 items-center mb-4'>
          <div onClick={onClose}>
            <BsArrowLeftShort className='cursor-pointer text-[#787676] w-6 h-6  ' />
          </div>
          <h1 className='text-[#000000] text-[20px] md:text-[32px] leading-[31.2px] md:leading-[60px] font-bold text-center'>
            Exhibitors Form
          </h1>
        </div>
        <p className='text-[#70707B] text-[14px] text-center leading-[21px] font-normal mb-10'>
          Would you like to showcase your business/startup to over 5,000 audience at Ogun Digital
          Summit? Please fill out the form below and our team will reach out to you on the next
          step.
        </p>
        <form onSubmit={handleSubmit}>
          <div className='flex flex-wrap gap-3 mb-6'>
            <label htmlFor='fullName' className='text-[#70707B] text-[14px] '>
              Full Name
            </label>
            <input
              placeholder='John Doe'
              type='text'
              id='fullName'
              name='fullName'
              value={formData.fullName}
              onChange={handleChange}
              className='border border-[#D9DCE1] py-[13.5px] px-4 w-full rounded-[5px]'
            />
            {errors.fullName && <p className='text-red-500 text-xs'>{errors.fullName}</p>}
          </div>
          <div className='flex flex-wrap gap-3 mb-6'>
            <label htmlFor='email' className='text-[#70707B] text-[14px] '>
              Email
            </label>
            <input
              placeholder='johndoe@gmail.com'
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='border border-[#D9DCE1] py-[13.5px] px-4 w-full rounded-[5px]'
            />
            {errors.email && <p className='text-red-500 text-xs'>{errors.email}</p>}
          </div>
          <div className='flex flex-wrap gap-3 mb-6'>
            <label htmlFor='organisation' className='text-[#70707B] text-[14px] '>
              Organization Name
            </label>
            <input
              placeholder='Enter organization name'
              type='text'
              id='organisation'
              name='organisation'
              value={formData.organisation}
              onChange={handleChange}
              className='border border-[#D9DCE1] py-[13.5px] px-4 w-full rounded-[5px]'
            />
            {errors.organisation && <p className='text-red-500 text-xs'>{errors.organisation}</p>}
          </div>
          <div className='flex flex-wrap gap-3 mb-10'>
            <label htmlFor='phoneNumber' className='text-[#70707B] text-[14px] '>
              Phone Number
            </label>
            <PhoneInput
              country={'ng'}
              placeholder='Enter phone number'
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
            />
            {errors.phoneNumber && <p className='text-red-500 text-xs'>{errors.phoneNumber}</p>}
          </div>
          <div className='flex justify-center'>
            <button className='bg-[#178A2D] font-semibold h-10 w-[190px] text-sm text-[#ffff] rounded-[2px] items-center tracking-[0.2px] text-[#23323F] !self-center'>
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
      {/* <div className='absolute top-0 left-0 w-full h-full bg-[#000000] bg-opacity-70 z-5'></div> */}
    </div>
  );
}

export default ExhibitorsForm;
