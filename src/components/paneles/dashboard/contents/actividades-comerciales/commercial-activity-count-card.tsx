'use client'

import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/card'
import { Skeleton } from '@/components/skeleton'
import { cn } from '@/lib/utils'

export function CommercialActivityCountCard({
  label,
  cantidad,
  icon: Icon,
  loading = false,
  className,
}: {
  label: string
  cantidad: number
  icon?: LucideIcon
  /** Muestra el skeleton del contador, con el label visible */
  loading?: boolean
  className?: string
}) {
  return (
    <Card className={cn('border-border bg-card shadow-none', className)}>
      <CardContent className='flex items-center justify-between gap-2 p-2.5'>
        <div className='min-w-0'>
          <p className='text-xs font-medium text-muted-foreground'>{label}</p>
          {loading ? (
            <Skeleton className='mt-1 h-6 w-10' />
          ) : (
            <p className='text-lg font-semibold tabular-nums tracking-tight text-foreground'>
              {cantidad.toLocaleString('es-CL')}
            </p>
          )}
        </div>
        {Icon ? (
          <Icon className='h-4 w-4 shrink-0 text-muted-foreground/70' aria-hidden />
        ) : null}
      </CardContent>
    </Card>
  )
}
