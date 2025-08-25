import * as React from 'react';

import { cn } from '@/lib/utils';

interface InputProps extends React.ComponentProps<'input'> {
  error?: boolean;
}

function Input({ className, type, error, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground placeholder:font-normal placeholder:text-[#67706D] selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-12 w-full min-w-0 rounded-2xl border bg-transparent py-3 px-4 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base',
        'focus-visible:ring-ring/10 focus-visible:ring-[3px]',
        error
          ? 'border-red-500 focus-visible:border-red-500'
          : 'border-gray-2 focus-visible:border-[#00A651]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  );
}

export { Input };
