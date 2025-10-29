import { useState } from 'react';
import { Input } from '@/components/ui/input2';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button2';

interface PersonalDetailsData {
  fullName: string;
  email: string;
  phoneNumber: string;
  jobRole: string;
  schoolCompany: string;
  isNyscCorpMember?: boolean;
}

interface PersonalDetailsProps {
  onContinue: (data: PersonalDetailsData) => void;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  jobRole?: string;
  schoolCompany?: string;
  isNyscCorpMember?: string;
}

export default function PersonalDetails({ onContinue }: PersonalDetailsProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    jobRole: '',
    schoolCompany: '',
    isNyscCorpMember: undefined as boolean | undefined
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific field error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleNyscSelection = (isNyscMember: boolean) => {
    setFormData((prev) => ({ ...prev, isNyscCorpMember: isNyscMember }));

    // Clear NYSC error when user makes selection
    if (errors.isNyscCorpMember) {
      setErrors((prev) => ({ ...prev, isNyscCorpMember: undefined }));
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate phone number
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (formData.phoneNumber.trim().length < 10) {
      newErrors.phoneNumber = 'Phone number must be at least 10 characters';
    }

    // Validate job role
    if (!formData.jobRole.trim()) {
      newErrors.jobRole = 'Job role is required';
    }

    // Validate school/company
    if (!formData.schoolCompany.trim()) {
      newErrors.schoolCompany = 'Company/Organization/School name is required';
    }

    // Validate NYSC selection
    if (formData.isNyscCorpMember === undefined) {
      newErrors.isNyscCorpMember = 'Please select your NYSC status';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const personalDetailsData: PersonalDetailsData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: formData.phoneNumber.trim(),
        jobRole: formData.jobRole.trim(),
        schoolCompany: formData.schoolCompany.trim(),
        isNyscCorpMember: formData.isNyscCorpMember
      };

      onContinue(personalDetailsData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='w-full'>
      <form className='space-y-4' onSubmit={handleSubmit}>
        <div>
          <label htmlFor='fullName' className='text-sm mb-2 text-gray-1 block'>
            What's your name
          </label>
          <Input
            id='fullName'
            name='fullName'
            placeholder='Enter your full name'
            value={formData.fullName}
            onChange={handleInputChange}
            className={cn(errors.fullName && 'border-red-500')}
          />
          {errors.fullName && <p className='text-red-500 text-xs mt-1'>{errors.fullName}</p>}
        </div>

        <div>
          <label htmlFor='email' className='text-sm mb-2 text-gray-1 block'>
            Your email address
          </label>
          <Input
            id='email'
            name='email'
            type='email'
            placeholder='email@example.com'
            value={formData.email}
            onChange={handleInputChange}
            className={cn(errors.email && 'border-red-500')}
          />
          {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
        </div>

        <div>
          <label htmlFor='phoneNumber' className='text-sm mb-2 text-gray-1 block'>
            Your phone number
          </label>
          <Input
            id='phoneNumber'
            name='phoneNumber'
            type='tel'
            placeholder='+2349160025821'
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className={cn(errors.phoneNumber && 'border-red-500')}
          />
          {errors.phoneNumber && <p className='text-red-500 text-xs mt-1'>{errors.phoneNumber}</p>}
        </div>

        <div>
          <label htmlFor='jobRole' className='text-sm mb-2 text-gray-1 block'>
            Job Role
          </label>
          <Input
            id='jobRole'
            name='jobRole'
            placeholder='Enter your job role'
            value={formData.jobRole}
            onChange={handleInputChange}
            className={cn(errors.jobRole && 'border-red-500')}
          />
          {errors.jobRole && <p className='text-red-500 text-xs mt-1'>{errors.jobRole}</p>}
        </div>

        <div>
          <label htmlFor='schoolCompany' className='text-sm mb-2 text-gray-1 block'>
            Company / Organization (Enter school name if you are a student)
          </label>
          <Input
            id='schoolCompany'
            name='schoolCompany'
            placeholder='Enter your company, organization, or school name'
            value={formData.schoolCompany}
            onChange={handleInputChange}
            className={cn(errors.schoolCompany && 'border-red-500')}
          />
          {errors.schoolCompany && (
            <p className='text-red-500 text-xs mt-1'>{errors.schoolCompany}</p>
          )}
        </div>

        <div>
          <label className='text-sm mb-2 text-gray-1 block'>Are you a NYSC corp member?</label>
          <div className='space-y-2 mt-3'>
            {/* No Option */}
            <button
              type='button'
              className={cn(
                'w-full p-4 border rounded-lg text-left transition-all duration-200',
                formData.isNyscCorpMember === false
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              )}
              onClick={() => handleNyscSelection(false)}
            >
              <div className='flex items-center justify-between'>
                <span className='text-gray-0'>No</span>
                {formData.isNyscCorpMember === false && (
                  <div className='w-6 h-6 rounded-full bg-green-500 flex items-center justify-center'>
                    <svg
                      className='w-4 h-4 text-white'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={3}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  </div>
                )}
              </div>
            </button>

            {/* Yes Option */}
            <button
              type='button'
              className={cn(
                'w-full p-4 border rounded-lg text-left transition-all duration-200',
                formData.isNyscCorpMember === true
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              )}
              onClick={() => handleNyscSelection(true)}
            >
              <div className='flex items-center justify-between'>
                <span className='text-gray-0'>Yes</span>
                {formData.isNyscCorpMember === true && (
                  <div className='w-6 h-6 rounded-full bg-green-500 flex items-center justify-center'>
                    <svg
                      className='w-4 h-4 text-white'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={3}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          </div>
          {errors.isNyscCorpMember && (
            <p className='text-red-500 text-xs mt-1'>{errors.isNyscCorpMember}</p>
          )}
        </div>

        <div className='flex justify-between mt-9'>
          <Button type='submit' className='w-fit' disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Continue'}
          </Button>
        </div>
      </form>
    </div>
  );
}
