import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { STEPS } from '@/lib/constants';
import Check from '@/components/ui/check';

interface StepperProps {
  steps: typeof STEPS;
  currentStep?: number;
}

function Stepper({ steps, currentStep = 0 }: StepperProps) {
  // Find the current step index
  const currentStepIndex = currentStep;

  const handleStepClick = (stepId: string) => {
    const stepIndex = steps.findIndex((step) => step.id === stepId);

    // Only allow navigation to previous steps or current step
    if (stepIndex <= currentStepIndex) {
      // You can add navigation logic here if needed
      console.log('Navigate to step:', stepId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.19 }}
      className='space-y-1 flex lg:flex-col items-center lg:items-start flex-row flex-wrap lg:flex-nowrap'
    >
      {steps.map((step, index) => {
        const isCurrentStep = index === currentStepIndex;
        const isCompleted = currentStepIndex !== -1 && index < currentStepIndex;
        const isChecked = isCurrentStep || isCompleted;
        const isClickable = index <= currentStepIndex;

        if (step.hide) return null;

        return (
          <motion.div
            key={step.id}
            className={cn(
              'flex items-center gap-2 p-1.5 md:px-2.5',
              isClickable && 'cursor-pointer hover:bg-gray-50 rounded-lg transition-colors'
            )}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.1,
              duration: 0.1,
              ease: 'easeIn'
            }}
            onClick={() => handleStepClick(step.id)}
          >
            <StepperCheck
              isChecked={isChecked}
              completed={isCompleted}
              isCurrentStep={isCurrentStep}
            />
            <p
              className={cn(
                isChecked ? 'text-black' : 'text-[#595959]',
                'text-xs md:text-sm lg:text-base whitespace-nowrap',
                isClickable && ''
              )}
            >
              {step.label}
            </p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default Stepper;

function StepperCheck({
  isChecked,
  completed,
  isCurrentStep
}: {
  isChecked: boolean;
  completed: boolean;
  isCurrentStep: boolean;
}) {
  return (
    <div className='flex size-5 shrink-0 items-center justify-center relative'>
      <Check
        isChecked={isChecked}
        isCurrentStep={isCurrentStep}
        strokeColor={completed ? '#00A651' : isCurrentStep ? '#000' : '#000'}
      />
      <motion.div
        animate={{
          scaleX: !isChecked ? 1 : 0,
          transformOrigin: 'left',
          filter: !isChecked ? 'blur(0px)' : 'blur(4px)'
        }}
        transition={{ delay: 0.15, duration: 0.15, ease: 'easeInOut' }}
        className='absolute w-[12px] shrink-0 h-[2px] bg-[#595959] rounded-full top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'
      />
    </div>
  );
}
