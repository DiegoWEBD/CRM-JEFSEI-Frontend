'use client'

import { Card, CardContent } from '@/components/card'
import { cn } from '@/lib/utils'

type EvaluacionKpiCardProps = {
  label: string
  value: number
  hint?: string
  className?: string
}

export default function EvaluacionKpiCard({
  label,
  value,
  hint = 'Per\u00edodo seleccionado',
  className,
}: EvaluacionKpiCardProps) {
  return (
    <Card className={cn('border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md', className)}>
      <CardContent className='p-3'>
        <p className='text-sm font-semibold uppercase tracking-wide text-foreground/70'>
          {label}
        </p>
        <p className='mt-0.5 text-3xl font-bold tabular-nums tracking-tight text-foreground'>
          {value.toLocaleString('es-CL')}
        </p>
        <p className='mt-0.5 text-xs text-muted-foreground'>{hint}</p>
      </CardContent>
    </Card>
  )
}
