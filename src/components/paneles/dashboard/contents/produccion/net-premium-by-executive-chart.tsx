'use client'

import { ProductionHorizontalBarChart } from './production-horizontal-bar-chart'
import { ItemValor } from '@/aplicacion/dashboard-gerente/use-cases/obtener-metricas-dashboard-gerente/dto/metricas-dashboard-gerente-json'

type NetPremiumByExecutiveChartProps = {
  data: ItemValor[]
  className?: string
}

export default function NetPremiumByExecutiveChart({ data, className }: NetPremiumByExecutiveChartProps) {
  return (
    <ProductionHorizontalBarChart
      title='Prima por ejecutivo'
      items={data}
      className={className}
      axisWidth={88}
    />
  )
}
