import { cn } from 'src/utilities/cn';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        clear: '',
        default: 'h-10 px-4 py-2',
        icon: 'h-10 w-10',
        lg: 'h-11 rounded px-8',
        sm: 'h-9 rounded px-3',
      },
      variant: {
        default:
          'bg-foreground text-background hover:bg-primary hover:text-black hover:scale-105',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        ghost: 'hover:bg-card hover:text-accent-foreground',
        link: 'text-primary items-start justify-start underline-offset-4 hover:underline',
        outline:
          'border border-border bg-background hover:bg-card hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        'nav-link':
          'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-200 relative font-bold active:text-pink-200/90 dark:active:text-pink-200/90 active:scale-110 dark:active:scale-110',
        'home-hero':
          'hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 dark:hover:shadow-primary/10 transition-all duration-500 ease-out bg-foreground/20 dark:bg-background text-black dark:text-white before:absolute before:inset-0 before:-z-10 before:translate-x-[100%] before:translate-y-[100%] before:rotate-45 before:bg-gradient-to-r before:from-primary/10 before:to-transparent before:transition-transform hover:before:translate-x-[-50%] hover:before:translate-y-[-50%] before:duration-1000',
      },
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, className, size, variant, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ className, size, variant }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
