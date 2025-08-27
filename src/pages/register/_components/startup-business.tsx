import { Badge } from '@/components/ui/badge';
import Check from '@/components/ui/check';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button2';
import { Input } from '@/components/ui/input2';
import { STARTUP_BUSINESS_OPTIONS, REFERRAL_SOURCE_OPTIONS } from '@/lib/constants';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface StartupBusinessData {
  ownsBusinessStartup: string;
  businessName?: string;
  referralSource: string;
}

interface StartupBusinessProps {
  onContinue: (data: StartupBusinessData) => void;
  initialData?: StartupBusinessData;
}

interface FormErrors {
  ownsBusinessStartup?: string;
  businessName?: string;
  referralSource?: string;
}

function StartupBusiness({ onContinue, initialData }: StartupBusinessProps) {
  const [selectedOption, setSelectedOption] = useState<string>(
    initialData?.ownsBusinessStartup || ''
  );
  const [selectedReferralSource, setSelectedReferralSource] = useState<string>(
    initialData?.referralSource || ''
  );
  const [businessName, setBusinessName] = useState<string>(initialData?.businessName || '');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);

    // Clear business ownership error when user makes selection
    if (errors.ownsBusinessStartup) {
      setErrors((prev) => ({ ...prev, ownsBusinessStartup: undefined }));
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
    if (errors.referralSource) {
      setErrors((prev) => ({ ...prev, referralSource: undefined }));
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
      newErrors.ownsBusinessStartup = 'Please select whether you own a business/startup';
    }

    // Validate business name if required
    if (shouldShowBusinessName && !businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    } else if (shouldShowBusinessName && businessName.trim().length < 2) {
      newErrors.businessName = 'Business name must be at least 2 characters';
    }

    // Validate referral source
    if (!selectedReferralSource) {
      newErrors.referralSource = 'Please select how you heard about us';
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
      await new Promise((resolve) => setTimeout(resolve, 500));

      const startupBusinessData: StartupBusinessData = {
        ownsBusinessStartup: selectedOption,
        referralSource: selectedReferralSource,
        ...(shouldShowBusinessName && { businessName: businessName.trim() })
      };

      onContinue(startupBusinessData);
    } catch (error) {
      console.error('Error submitting startup business form:', error);
      // Handle submission error here
    } finally {
      setIsSubmitting(false);
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
                    errors.ownsBusinessStartup && 'border-red-500'
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
          {errors.ownsBusinessStartup && (
            <p className='text-red-500 text-xs mt-1'>{errors.ownsBusinessStartup}</p>
          )}
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
            <SelectTrigger className={cn('w-full', errors.referralSource && 'border-red-500')}>
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
          {errors.referralSource && (
            <p className='text-red-500 text-xs mt-1'>{errors.referralSource}</p>
          )}
        </div>

        <div className='flex justify-end mt-10'>
          <Button type='submit' className='ml-auto w-fit' disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Get Ticket'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default StartupBusiness;
