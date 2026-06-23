'use client'

import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/card'
import { cn } from '@/lib/utils'

type MonthlyNetPremiumCardProps = {
  totalPrimaNeta: number
  variacionMesAnterior: number
  mesLabel: string
}

export default function MonthlyNetPremiumCard({
  totalPrimaNeta,
  variacionMesAnterior,
  mesLabel,
}: MonthlyNetPremiumCardProps) {
  const positiva = variacionMesAnterior >= 0

  return (
    <Card className='border-border bg-card shadow-none'>
      <CardContent className='p-3.5'>
        <p className='text-[10px] font-medium uppercase tracking-wide text-muted-foreground'>
          Prima neta mensual
        </p>
        <p className='mt-1 text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-[1.75rem]'>
          {totalPrimaNeta.toLocaleString('es-CL')} UF
        </p>
        <p className='mt-0.5 text-[10px] text-muted-foreground'>{mesLabel}</p>
        <p
          className={cn(
            'mt-1.5 inline-flex items-center gap-0.5 text-[10px]',
            positiva
              ? 'text-emerald-600/90 dark:text-emerald-400/90'
              : 'text-amber-700/90 dark:text-amber-400/90',
          )}
        >
          {positiva ? (
            <TrendingUp className='h-2.5 w-2.5' aria-hidden />
          ) : (
            <TrendingDown className='h-2.5 w-2.5' aria-hidden />
          )}
          {positiva ? '+' : ''}{variacionMesAnterior.toFixed(1)}% vs. mes anterior
        </p>
      </CardContent>
    </Card>
  )
}
