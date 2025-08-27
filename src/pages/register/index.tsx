import { useState } from 'react';
import { useQueryState } from 'nuqs';
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
  descriptions: string[];
  schoolCompany?: string;
}

interface TechInterestData {
  interestLevel: string;
  techAreas?: string[];
}

interface StartupBusinessData {
  ownsBusinessStartup: string;
  businessName?: string;
  referralSource: string;
}

interface RegistrationData {
  personalDetails?: PersonalDetailsData;
  techInterest?: TechInterestData;
  startupBusiness?: StartupBusinessData;
}

function Register() {
  const [currentStep, setCurrentStep] = useQueryState('current', {
    defaultValue: 'personal-details',
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

      // Log complete registration data
      console.log('Complete Registration Data:', updatedData);

      // Here you can submit the complete data to your API
      // submitRegistrationData(updatedData);

      return updatedData;
    });

    // Move to final step
    handleStepChange('complete');
  };

  return (
    <RegisterLayout>
      <div className='w-full flex justify-center p-20'>
        <div className='space-y-10 w-full max-w-[810px]'>
          <div className='flex flex-row gap-14'>
            {!stepHide && (
              <div className='pt-[128px]'>
                <Stepper steps={STEPS} />
              </div>
            )}
            <div className={cn('w-full py-1.5 max-w-[477px] space-y-9')}>
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
                />
              )}

              {currentStep === 'complete' && <Payment />}

              {/* Fallback to PersonalDetails for invalid/unknown steps */}
              {!STEPS.find((step) => step.id === currentStep) && (
                <PersonalDetails onContinue={handlePersonalDetailsData} />
              )}
            </div>
          </div>
        </div>
      </div>
    </RegisterLayout>
  );
}

export default Register;
