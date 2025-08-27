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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TechInterestProps {
  onContinue: () => void;
}

export default function TechInterest({ onContinue }: TechInterestProps) {
  const [selectedInterest, setSelectedInterest] = useState<string>('');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  // Check if tech areas should be shown
  const shouldShowTechAreas =
    selectedInterest === 'beginner' || selectedInterest === 'interested-in-learning';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue();
  };

  return (
    <div className='w-full'>
      <form action='' onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label htmlFor='tech-interest' className='text-sm mb-2 text-gray-1'>
            What best describes your level of interest in tech?
          </label>
          <Select value={selectedInterest} onValueChange={setSelectedInterest}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select' />
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
        </div>

        {/* Conditional Tech Areas section */}
        {shouldShowTechAreas && (
          <div>
            <label className='text-sm mb-2 text-gray-1 block'>Which areas excites you?</label>
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
                  >
                    <Badge
                      variant='outline'
                      className={cn(
                        'cursor-pointer !border h-[35px] transition-all py-2 px-4 duration-200 rounded-full text-sm font-normal text-gray-0',
                        isSelected ? '!border-gray-0' : 'border-gray-2'
                      )}
                      onClick={() => toggleArea(area)}
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
          </div>
        )}

        <div className='flex justify-end mt-10'>
          <Button type='submit' className='ml-auto w-fit'>
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
