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
import { Input } from '@/components/ui/input2';
import { Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TechInterestData {
  interestLevel: string;
  interestAreas?: string[];
}

interface TechInterestProps {
  onContinue: (data: TechInterestData) => void;
  initialData?: TechInterestData;
}

interface FormErrors {
  interestLevel?: string;
  interestAreas?: string;
  otherArea?: string;
}

export default function TechInterest({ onContinue, initialData }: TechInterestProps) {
  const [selectedInterest, setSelectedInterest] = useState<string>(
    initialData?.interestLevel || ''
  );
  const [selectedAreas, setSelectedAreas] = useState<string[]>(initialData?.interestAreas || []);
  const [showOtherInput, setShowOtherInput] = useState<boolean>(false);
  const [otherArea, setOtherArea] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) => {
      const newAreas = prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area];

      // Clear tech areas error when user selects at least one
      if (newAreas.length > 0 && errors.interestAreas) {
        setErrors((prev) => ({ ...prev, interestAreas: undefined }));
      }

      // If "Others" was selected and user selects another area, hide other input
      if (area === 'Others' && !newAreas.includes('Others')) {
        setShowOtherInput(false);
        setOtherArea('');
        if (errors.otherArea) {
          setErrors((prev) => ({ ...prev, otherArea: undefined }));
        }
      }

      return newAreas;
    });

    // Show input when "Others" is selected
    if (area === 'Others' && !selectedAreas.includes('Others')) {
      setShowOtherInput(true);
    }
  };

  const handleOtherAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOtherArea(value);

    // Clear other area error when user starts typing
    if (errors.otherArea) {
      setErrors((prev) => ({ ...prev, otherArea: undefined }));
    }

    // Clear interest areas error if we have content in other area
    if (value.trim() && errors.interestAreas) {
      setErrors((prev) => ({ ...prev, interestAreas: undefined }));
    }
  };

  const handleInterestChange = (value: string) => {
    setSelectedInterest(value);

    // Clear interest level error when user makes selection
    if (errors.interestLevel) {
      setErrors((prev) => ({ ...prev, interestLevel: undefined }));
    }

    // Reset selected areas if switching away from interested/expert
    const shouldShowTechAreas = value === 'Interested' || value === 'Expert';
    if (!shouldShowTechAreas) {
      setSelectedAreas([]);
      setShowOtherInput(false);
      setOtherArea('');
      // Clear tech areas error since it's no longer applicable
      setErrors((prev) => ({ ...prev, interestAreas: undefined, otherArea: undefined }));
    }
  };

  // Check if tech areas should be shown
  const shouldShowTechAreas = selectedInterest === 'Interested' || selectedInterest === 'Expert';

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate interest level selection
    if (!selectedInterest) {
      newErrors.interestLevel = 'Please select your level of interest in tech';
    }

    // Validate tech areas if they should be shown
    if (shouldShowTechAreas) {
      const hasSelectedAreas = selectedAreas.length > 0;
      const hasOtherArea = selectedAreas.includes('Others') && otherArea.trim();

      if (!hasSelectedAreas && !hasOtherArea) {
        newErrors.interestAreas = 'Please select at least one area that excites you';
      }

      // Validate other area input if "Others" is selected
      if (selectedAreas.includes('Others') && !otherArea.trim()) {
        newErrors.otherArea = 'Please specify your area of interest';
      }
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
      // Prepare interest areas array
      let finalInterestAreas: string[] = [];

      // Add selected areas (excluding "Others" if no input provided)
      const areasWithoutOthers = selectedAreas.filter((area) => area !== 'Others');
      finalInterestAreas = [...areasWithoutOthers];

      // Add other area if provided
      if (selectedAreas.includes('Others') && otherArea.trim()) {
        finalInterestAreas.push(otherArea.trim());
      }

      const techInterestData: TechInterestData = {
        interestLevel: selectedInterest,
        ...(shouldShowTechAreas && { interestAreas: finalInterestAreas })
      };

      console.log('Tech Interest Data:', techInterestData);

      onContinue(techInterestData);
    } catch (error) {
      console.error('Error submitting tech interest form:', error);
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
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
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
              {[...TECH_AREAS, 'Others'].map((area) => {
                const isSelected = selectedAreas.includes(area);
                return (
                  <button
                    type='button'
                    key={area}
                    className={cn(
                      'border rounded-full transition-all duration-200',
                      isSelected
                        ? '!border-gray-0 shadow-sm'
                        : 'border-transparent hover:border-gray-2'
                    )}
                    onClick={() => toggleArea(area)}
                  >
                    <Badge
                      variant='outline'
                      className={cn(
                        'cursor-pointer !border h-[35px] transition-all py-2 px-4 duration-200 rounded-full text-sm font-normal',
                        isSelected
                          ? '!border-gray-0 bg-gray-50 text-gray-0'
                          : 'border-gray-2 text-gray-1 hover:text-gray-0 hover:border-gray-1'
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

            {/* Other Area Input */}
            {showOtherInput && (
              <div className='mt-4 animate-in fade-in duration-300'>
                <label htmlFor='other-area' className='text-sm mb-2 text-gray-1 block'>
                  Specify your area of interest
                </label>
                <Input
                  id='other-area'
                  name='otherArea'
                  placeholder='Enter your specific area of interest...'
                  value={otherArea}
                  onChange={handleOtherAreaChange}
                  className={cn('w-full', errors.otherArea && 'border-red-500')}
                />
                {errors.otherArea && (
                  <p className='text-red-500 text-xs mt-1'>{errors.otherArea}</p>
                )}
                <p className='text-xs text-gray-1 mt-1'>
                  Tell us about a specific tech area that excites you
                </p>
              </div>
            )}

            {errors.interestAreas && !showOtherInput && (
              <p className='text-red-500 text-xs mt-1'>{errors.interestAreas}</p>
            )}
          </div>
        )}

        <div className='flex justify-between mt-10'>
          <Button type='submit' className='w-fit' disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Continue'}
          </Button>
        </div>
      </form>
    </div>
  );
}
