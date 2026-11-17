'use client'

import { Card, CardContent } from '@/components/card'
import {
  MetricaContenidoError,
  MetricaContenidoSkeleton,
} from '../../shared/metrica-card-skeleton'
import { usePrimaEsperada } from '@/hooks/metricas/use-prima-esperada'

export default function ExpectedPremiumCardClient() {
  const { data, isLoading, isPlaceholderData, isError } = usePrimaEsperada()

  const cargando = isLoading || isPlaceholderData

  return (
    <Card className='border-border bg-card shadow-none'>
      <CardContent className='p-3.5'>
        <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
          Prima esperada
        </p>
        {cargando ? (
          <MetricaContenidoSkeleton alto={72} lineas={2} className='mt-1' />
        ) : isError || !data ? (
          <MetricaContenidoError className='mt-1' />
        ) : (
          <>
            <p className='mt-1 text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-[1.75rem]'>
              {data.prima_esperada.toLocaleString('es-CL')} UF
            </p>
            <p className='mt-0.5 text-xs text-muted-foreground'>
              Prima potencial ponderada por probabilidad de cierre
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
