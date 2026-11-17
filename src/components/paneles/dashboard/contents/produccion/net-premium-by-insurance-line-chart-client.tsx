'use client'

import { useFiltrosDashboard } from '../../filtros-dashboard-context'
import { usePrimaPorRamo } from '@/hooks/metricas/use-prima-por-ramo'
import { ProductionHorizontalBarChart } from './production-horizontal-bar-chart'

type NetPremiumByInsuranceLineChartClientProps = {
  className?: string
}

export default function NetPremiumByInsuranceLineChartClient({ className }: NetPremiumByInsuranceLineChartClientProps) {
  const { mes, year } = useFiltrosDashboard()
  const { data, isLoading, isPlaceholderData, isError } = usePrimaPorRamo(mes, year)

  const cargando = isLoading || isPlaceholderData

  return (
    <ProductionHorizontalBarChart
      title='Prima por línea de seguros'
      items={data}
      loading={cargando}
      error={isError || (!cargando && !data)}
      className={className}
      axisWidth={100}
    />
  )
}
