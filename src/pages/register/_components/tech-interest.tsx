import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { TECH_INTEREST_OPTIONS, TECH_AREAS } from '@/lib/constants';
import { Button } from '@/components/ui/button2';
import { Badge } from '@/components/ui/badge';
import { Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TechInterestData {
  interestLevel: string;
  techAreas?: string[];
}

interface TechInterestProps {
  onContinue: (data: TechInterestData) => void;
  initialData?: TechInterestData;
}

interface FormErrors {
  interestLevel?: string;
  techAreas?: string;
}

export default function TechInterest({ onContinue, initialData }: TechInterestProps) {
  const [selectedInterest, setSelectedInterest] = useState<string>(
    initialData?.interestLevel || ''
  );
  const [selectedAreas, setSelectedAreas] = useState<string[]>(initialData?.techAreas || []);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) => {
      const newAreas = prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area];

      // Clear tech areas error when user selects at least one
      if (newAreas.length > 0 && errors.techAreas) {
        setErrors((prev) => ({ ...prev, techAreas: undefined }));
      }

      return newAreas;
    });
  };

  const handleInterestChange = (value: string) => {
    setSelectedInterest(value);

    // Clear interest level error when user makes selection
    if (errors.interestLevel) {
      setErrors((prev) => ({ ...prev, interestLevel: undefined }));
    }

    // Reset selected areas if switching away from beginner/interested-in-learning
    const shouldShowTechAreas = value === 'beginner' || value === 'interested-in-learning';
    if (!shouldShowTechAreas) {
      setSelectedAreas([]);
      // Clear tech areas error since it's no longer applicable
      setErrors((prev) => ({ ...prev, techAreas: undefined }));
    }
  };

  // Check if tech areas should be shown
  const shouldShowTechAreas =
    selectedInterest === 'beginner' || selectedInterest === 'interested-in-learning';

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate interest level selection
    if (!selectedInterest) {
      newErrors.interestLevel = 'Please select your level of interest in tech';
    }

    // Validate tech areas if they should be shown
    if (shouldShowTechAreas && selectedAreas.length === 0) {
      newErrors.techAreas = 'Please select at least one area that excites you';
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

      const techInterestData: TechInterestData = {
        interestLevel: selectedInterest,
        ...(shouldShowTechAreas && { techAreas: selectedAreas })
      };

      onContinue(techInterestData);
    } catch (error) {
      console.error('Error submitting tech interest form:', error);
      // Handle submission error here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='w-full'>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label htmlFor='tech-interest' className='text-sm mb-2 text-gray-1 block'>
            What best describes your level of interest in tech?
          </label>
          <Select value={selectedInterest} onValueChange={handleInterestChange}>
            <SelectTrigger className={cn('w-full', errors.interestLevel && 'border-red-500')}>
              <SelectValue placeholder='Select your interest level' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {TECH_INTEREST_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option.toLowerCase().replace(/\s+/g, '-')}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.interestLevel && (
            <p className='text-red-500 text-xs mt-1'>{errors.interestLevel}</p>
          )}
        </div>

        {/* Conditional Tech Areas section */}
        {shouldShowTechAreas && (
          <div>
            <label className='text-sm mb-2 text-gray-1 block'>Which areas excite you?</label>
            <div className='flex flex-wrap gap-2 mt-3'>
              {TECH_AREAS.map((area) => {
                const isSelected = selectedAreas.includes(area);
                return (
                  <button
                    type='button'
                    key={area}
                    className={cn(
                      'border rounded-full',
                      isSelected ? '!border-gray-0' : 'border-transparent'
                    )}
                    onClick={() => toggleArea(area)}
                  >
                    <Badge
                      variant='outline'
                      className={cn(
                        'cursor-pointer !border h-[35px] transition-all py-2 px-4 duration-200 rounded-full text-sm font-normal text-gray-0',
                        isSelected ? '!border-gray-0' : 'border-gray-2'
                      )}
                    >
                      {area}
                      <span className='ml-1 text-xs'>
                        {isSelected ? <Check className='size-4' /> : <Plus className='size-4' />}
                      </span>
                    </Badge>
                  </button>
                );
              })}
            </div>
            {errors.techAreas && <p className='text-red-500 text-xs mt-1'>{errors.techAreas}</p>}
          </div>
        )}

        <div className='flex justify-end mt-10'>
          <Button type='submit' className='ml-auto w-fit' disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Continue'}
          </Button>
        </div>
      </form>
    </div>
  );
}
