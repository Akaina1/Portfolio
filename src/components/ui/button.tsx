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
          'bg-primary text-primary-foreground hover:bg-pink-200 hover:text-black hover:scale-105',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        ghost: 'hover:bg-card hover:text-accent-foreground',
        link: 'text-primary items-start justify-start underline-offset-4 hover:underline',
        outline:
          'border border-border bg-background hover:bg-card hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        'nav-link':
          'text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white transition-all duration-200 after:absolute after:inset-0 after:pointer-events-none after:content-[""] after:bg-[radial-gradient(circle,theme(colors.pink.200/30%)_0%,transparent_100%)] after:opacity-0 after:scale-0 after:origin-center hover:after:opacity-100 dark:hover:after:opacity-65 hover:after:scale-95 after:transition-all after:duration-500 active:after:opacity-100 active:after:scale-150 active:after:bg-[radial-gradient(circle,theme(colors.pink.200/50%)_0%,transparent_100%)] active:text-pink-200 dark:active:text-pink-200 hover:scale-125 hover:font-bold',
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
