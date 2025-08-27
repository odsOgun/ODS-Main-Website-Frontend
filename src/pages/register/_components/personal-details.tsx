import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input2';
import { cn } from '@/lib/utils';
import { DESCRIPTIONS } from '@/lib/constants';
import { Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button2';

interface PersonalDetailsProps {
  onContinue: () => void;
}

export default function PersonalDetails({ onContinue }: PersonalDetailsProps) {
  const [selectedDescriptions, setSelectedDescriptions] = useState<string[]>([]);

  const toggleDescription = (description: string) => {
    setSelectedDescriptions((prev) =>
      prev.includes(description) ? prev.filter((d) => d !== description) : [...prev, description]
    );
  };

  // Check if school/company field should be shown
  const shouldShowSchoolCompany = selectedDescriptions.some(
    (desc) => desc === 'Student' || desc === 'Software engineer'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue();
  };

  return (
    <div className='w-full'>
      <form action='' className='space-y-4' onSubmit={handleSubmit}>
        <div>
          <label htmlFor='full-name' className='text-sm mb-2 text-gray-1'>
            Whats your name
          </label>
          <Input id='full-name' name='full-name' placeholder='Enter your full name' />
        </div>
        <div>
          <label htmlFor='email' className='text-sm mb-2 text-gray-1'>
            Your email address
          </label>
          <Input id='email' name='email' placeholder='email@example.com' />
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
                >
                  <Badge
                    variant='outline'
                    className={cn(
                      'cursor-pointer !border h-[35px] transition-all py-2 px-4 duration-200 rounded-full text-sm font-normal text-gray-0',
                      isSelected ? '!border-gray-0' : 'border-gray-2'
                    )}
                    onClick={() => toggleDescription(description)}
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
        </div>

        {/* Conditional School/Company field */}
        {shouldShowSchoolCompany && (
          <div>
            <label htmlFor='school-company' className='text-sm mb-2 text-gray-1'>
              Company/School
            </label>
            <Input
              id='school-company'
              name='school-company'
              placeholder='Enter your company or school name'
            />
          </div>
        )}
        <div className='flex justify-end mt-9'>
          <Button type='submit' className=' ml-auto w-fit'>
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
