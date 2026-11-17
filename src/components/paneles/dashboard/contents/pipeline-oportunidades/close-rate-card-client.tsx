'use client'

import { Card, CardContent } from '@/components/card'
import {
  MetricaContenidoError,
  MetricaContenidoSkeleton,
} from '../../shared/metrica-card-skeleton'
import { useTasaCierre } from '@/hooks/metricas/use-tasa-cierre'

export default function CloseRateCardClient() {
  const { data, isLoading, isPlaceholderData, isError } = useTasaCierre()

  const cargando = isLoading || isPlaceholderData

  return (
    <Card className='border-border bg-card shadow-none'>
      <CardContent className='p-3.5'>
        <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
          Tasa de cierre
        </p>
        {cargando ? (
          <MetricaContenidoSkeleton alto={72} lineas={2} className='mt-1' />
        ) : isError || !data ? (
          <MetricaContenidoError className='mt-1' />
        ) : (
          <>
            <p className='mt-1 text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-[1.75rem]'>
              {data.tasa_cierre_pct.toLocaleString('es-CL')} %
            </p>
            <p className='mt-0.5 text-xs text-muted-foreground'>
              {data.oportunidades_ganadas} de {data.oportunidades_cerradas}{' '}
              oportunidades cerradas ganadas
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
