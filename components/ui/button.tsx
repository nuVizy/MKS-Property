import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'inverse' | 'secondary';
type ButtonSize = 'default' | 'lg' | 'xl';

const sizeClasses: Record<ButtonSize, string> = {
  default: 'min-h-11 px-5 py-3 text-[10px] tracking-[0.22em]',
  lg: 'min-h-12 px-7 py-3 text-[10px] tracking-[0.24em]',
  xl: 'min-h-12 px-8 py-4 text-[10px] tracking-[0.26em]',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border border-brand-charcoal bg-brand-charcoal text-white hover:bg-transparent hover:text-brand-charcoal focus-visible:ring-brand-charcoal/25 focus-visible:ring-offset-white',
  inverse:
    'border border-white/60 bg-transparent text-white hover:bg-white hover:text-brand-charcoal focus-visible:ring-white/60 focus-visible:ring-offset-brand-charcoal',
  secondary:
    'border border-brand-charcoal/12 bg-white text-brand-charcoal hover:border-brand-gold/45 hover:text-brand-gold focus-visible:ring-brand-charcoal/20 focus-visible:ring-offset-white',
};

export interface ButtonProps {
  asChild?: boolean;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  size?: ButtonSize;
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
}

export function Button({
  asChild = false,
  className,
  size = 'default',
  variant = 'primary',
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none font-medium uppercase leading-none transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
