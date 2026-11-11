import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-slate-900 text-white',
        accent: 'bg-accent text-slate-950 font-bold',
        emerald: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
        emeraldDark: 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/30',
        outline: 'border border-slate-200 bg-white/80 text-slate-700 backdrop-blur-md',
        glass: 'bg-white/70 text-slate-800 backdrop-blur-md border border-white/60 shadow-tactile-xs',
        glassDark: 'bg-slate-950/75 text-white backdrop-blur-xl border border-white/10 shadow-tactile-xs',
        subtle: 'bg-slate-100 text-slate-700',
        warning: 'bg-amber-50 text-amber-800 border border-amber-200',
        danger: 'bg-rose-50 text-rose-700 border border-rose-200',
      },
      size: {
        default: 'px-3 py-1 text-xs',
        sm: 'px-2.5 py-0.5 text-[11px]',
        lg: 'px-4 py-1.5 text-xs tracking-wider uppercase font-bold',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
  dotColor?: string
}

function Badge({ className, variant, size, dot, dotColor, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full animate-pulse shrink-0',
            dotColor ?? (variant === 'accent' ? 'bg-slate-950' : variant === 'emerald' ? 'bg-emerald-600' : 'bg-emerald-500'),
          )}
        />
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
