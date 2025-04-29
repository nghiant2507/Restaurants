import { cva, VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import React from 'react';

import { cn } from '~/lib/utils';

const spinnerVariants = cva('flex-col items-center justify-center', {
  variants: {
    show: {
      true: 'flex',
      false: 'hidden',
    },
    sizeScreen: {
      screen: 'w-screen h-screen',
      full: 'w-full h-full',
    },
  },
  defaultVariants: {
    show: true,
  },
});

const loaderVariants = cva('animate-spin', {
  variants: {
    size: {
      small: 'size-6',
      medium: 'size-8',
      large: 'size-12',
    },
    color: {
      primary: 'text-primary',
      secondary: 'text-secondary',
      muted: 'text-muted-foreground',
      destructive: 'text-destructive',
    },
  },
  defaultVariants: {
    size: 'medium',
    color: 'primary',
  },
});

interface SpinnerContentProps
  extends VariantProps<typeof spinnerVariants>,
    VariantProps<typeof loaderVariants> {
  className?: string;
  children?: React.ReactNode;
}

export function Spinner({
  sizeScreen,
  size,
  show,
  color,
  children,
  className,
}: SpinnerContentProps) {
  return (
    <span className={spinnerVariants({ show, sizeScreen })}>
      <Loader2 className={cn(loaderVariants({ size, color }), className)} />
      {children}
    </span>
  );
}
