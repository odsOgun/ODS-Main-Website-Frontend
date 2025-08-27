import React from 'react';
import { Button } from '@/components/ui/button2';
import { TICKET_TIERS } from '@/lib/constants';
import { Check, ArrowRight } from 'lucide-react';

export default function Payment() {
  return (
    <div className='w-full'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-6xl mx-auto'>
        {/* Left Column - Basic and Gold */}
        <div className='space-y-10 pr-10 border-r border-gray-2'>
          {TICKET_TIERS.slice(0, 2).map((tier, index) => (
            <React.Fragment key={tier.id}>
              <div className='bg-white'>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>{tier.name}</h3>
                <div className='text-3xl font-bold text-gray-900'>
                  {tier.currency}
                  {tier.price}
                </div>
                <ul className='space-y-4 my-6'>
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className='flex items-center gap-2 text-gray-1'>
                      <Check className='size-4 text-gray-900' />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant='link' className='text-[#00A651] p-0 text-lg h-auto font-medium'>
                  {tier.cta}
                  <ArrowRight className='size-4 ml-1' />
                </Button>
              </div>
              {index < 1 && <div className='h-[1px] bg-gray-2' />}
            </React.Fragment>
          ))}
        </div>

        {/* Right Column - Premium */}
        <div className='space-y-6'>
          <div className='rounded-lg pl-10 bg-white'>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>{TICKET_TIERS[2].name}</h3>
            <div className='text-3xl font-bold text-gray-900'>
              {TICKET_TIERS[2].currency}
              {TICKET_TIERS[2].price}
            </div>
            <ul className='space-y-4 my-6'>
              {TICKET_TIERS[2].features.map((feature, index) => (
                <li key={index} className='flex items-center gap-2 text-gray-1'>
                  <Check className='size-4 text-gray-900' />
                  {feature}
                </li>
              ))}
            </ul>
            <Button variant='link' className='text-[#00A651] p-0 text-lg h-auto font-medium'>
              {TICKET_TIERS[2].cta}
              <ArrowRight className='size-4 ml-1' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
