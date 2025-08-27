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

interface StartupBusinessProps {
  onContinue: () => void;
}

function StartupBusiness({ onContinue }: StartupBusinessProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [selectedReferralSource, setSelectedReferralSource] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue();
  };

  // Check if business name field should be shown
  const shouldShowBusinessName = selectedOption === 'yes';

  return (
    <div className='w-full'>
      <form action='' className='space-y-4' onSubmit={handleSubmit}>
        <div>
          <label htmlFor='startup-business' className='text-sm mb-2 text-gray-1'>
            Do you own a business/startup?
          </label>
          <div className='flex flex-wrap gap-2'>
            {STARTUP_BUSINESS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type='button'
                onClick={() => setSelectedOption(option.value)}
              >
                <Badge
                  variant='outline'
                  className={cn(
                    'cursor-pointer !border h-[35px] transition-all py-2 pl-2 pr-3 duration-200 rounded-full text-sm font-normal text-gray-0 items-center gap-2',
                    selectedOption === option.value ? '!border-gray-0' : 'border-gray-2'
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
        </div>

        {/* Conditional Business Name field */}
        {shouldShowBusinessName && (
          <div>
            <label htmlFor='business-name' className='text-sm mb-2 text-gray-1'>
              What&apos;s your business/startup name?
            </label>
            <Input
              id='business-name'
              name='business-name'
              placeholder='Enter your business name'
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>
        )}

        <div>
          <label htmlFor='referral-source' className='text-sm mb-2 text-gray-1'>
            How did you hear about us?
          </label>
          <Select value={selectedReferralSource} onValueChange={setSelectedReferralSource}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select' />
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
        </div>

        <div className='flex justify-end mt-10'>
          <Button
            type='submit'
            className='ml-auto w-fit'
            disabled={
              !selectedOption ||
              !selectedReferralSource ||
              (shouldShowBusinessName && !businessName.trim())
            }
          >
            Get Ticket
          </Button>
        </div>
      </form>
    </div>
  );
}

export default StartupBusiness;
