import { useState } from 'react';
import { useQueryState } from 'nuqs';
import { useNavigate } from 'react-router-dom';
import PersonalDetails from './_components/personal-details';
import { STEPS } from '@/lib/constants';
import TechInterest from './_components/tech-interest';
import StartupBusiness from './_components/startup-business';
import Payment from './_components/payment';
import RegisterLayout from '@/components/layouts/registerLayout';
import { cn } from '@/lib/utils';
import Stepper from './_components/stepper';
import Title from '@/components/local/title';

// Define the types for form data
interface PersonalDetailsData {
  fullName: string;
  email: string;
  phoneNumber: string;
  aboutYou: string[];
  schoolCompany?: string;
}

interface TechInterestData {
  interestLevel: string;
  intrestAreas?: string[];
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

function Register() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useQueryState('current', {
    defaultValue: 'payment',
    history: 'replace'
  });

  const [, setStepTitle] = useQueryState('title', {
    defaultValue: STEPS[0].title,
    history: 'replace'
  });

  const [, setStepHide] = useQueryState('hide', {
    history: 'replace'
  });

  const [stepTitle] = useQueryState('title', {
    defaultValue: STEPS[0].title
  });

  const [stepHide] = useQueryState('hide');

  // State to store all registration data
  const [registrationData, setRegistrationData] = useState<RegistrationData>({});

  const handleStepChange = (newStepId: string) => {
    const newStep = STEPS.find((step) => step.id === newStepId);
    if (newStep) {
      setCurrentStep(newStepId);
      setStepTitle(newStep.title);
      if (newStep.hide) {
        setStepHide(newStep.hide.toString());
      }
    }
  };

  // Handle ticket tier selection from Payment component
  const handleTicketSelection = (tierId: string) => {
    setRegistrationData((prev) => ({
      ...prev,
      selectedTicketTier: tierId
    }));
  };

  // Handle data from PersonalDetails component
  const handlePersonalDetailsData = (data: PersonalDetailsData) => {
    console.log('Personal Details Data:', data);

    setRegistrationData((prev) => ({
      ...prev,
      personalDetails: data
    }));

    // Move to next step
    handleStepChange('tech-interest');
  };

  // Handle data from TechInterest component
  const handleTechInterestData = (data: TechInterestData) => {
    console.log('Tech Interest Data:', data);

    setRegistrationData((prev) => ({
      ...prev,
      techInterest: data
    }));

    // Move to next step
    handleStepChange('startup-business');
  };

  // Handle data from StartupBusiness component
  const handleStartupBusinessData = (data: StartupBusinessData) => {
    console.log('Startup Business Data:', data);

    setRegistrationData((prev) => {
      const updatedData = {
        ...prev,
        startupBusiness: data
      };

      // Format and log complete registration data in the required format
      const finalFormattedData = {
        fullName: updatedData.personalDetails?.fullName || '',
        email: updatedData.personalDetails?.email || '',
        phoneNumber: updatedData.personalDetails?.phoneNumber || '',
        aboutYou: updatedData.personalDetails?.aboutYou || [],
        interestLevel: updatedData.techInterest?.interestLevel || '',
        intrestAreas: updatedData.techInterest?.intrestAreas || [],
        ownStartup: updatedData.startupBusiness?.ownStartup || false,
        startupName: updatedData.startupBusiness?.startupName || '',
        hearAboutUs: updatedData.startupBusiness?.hearAboutUs || '',
        ticketTier: updatedData.selectedTicketTier || 'basic'
      };

      console.log('Complete Registration Data:', JSON.stringify(finalFormattedData, null, 2));

      // Here you can submit the complete data to your API
      // submitRegistrationData(finalFormattedData);

      return updatedData;
    });

    // Move to final step
    handleStepChange('complete');
  };

  // Handle navigation to home page
  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <>
      {currentStep === 'payment' ? (
        <Payment
          onContinue={() => handleStepChange('personal-details')}
          onTicketSelection={handleTicketSelection}
        />
      ) : currentStep === 'complete' ? (
        <div
          className='min-h-screen w-full flex items-center justify-center'
          style={{
            background: 'linear-gradient(180deg, #0B130F 0%, #00A651 100%)'
          }}
        >
          <div className='text-center text-white max-w-[448px] mx-auto'>
            <h1 className='text-4xl font-bold mb-2'>You got yourself a ticket!</h1>
            <p className='text-base text-white/60 mb-8'>
              Your Ogun digital summit ticket 2025 has been sent to your email. We can't wait to see
              you in November.
            </p>
            <button
              onClick={handleGoHome}
              className='py-2 px-4 bg-white/90 rounded-full text-black'
            >
              Continue
            </button>
          </div>
        </div>
      ) : (
        <RegisterLayout>
          <div className='w-full flex justify-center px-6 lg:px-20 py-20'>
            <div className='w-full max-w-[810px]'>
              <div className='flex flex-row gap-14'>
                {!stepHide && (
                  <div className='pt-[128px] hidden lg:block'>
                    <Stepper steps={STEPS} />
                  </div>
                )}
                <div className={cn('w-full py-1.5 max-w-[477px] space-y-9')}>
                  <div className='block lg:hidden'>
                    <Stepper steps={STEPS} />
                  </div>

                  <Title as='h1'>{stepTitle}</Title>

                  {currentStep === 'personal-details' && (
                    <PersonalDetails onContinue={handlePersonalDetailsData} />
                  )}

                  {currentStep === 'tech-interest' && (
                    <TechInterest
                      onContinue={handleTechInterestData}
                      initialData={registrationData.techInterest}
                    />
                  )}

                  {currentStep === 'startup-business' && (
                    <StartupBusiness
                      onContinue={handleStartupBusinessData}
                      initialData={registrationData.startupBusiness}
                      selectedTicketTier={registrationData.selectedTicketTier}
                      completeRegistrationData={{
                        fullName: registrationData.personalDetails?.fullName || '',
                        email: registrationData.personalDetails?.email || '',
                        phoneNumber: registrationData.personalDetails?.phoneNumber || '',
                        aboutYou: registrationData.personalDetails?.aboutYou || [],
                        interestLevel: registrationData.techInterest?.interestLevel || '',
                        intrestAreas: registrationData.techInterest?.intrestAreas || []
                      }}
                    />
                  )}

                  {!STEPS.find((step) => step.id === currentStep) && (
                    <PersonalDetails onContinue={handlePersonalDetailsData} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </RegisterLayout>
      )}
    </>
  );
}

export default Register;
