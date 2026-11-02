'use client';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import React from 'react';

type TitleProps<T extends React.ElementType> = {
  as?: T;
  children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<T>;

function Title<T extends React.ElementType = 'div'>({ as, children, ...props }: TitleProps<T>) {
  const Component = as || 'div';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.05, ease: 'easeIn' }}
      className={cn('font-extrabold text-[38px] leading-[44px] text-[#0D0D0D]', props.className)}
      {...props}
    >
      <Component {...props}>{children}</Component>
    </motion.div>
  );
}

export default Title;
