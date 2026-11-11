import * as React from 'react'
import { cn } from '@/utils/cn'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-tactile-xs transition-all duration-200 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
