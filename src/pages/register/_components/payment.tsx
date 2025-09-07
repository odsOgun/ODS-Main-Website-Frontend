import { Check, ArrowRight, Lock } from 'lucide-react';
import { TICKET_TIERS, TicketTier } from '@/lib/constants';

interface PaymentProps {
  onContinue: () => void;
  onTicketSelection: (tierId: string) => void;
}

export default function Payment({ onContinue, onTicketSelection }: PaymentProps) {
  const handleTierClick = (tier: TicketTier): void => {
    if (!tier.open) {
      return;
    }
    // Call onTicketSelection to track the selected tier
    onTicketSelection(tier.id);

    if (tier.id === 'basic') {
      // For free tier, continue with registration flow
      onContinue();
      return;
    }

    // For VIP or other paid tiers, redirect to payment (placeholder)
    console.log('Redirecting to payment for:', tier.name);
  };

  const condition = false;

  return (
    <div
      className='min-h-screen w-full'
      style={{
        background: 'linear-gradient(180deg, #0B130F 0%, #00A651 100%)'
      }}
    >
      <div className='w-fit mx-auto px-6 py-20'>
        <div className='text-left mb-10 max-w-[592px]'>
          <h1 className='text-4xl lg:text-5xl font-bold text-white mb-4'>
            Get your ticket, enjoy what comes next.
          </h1>
        </div>

        <div className='grid lg:grid-cols-3 gap-8 max-w-fit mx-auto'>
          {TICKET_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/5 transition-all duration-300 h-fit hover:scale-105 cursor-pointer ${
                condition ? 'ring-2 ring-yellow-400 shadow-2xl' : ''
              }`}
              onClick={() => handleTierClick(tier)}
            >
              {condition && (
                <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
                  <span className='bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-semibold'>
                    Most Popular
                  </span>
                </div>
              )}

              <div className=''>
                <h3 className='text-xl font-semibold text-[#BCC1C1] mb-1'>{tier.name}</h3>

                <div className='mb-6'>
                  <span className='text-2xl font-bold text-white'>
                    {tier.currency}
                    {tier.price}
                  </span>
                  {tier.originalPrice && (
                    <div className='text-white/60 line-through text-lg mt-1'>
                      {tier.originalPrice}
                    </div>
                  )}
                </div>

                <button
                  className={`py-2 px-4 rounded-full ${
                    tier.open ? 'bg-white/90' : 'bg-white/70 opacity-60 cursor-not-allowed'
                  }`}
                  disabled={!tier.open}
                >
                  <div className='flex items-center justify-center gap-2'>
                    {!tier.open && <Lock className='w-5 h-5' />}
                    {tier.cta}
                    {tier.open && <ArrowRight className='w-4 h-4' />}
                  </div>
                </button>
              </div>

              <div className='mt-8 space-y-4'>
                {tier.features.map((feature, index) => (
                  <div key={index} className='flex items-start gap-3'>
                    <div className='w-5 h-5'>
                      <Check className='w-5 h-5 text-white' />
                    </div>
                    <span
                      className={`text-base ${
                        index < (tier.id === 'basic' ? 4 : tier.id === 'gold' ? 5 : 6)
                          ? 'text-white'
                          : 'text-white/60 hidden'
                      }`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
