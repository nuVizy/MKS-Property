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
    'border border-brand-gold bg-brand-gold text-white shadow-[0_18px_40px_rgba(6,63,71,0.18)] hover:border-brand-charcoal hover:bg-brand-charcoal hover:text-white hover:shadow-[0_22px_46px_rgba(6,63,71,0.24)] focus-visible:ring-brand-charcoal/25 focus-visible:ring-offset-white',
  inverse:
    'border border-white/70 bg-white/8 text-white shadow-[0_18px_40px_rgba(6,63,71,0.12)] backdrop-blur-[2px] hover:border-white hover:bg-white/16 hover:text-white hover:shadow-[0_22px_44px_rgba(6,63,71,0.18)] focus-visible:ring-white/60 focus-visible:ring-offset-brand-charcoal',
  secondary:
    'border border-brand-charcoal/14 bg-white text-brand-charcoal shadow-[0_16px_32px_rgba(6,63,71,0.06)] hover:border-brand-charcoal hover:bg-brand-charcoal hover:text-white hover:shadow-[0_22px_42px_rgba(6,63,71,0.12)] focus-visible:ring-brand-charcoal/20 focus-visible:ring-offset-white',
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
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none font-sans font-medium uppercase leading-none [&_span]:text-inherit [&_svg]:text-inherit transition-[background-color,border-color,color,box-shadow,transform] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
