'use client'

import { Card, CardContent } from '@/components/card'
import {
  MetricaCardError,
  MetricaCardSkeleton,
} from '../../shared/metrica-card-skeleton'
import { usePrimaPotencialEstimada } from '@/hooks/metricas/use-prima-potencial-estimada'

export default function EstimatedPotentialPremiumCardClient() {
  const { data, isLoading, isError } = usePrimaPotencialEstimada()

  if (isLoading) return <MetricaCardSkeleton />
  if (isError || !data) return <MetricaCardError />

  return (
    <Card className='border-border bg-card shadow-none'>
      <CardContent className='p-3.5'>
        <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
          Prima potencial estimada
        </p>
        <p className='mt-1 text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-[1.75rem]'>
          {data.prima_potencial_estimada.toLocaleString('es-CL')} UF
        </p>
        <p className='mt-0.5 text-xs text-muted-foreground'>
          Promedio de cotizaciones vigentes por oportunidad abierta
        </p>
      </CardContent>
    </Card>
  )
}
