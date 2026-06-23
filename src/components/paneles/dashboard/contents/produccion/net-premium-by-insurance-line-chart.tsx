'use client'

import { ProductionHorizontalBarChart } from './production-horizontal-bar-chart'
import { ItemValor } from '@/aplicacion/dashboard-gerente/use-cases/obtener-metricas-dashboard-gerente/dto/metricas-dashboard-gerente-json'

type NetPremiumByInsuranceLineChartProps = {
  data: ItemValor[]
  className?: string
}

export default function NetPremiumByInsuranceLineChart({ data, className }: NetPremiumByInsuranceLineChartProps) {
  return (
    <ProductionHorizontalBarChart
      title='Prima por línea de seguros'
      items={data}
      className={className}
      axisWidth={100}
    />
  )
}
