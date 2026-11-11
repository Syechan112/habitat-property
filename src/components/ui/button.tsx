import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-slate-950 text-white shadow-tactile-sm hover:bg-slate-900 hover:shadow-tactile-md active:bg-slate-800',
        accent:
          'bg-accent text-slate-950 font-bold shadow-tactile-sm hover:bg-accent-hover hover:shadow-lime-glow active:bg-accent',
        emerald:
          'bg-emerald-900 text-white shadow-tactile-sm hover:bg-emerald-800 hover:shadow-emerald-glow active:bg-emerald-950',
        outline:
          'border border-slate-200 bg-white/90 text-slate-800 backdrop-blur-sm hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 shadow-tactile-xs',
        ghost:
          'text-slate-700 hover:bg-slate-100/80 hover:text-slate-950 active:bg-slate-200/80',
        destructive:
          'bg-rose-600 text-white shadow-tactile-sm hover:bg-rose-700 active:bg-rose-800',
        glass:
          'glass-pill text-slate-900 hover:bg-white active:bg-white/90 shadow-tactile-xs',
      },
      size: {
        default: 'h-11 px-6 text-sm',
        sm: 'h-9 px-4 text-xs font-semibold',
        lg: 'h-13 px-8 text-base font-bold',
        icon: 'h-10 w-10 p-0 rounded-full',
        'icon-sm': 'h-8 w-8 p-0 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
