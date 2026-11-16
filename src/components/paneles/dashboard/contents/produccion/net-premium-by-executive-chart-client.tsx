'use client'

import { useFiltrosDashboard } from '../../filtros-dashboard-context'
import {
  MetricaCardError,
  MetricaCardSkeleton,
} from '../../shared/metrica-card-skeleton'
import { usePrimaPorEjecutivo } from '@/hooks/metricas/use-prima-por-ejecutivo'
import { ProductionHorizontalBarChart } from './production-horizontal-bar-chart'

type NetPremiumByExecutiveChartClientProps = {
  className?: string
}

export default function NetPremiumByExecutiveChartClient({ className }: NetPremiumByExecutiveChartClientProps) {
  const { mes, year } = useFiltrosDashboard()
  const { data, isLoading, isError } = usePrimaPorEjecutivo(mes, year)

  if (isLoading) return <MetricaCardSkeleton alto={220} className={className} />
  if (isError || !data) return <MetricaCardError className={className} />

  return (
    <ProductionHorizontalBarChart
      title='Prima por ejecutivo'
      items={data}
      className={className}
      axisWidth={88}
    />
  )
}
