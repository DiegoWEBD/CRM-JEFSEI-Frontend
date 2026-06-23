'use client'

import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/card'
import { cn } from '@/lib/utils'

export function CommercialActivityCountCard({
  label,
  cantidad,
  icon: Icon,
  className,
}: {
  label: string
  cantidad: number
  icon?: LucideIcon
  className?: string
}) {
  return (
    <Card className={cn('border-border bg-card shadow-none', className)}>
      <CardContent className='flex items-center justify-between gap-2 p-2.5'>
        <div className='min-w-0'>
          <p className='text-[10px] font-medium text-muted-foreground'>{label}</p>
          <p className='text-lg font-semibold tabular-nums tracking-tight text-foreground'>
            {cantidad.toLocaleString('es-CL')}
          </p>
        </div>
        {Icon ? (
          <Icon className='h-4 w-4 shrink-0 text-muted-foreground/70' aria-hidden />
        ) : null}
      </CardContent>
    </Card>
  )
}
