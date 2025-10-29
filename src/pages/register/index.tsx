import { useState } from 'react';
import Payment from './_components/payment';
import PersonalDetails from './_components/personal-details';
import { cn } from '@/lib/utils';
import Title from '@/components/local/title';
import { STEPS, TICKET_TIERS } from '@/lib/constants';
import TechInterest from './_components/tech-interest';
import StartupBusiness from './_components/startup-business';
import Stepper from './_components/stepper';
import ODSLogoMobile from '@/assets/svgs/nav/ODSLogo2.svg';
import ArtBg from '@/assets/img/readme/artBg.png';
import { Button } from '@/components/ui/button2';
import { BadgeCheck, Undo2, UnfoldVertical } from 'lucide-react';
import { Toaster } from 'sonner';

// Define the types for form data
interface PersonalDetailsData {
  fullName: string;
  email: string;
  phoneNumber: string;
  jobRole: string;
  schoolCompany: string;
  isNyscCorpMember?: boolean;
}

interface TechInterestData {
  interestLevel: string;
  interestAreas?: string[];
}

interface StartupBusinessData {
  ownStartup: boolean;
  startupName?: string;
  hearAboutUs: string;
}

interface RegistrationData {
  personalDetails?: PersonalDetailsData;
  techInterest?: TechInterestData;
  startupBusiness?: StartupBusinessData;
  selectedTicketTier?: string;
}

