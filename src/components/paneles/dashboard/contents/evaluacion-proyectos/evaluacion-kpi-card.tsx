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
    <Card className={cn('border-border bg-card shadow-none', className)}>
      <CardContent className='p-3'>
        <p className='text-[10px] font-medium uppercase tracking-wide text-muted-foreground'>
          {label}
        </p>
        <p className='mt-0.5 text-2xl font-semibold tabular-nums tracking-tight text-foreground'>
          {value.toLocaleString('es-CL')}
        </p>
        <p className='mt-0.5 text-[10px] text-muted-foreground'>{hint}</p>
      </CardContent>
    </Card>
  )
}
