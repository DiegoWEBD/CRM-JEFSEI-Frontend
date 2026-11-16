'use client'

import { Building2 } from 'lucide-react'
import { Card, CardContent } from '@/components/card'
import { useFiltrosDashboard } from '../../filtros-dashboard-context'
import {
  MetricaCardError,
  MetricaCardSkeleton,
} from '../../shared/metrica-card-skeleton'
import { useCompaniaTop } from '@/hooks/metricas/use-compania-top'

export default function TopCompanyCardClient() {
  const { mes, year } = useFiltrosDashboard()
  const { data, isLoading, isError } = useCompaniaTop(mes, year)

  if (isLoading) return <MetricaCardSkeleton />
  if (isError) return <MetricaCardError />

  return (
    <Card className='border-border bg-card shadow-none'>
      <CardContent className='p-3.5'>
        <div className='flex items-start justify-between gap-2'>
          <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
            Compañía principal
          </p>
          <Building2 className='h-3.5 w-3.5 shrink-0 text-primary/70' aria-hidden />
        </div>
        {data?.nombre ? (
          <>
            <p className='mt-1 text-base font-semibold tracking-tight text-foreground'>{data.nombre}</p>
            <p className='mt-0.5 text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-[1.75rem]'>
              {data.prima_neta?.toLocaleString('es-CL')} UF
            </p>
          </>
        ) : (
          <p className='mt-2 text-xs text-muted-foreground'>No hay datos disponibles para este período</p>
        )}
      </CardContent>
    </Card>
  )
}
