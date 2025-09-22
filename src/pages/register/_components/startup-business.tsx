import { Badge } from '@/components/ui/badge';
import Check from '@/components/ui/check';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button2';
import { Input } from '@/components/ui/input2';
import { STARTUP_BUSINESS_OPTIONS, REFERRAL_SOURCE_OPTIONS } from '@/lib/constants';
import { apiService } from '@/api/apiService';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface StartupBusinessData {
  ownStartup: boolean;
  businessName?: string;
  hearAboutUs: string;
}

interface StartupBusinessProps {
  onContinue: (data: StartupBusinessData) => void;
  initialData?: StartupBusinessData;
  selectedTicketTier?: string;
  completeRegistrationData?: {
    fullName: string;
    email: string;
    phoneNumber: string;
    aboutYou: string[];
    interestLevel: string;
    intrestAreas: string[];
  };
}

interface FormErrors {
  ownStartup?: string;
  businessName?: string;
  hearAboutUs?: string;
}

function StartupBusiness({
  onContinue,
  initialData,
  selectedTicketTier,
  completeRegistrationData
}: StartupBusinessProps) {
  const [selectedOption, setSelectedOption] = useState<string>(
    initialData?.ownStartup ? 'yes' : 'no'
  );
  const [selectedReferralSource, setSelectedReferralSource] = useState<string>(
    initialData?.hearAboutUs || ''
  );
  const [businessName, setBusinessName] = useState<string>(initialData?.businessName || '');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);

    // Clear business ownership error when user makes selection
    if (errors.ownStartup) {
      setErrors((prev) => ({ ...prev, ownStartup: undefined }));
    }

    // Reset business name if switching to "no"
    if (option === 'no') {
      setBusinessName('');
      // Clear business name error since it's no longer applicable
      setErrors((prev) => ({ ...prev, businessName: undefined }));
    }
  };

  const handleReferralSourceChange = (value: string) => {
    setSelectedReferralSource(value);

    // Clear referral source error when user makes selection
    if (errors.hearAboutUs) {
      setErrors((prev) => ({ ...prev, hearAboutUs: undefined }));
    }
  };

  const handleBusinessNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBusinessName(value);

    // Clear business name error when user starts typing
    if (errors.businessName && value.trim()) {
      setErrors((prev) => ({ ...prev, businessName: undefined }));
    }
  };

  // Check if business name field should be shown
  const shouldShowBusinessName = selectedOption === 'yes';

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate business ownership selection
    if (!selectedOption) {
      newErrors.ownStartup = 'Please select whether you own a business/startup';
    }

    // Validate business name if required
    if (shouldShowBusinessName && !businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    } else if (shouldShowBusinessName && businessName.trim().length < 2) {
      newErrors.businessName = 'Business name must be at least 2 characters';
    }

    // Validate referral source
    if (!selectedReferralSource) {
      newErrors.hearAboutUs = 'Please select how you heard about us';
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
      // Prepare the data in the format expected by the API
      const registrationData = {
        fullName: completeRegistrationData?.fullName || '',
        email: completeRegistrationData?.email || '',
        phoneNumber: completeRegistrationData?.phoneNumber || '',
        aboutYou: completeRegistrationData?.aboutYou || [],
        interestLevel: completeRegistrationData?.interestLevel || '',
        intrestAreas: completeRegistrationData?.intrestAreas || [],
        ownStartup: selectedOption === 'yes',
        startupName: selectedOption === 'yes' ? businessName : '',
        hearAboutUs: selectedReferralSource
      };

      // Call the API service
      const response = await apiService.attendees.register(registrationData);

      if (response.status === 200 || response.status === 201) {
        toast.success('Registration successful!');
        // Call the onContinue callback to proceed to the next step
        onContinue({
          ownStartup: selectedOption === 'yes',
          businessName: selectedOption === 'yes' ? businessName : '',
          hearAboutUs: selectedReferralSource
        });
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine button text based on ticket tier
  const getButtonText = () => {
    if (isSubmitting) return 'Processing...';

    if (selectedTicketTier === 'basic') {
      return 'Register';
    } else {
      return 'Make Payment';
    }
  };

  return (
    <div className='w-full'>
      <form className='space-y-4' onSubmit={handleSubmit}>
        <div>
          <label htmlFor='startup-business' className='text-sm mb-2 text-gray-1 block'>
            Do you own a business/startup?
          </label>
          <div className='flex flex-wrap gap-2'>
            {STARTUP_BUSINESS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type='button'
                onClick={() => handleOptionChange(option.value)}
              >
                <Badge
                  variant='outline'
                  className={cn(
                    'cursor-pointer !border h-[35px] transition-all py-2 pl-2 pr-3 duration-200 rounded-full text-sm font-normal text-gray-0 items-center gap-2',
                    selectedOption === option.value ? '!border-gray-0' : 'border-gray-2',
                    errors.ownStartup && 'border-red-500'
                  )}
                >
                  <div className='flex items-center justify-center gap-2 size-4 rounded-full border border-gray-1'>
                    <Check isChecked={selectedOption === option.value} className='size-2.5' />
                  </div>
                  {option.label}
                </Badge>
              </button>
            ))}
          </div>
          {errors.ownStartup && <p className='text-red-500 text-xs mt-1'>{errors.ownStartup}</p>}
        </div>

        {/* Conditional Business Name field */}
        {shouldShowBusinessName && (
          <div>
            <label htmlFor='business-name' className='text-sm mb-2 text-gray-1 block'>
              What&apos;s your business/startup name?
            </label>
            <Input
              id='business-name'
              name='business-name'
              placeholder='Enter your business name'
              value={businessName}
              onChange={handleBusinessNameChange}
              className={cn(errors.businessName && 'border-red-500')}
            />
            {errors.businessName && (
              <p className='text-red-500 text-xs mt-1'>{errors.businessName}</p>
            )}
          </div>
        )}

        <div>
          <label htmlFor='referral-source' className='text-sm mb-2 text-gray-1 block'>
            How did you hear about us?
          </label>
          <Select value={selectedReferralSource} onValueChange={handleReferralSourceChange}>
            <SelectTrigger className={cn('w-full', errors.hearAboutUs && 'border-red-500')}>
              <SelectValue placeholder='Select how you heard about us' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {REFERRAL_SOURCE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option.toLowerCase().replace(/\s+/g, '-')}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.hearAboutUs && <p className='text-red-500 text-xs mt-1'>{errors.hearAboutUs}</p>}
        </div>

        <div className='flex justify-between mt-10'>
          <Button type='submit' className='w-fit' disabled={isSubmitting}>
            {getButtonText()}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default StartupBusiness;
