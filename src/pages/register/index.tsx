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
                <PersonalDetails onContinue={() => handleStepChange('tech-interest')} />
              )}
              {currentStep === 'tech-interest' && (
                <TechInterest onContinue={() => handleStepChange('startup-business')} />
              )}
              {currentStep === 'startup-business' && (
                <StartupBusiness onContinue={() => handleStepChange('complete')} />
              )}
              {currentStep === 'complete' && <Payment />}
              {/* Fallback to PersonalDetails for invalid/unknown steps */}
              {!STEPS.find((step) => step.id === currentStep) && (
                <PersonalDetails onContinue={() => handleStepChange('tech-interest')} />
              )}
            </div>
          </div>
        </div>
      </div>
    </RegisterLayout>
  );
}

export default Register;
