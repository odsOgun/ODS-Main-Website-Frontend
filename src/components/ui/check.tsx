import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export default function Check({
  isChecked,
  isCurrentStep,
  strokeColor,
  className
}: {
  isChecked: boolean;
  isCurrentStep?: boolean;
  strokeColor?: string;
  className?: string;
}) {
  return (
    <motion.div
      className={cn('size-4 flex items-center justify-center', className)}
      transition={{ duration: 0.12, ease: 'easeInOut' }}
      whileHover={{ scale: isCurrentStep ? 1.05 : 1 }}
      whileTap={{ scale: isCurrentStep ? 0.95 : 1 }}
    >
      {/* Checkmark SVG */}
      <svg width='24' height='24' viewBox='0 0 24 24' fill='none' className='relative'>
        <motion.path
          d='M5 12l5 5L20 7'
          stroke={strokeColor ?? 'black'}
          strokeWidth='3'
          strokeLinecap='round'
          strokeLinejoin='round'
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: isChecked ? 1 : 0,
            opacity: isChecked ? 1 : 0,
            filter: isChecked ? 'blur(0px)' : 'blur(4px)'
          }}
          transition={{
            duration: 0.17,
            ease: 'easeInOut',
            delay: isChecked ? 0.1 : 0
          }}
        />
      </svg>
    </motion.div>
  );
}
