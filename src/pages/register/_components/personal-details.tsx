import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input2';
import { cn } from '@/lib/utils';
import { DESCRIPTIONS } from '@/lib/constants';
import { Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button2';

interface PersonalDetailsData {
  fullName: string;
  email: string;
  phoneNumber: string;
  aboutYou: string[];
  schoolCompany?: string;
}

interface PersonalDetailsProps {
  onContinue: (data: PersonalDetailsData) => void;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  aboutYou?: string;
  schoolCompany?: string;
}

export default function PersonalDetails({ onContinue }: PersonalDetailsProps) {
  const [selectedDescriptions, setSelectedDescriptions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    schoolCompany: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleDescription = (description: string) => {
    setSelectedDescriptions((prev) => {
      const newDescriptions = prev.includes(description)
        ? prev.filter((d) => d !== description)
        : [...prev, description];

      // Clear descriptions error when user selects at least one
      if (newDescriptions.length > 0 && errors.aboutYou) {
        setErrors((prev) => ({ ...prev, aboutYou: undefined }));
      }

      return newDescriptions;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific field error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Check if school/company field should be shown
  const shouldShowSchoolCompany = selectedDescriptions.some(
    (desc) => desc === 'Student' || desc === 'Software engineer'
  );

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

    // Validate descriptions
    if (selectedDescriptions.length === 0) {
      newErrors.aboutYou = 'Please select at least one description';
    }

    // Validate school/company if shown
    if (shouldShowSchoolCompany && !formData.schoolCompany.trim()) {
      newErrors.schoolCompany = 'Company/School name is required';
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
      // Simulate API call delay (remove in real implementation)
      // await new Promise((resolve) => setTimeout(resolve, 500));

      const personalDetailsData: PersonalDetailsData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: formData.phoneNumber.trim(),
        aboutYou: selectedDescriptions,
        ...(shouldShowSchoolCompany && { schoolCompany: formData.schoolCompany.trim() })
      };

      onContinue(personalDetailsData);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle submission error here
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
          <label className='text-sm mb-2 text-gray-1 block'>What best describes you</label>
          <div className='flex flex-wrap gap-2 mt-3'>
            {DESCRIPTIONS.map((description) => {
              const isSelected = selectedDescriptions.includes(description);
              return (
                <button
                  type='button'
                  key={description}
                  className={cn(
                    'border rounded-full',
                    isSelected ? '!border-gray-0' : 'border-transparent'
                  )}
                  onClick={() => toggleDescription(description)}
                >
                  <Badge
                    variant='outline'
                    className={cn(
                      'cursor-pointer !border h-[35px] transition-all py-2 px-4 duration-200 rounded-full text-sm font-normal text-gray-0',
                      isSelected ? '!border-gray-0' : 'border-gray-2'
                    )}
                  >
                    {description}
                    <span className='ml-1 text-xs'>
                      {isSelected ? <Check className='size-4' /> : <Plus className='size-4' />}
                    </span>
                  </Badge>
                </button>
              );
            })}
          </div>
          {errors.aboutYou && <p className='text-red-500 text-xs mt-1'>{errors.aboutYou}</p>}
        </div>

        {/* Conditional School/Company field */}
        {shouldShowSchoolCompany && (
          <div>
            <label htmlFor='schoolCompany' className='text-sm mb-2 text-gray-1 block'>
              Company/School
            </label>
            <Input
              id='schoolCompany'
              name='schoolCompany'
              placeholder='Enter your company or school name'
              value={formData.schoolCompany}
              onChange={handleInputChange}
              className={cn(errors.schoolCompany && 'border-red-500')}
            />
            {errors.schoolCompany && (
              <p className='text-red-500 text-xs mt-1'>{errors.schoolCompany}</p>
            )}
          </div>
        )}

        <div className='flex justify-between mt-9'>
          <Button type='submit' className='w-fit' disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Continue'}
          </Button>
        </div>
      </form>
    </div>
  );
}
