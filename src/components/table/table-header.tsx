'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={cn('[&_tr]:border-border/60 [&_tr]:bg-muted/40', className)}
      {...props}
    />
  )
}

export { TableHeader }
