import * as React from 'react'

import { cn } from '@/lib/utils'

function CardTitle({
  className,
  primary,
  ...props
}: React.ComponentProps<'div'> & { primary?: boolean }) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        'leading-none font-semibold',
        primary &&
          'text-sm font-semibold leading-tight tracking-tight text-foreground',
        className,
      )}
      {...props}
    />
  )
}

export { CardTitle }
