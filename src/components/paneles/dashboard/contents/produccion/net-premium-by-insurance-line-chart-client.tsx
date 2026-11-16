'use client'

import { useFiltrosDashboard } from '../../filtros-dashboard-context'
import {
  MetricaCardError,
  MetricaCardSkeleton,
} from '../../shared/metrica-card-skeleton'
import { usePrimaPorRamo } from '@/hooks/metricas/use-prima-por-ramo'
import { ProductionHorizontalBarChart } from './production-horizontal-bar-chart'

type NetPremiumByInsuranceLineChartClientProps = {
  className?: string
}

export default function NetPremiumByInsuranceLineChartClient({ className }: NetPremiumByInsuranceLineChartClientProps) {
  const { mes, year } = useFiltrosDashboard()
  const { data, isLoading, isError } = usePrimaPorRamo(mes, year)

  if (isLoading) return <MetricaCardSkeleton alto={220} className={className} />
  if (isError || !data) return <MetricaCardError className={className} />

  return (
    <ProductionHorizontalBarChart
      title='Prima por línea de seguros'
      items={data}
      className={className}
      axisWidth={100}
    />
  )
}