export default function Register() {
  const [step, setStep] = useState<number>(1);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({});
  const [showTicket, setShowTicket] = useState<boolean>(true);
  // Find the selected ticket tier
  const selectedTier =
    TICKET_TIERS.find((tier) => tier.id === registrationData.selectedTicketTier) || TICKET_TIERS[0];

  // Handle ticket tier selection from Payment component
  const handleTicketSelection = (tierId: string) => {
    setRegistrationData((prev) => ({
      ...prev,
      selectedTicketTier: tierId
    }));
  };

  // Handle data from PersonalDetails component
  const handlePersonalDetailsData = (data: PersonalDetailsData) => {
    setRegistrationData((prev) => ({
      ...prev,
      personalDetails: data
    }));
    setStep(3);
  };

  // Handle data from TechInterest component
  const handleTechInterestData = (data: TechInterestData) => {
    setRegistrationData((prev) => ({
      ...prev,
      techInterest: data
    }));
    setStep(4);
  };

  // Handle data from StartupBusiness component
  const handleStartupBusinessData = (data: StartupBusinessData) => {
    setRegistrationData((prev) => {
      const updatedData = {
        ...prev,
        startupBusiness: data
      };

      // Format and log complete registration data
      // console.log('Complete Registration Data:', {
      //   ...updatedData.personalDetails,
      //   ...updatedData.techInterest,
      //   ...updatedData.startupBusiness,
      //   ticketTier: updatedData.selectedTicketTier
      // });

      return updatedData;
    });
    setStep(5);
  };

  // Render step content using a more maintainable approach
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <Payment onContinue={() => setStep(2)} onTicketSelection={handleTicketSelection} />;
      case 2:
        return <PersonalDetails onContinue={handlePersonalDetailsData} />;
      case 3:
        return (
          <TechInterest
            onContinue={handleTechInterestData}
            initialData={registrationData.techInterest}
          />
        );
      case 4:
        return (
          <StartupBusiness
            onContinue={handleStartupBusinessData}
            initialData={registrationData.startupBusiness}
            selectedTicketTier={registrationData.selectedTicketTier}
            completeRegistrationData={{
              fullName: registrationData.personalDetails?.fullName || '',
              email: registrationData.personalDetails?.email || '',
              phoneNumber: registrationData.personalDetails?.phoneNumber || '',
              jobRole: registrationData.personalDetails?.jobRole || '',
              schoolCompany: registrationData.personalDetails?.schoolCompany || '',
              isNyscCorpMember: registrationData.personalDetails?.isNyscCorpMember,
              interestLevel: registrationData.techInterest?.interestLevel || '',
              interestAreas: registrationData.techInterest?.interestAreas || []
            }}
          />
        );
      case 5:
        return (
          <div
            className='min-h-screen w-full flex items-center justify-center'
            style={{
              background: 'linear-gradient(180deg, #0B130F 0%, #00A651 100%)'
            }}
          >
            <div className='text-center text-white max-w-[448px] mx-auto'>
              <h1 className='text-4xl font-bold mb-2'>You got yourself a ticket!</h1>
              <p className='text-base text-white/60 mb-8'>
                Your Ogun digital summit ticket 2025 has been sent to your email. We can't wait to
                see you in November.
              </p>
              <button
                type='button'
                onClick={() => {}}
                className='py-2 px-4 bg-white/90 rounded-full text-black'
              >
                Continue
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Toaster />
      <div className='bg-white'>
        {step === 1 ? (
          renderStepContent()
        ) : (
          <div className='h-dvh flex flex-col lg:flex-row gap-14 p-4'>
            <div className='relative flex flex-col justify-between bg-gray-100 w-full lg:w-1/3 lg:max-w-[450px] rounded-t-[26px] lg:rounded-t-2xl rounded-2xl border border-gray-50 p-2'>
              <Button
                variant={'outline'}
                size={'icon'}
                className='absolute top-2 right-2 size-10'
                onClick={() => setShowTicket(!showTicket)}
              >
                <UnfoldVertical />
              </Button>
              <div className='p-1 lg:p-[5%]'>
                <Stepper steps={STEPS} currentStep={step - 1} />
              </div>

              {/* subscription details */}
              {showTicket && (
                <div className='justify-center bg-white border-gray-200 rounded-[8px] rounded-t-[32px] overflow-hidden mt-4'>
                  <div className='h-fit flex flex-col p-4 space-y-4'>
                    <div className='flex justify-between items-center mb-4'>
                      <p className='text-lg font-medium text-gray-700'>{selectedTier.name}</p>
                      <Button
                        variant='outline'
                        size='sm'
                        className='w-fit'
                        onClick={() => setStep(1)}
                      >
                        <Undo2 />
                        Change
                      </Button>
                    </div>
                    <div className='flex w-full flex-row items-center justify-between gap-2'>
                      <img src={ODSLogoMobile} alt='' />
                      <p className='text-sm font-semibold text-gray-500'>
                        Ogun Digital Summit 2025
                      </p>
                    </div>
                    <div className='flex justify-between'>
                      <p className='text-sm text-gray-500'>{selectedTier.name}</p>
                      <div className='text-sm font-medium text-gray-500'>
                        {selectedTier.price === 0
                          ? 'NGN 0'
                          : `${selectedTier.currency}${selectedTier.price.toLocaleString()}`}
                      </div>
                    </div>
                    <div className='h-px w-full bg-gray-200' />
                    <div className='flex justify-between'>
                      <p className='text-sm text-gray-500'>Subtotal</p>
                      <div className='text-sm font-medium text-gray-500'>
                        {selectedTier.price === 0
                          ? 'NGN 0'
                          : `${selectedTier.currency}${selectedTier.price.toLocaleString()}`}
                      </div>
                    </div>
                    <div className='flex justify-between'>
                      <p className='font-medium text-gray-500'>Total due</p>
                      <div className='font-medium text-gray-500'>
                        {selectedTier.price === 0
                          ? 'NGN 0'
                          : `${selectedTier.currency}${selectedTier.price.toLocaleString()}`}
                      </div>
                    </div>
                    <div className='flex justify-between flex-col gap-3 p-2 bg-gray-50 rounded-lg mt-4'>
                      {selectedTier.features.map((feature) => (
                        <div key={feature} className='flex items-center gap-2'>
                          <BadgeCheck className='size-4 text-green-500' />
                          <p className='text-sm text-gray-500'>{feature}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    className='min-h-20 bg-cover bg-center bg-no-repeat'
                    style={{ backgroundImage: `url(${ArtBg})` }}
                  ></div>
                </div>
              )}
            </div>
            <div className='lg:w-3/5'>
              <div className={cn('w-full py-1.5 lg:max-w-[477px] mx-auto space-y-9')}>
                <Title as='h1'>{STEPS[step - 1]?.title}</Title>
                {renderStepContent()}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
