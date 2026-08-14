'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'border-border/60 hover:bg-accent/40 data-[state=selected]:bg-accent border-b transition-colors duration-150',
        className,
      )}
      {...props}
    />
  )
}

export { TableRow }
