'use client'

import { Card, CardContent } from '@/components/card'
import { useFiltrosDashboard } from '../../filtros-dashboard-context'
import {
  MetricaContenidoError,
  MetricaContenidoSkeleton,
} from '../../shared/metrica-card-skeleton'
import { useResumenActividades } from '@/hooks/metricas/use-resumen-actividades'

export default function CommercialActivityCompletionSummaryClient() {
  const { mes, year } = useFiltrosDashboard()
  const { data, isLoading, isPlaceholderData, isError } = useResumenActividades(mes, year)

  const cargando = isLoading || isPlaceholderData

  return (
    <>
      <Card className='border-border bg-muted/15 shadow-none'>
        <CardContent className='grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-4'>
          <div>
            <p className='text-xs font-medium text-muted-foreground'>Gestiones concretadas</p>
            {cargando ? (
              <MetricaContenidoSkeleton alto={56} lineas={1} className='mt-0.5' />
            ) : isError || !data ? (
              <MetricaContenidoError className='mt-0.5' />
            ) : (
              <>
                <p className='mt-0.5 text-lg font-semibold tabular-nums text-foreground'>
                  {data.concretadas.toLocaleString('es-CL')}{' '}
                  <span className='text-sm font-normal text-muted-foreground'>
                    de {data.agendadas.toLocaleString('es-CL')}
                  </span>
                </p>
                <p className='text-sm font-medium text-emerald-700 dark:text-emerald-300'>
                  {data.porcentaje_cumplimiento}% cumplimiento
                </p>
              </>
            )}
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Agendadas</p>
            {cargando ? (
              <MetricaContenidoSkeleton alto={56} lineas={1} className='mt-0.5' />
            ) : isError || !data ? (
              <MetricaContenidoError className='mt-0.5' />
            ) : (
              <p className='text-lg font-semibold tabular-nums'>{data.agendadas.toLocaleString('es-CL')}</p>
            )}
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Concretadas</p>
            {cargando ? (
              <MetricaContenidoSkeleton alto={56} lineas={1} className='mt-0.5' />
            ) : isError || !data ? (
              <MetricaContenidoError className='mt-0.5' />
            ) : (
              <p className='text-lg font-semibold tabular-nums'>{data.concretadas.toLocaleString('es-CL')}</p>
            )}
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Pendientes</p>
            {cargando ? (
              <MetricaContenidoSkeleton alto={56} lineas={1} className='mt-0.5' />
            ) : isError || !data ? (
              <MetricaContenidoError className='mt-0.5' />
            ) : (
              <p className='text-lg font-semibold tabular-nums'>{data.pendientes.toLocaleString('es-CL')}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <p className='text-sm text-muted-foreground'>
        Total visible:{' '}
        {cargando ? (
          <span
            aria-hidden
            className='inline-block h-4 w-12 animate-pulse rounded-md bg-accent align-middle'
          />
        ) : (
          <span className='font-medium tabular-nums text-foreground'>
            {(data?.agendadas ?? 0).toLocaleString('es-CL')}
          </span>
        )}
      </p>
    </>
  )
}
