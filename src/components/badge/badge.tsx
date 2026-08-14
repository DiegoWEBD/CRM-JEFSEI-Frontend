import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-150 overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive-foreground [a&]:hover:bg-destructive/20',
        outline:
          'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        success:
          'border-transparent bg-success/12 text-success dark:bg-success/20 [a&]:hover:bg-success/20',
        warning:
          'border-transparent bg-warning/15 text-warning-foreground dark:bg-warning/20 dark:text-warning [a&]:hover:bg-warning/25',
        info:
          'border-transparent bg-info/12 text-info dark:bg-info/20 [a&]:hover:bg-info/20',
        purple:
          'border-transparent bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400',
        'pastel-emerald':
          'border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
        'pastel-amber':
          'border-transparent bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
        'pastel-red':
          'border-transparent bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
        'pastel-blue':
          'border-transparent bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
        'pastel-sky':
          'border-transparent bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
        'pastel-indigo':
          'border-transparent bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300',
        'pastel-violet':
          'border-transparent bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
        'pastel-fuchsia':
          'border-transparent bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950/40 dark:text-fuchsia-300',
        'pastel-cyan':
          'border-transparent bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300',
        'pastel-teal':
          'border-transparent bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
        'pastel-orange':
          'border-transparent bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300',
        'pastel-slate':
          'border-transparent bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
        'pastel-muted':
          'border-transparent bg-muted text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
