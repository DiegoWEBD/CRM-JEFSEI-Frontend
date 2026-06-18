import { ItemCantidad } from '@/aplicacion/dashboard-gerente/use-cases/obtener-metricas-dashboard-gerente/dto/metricas-dashboard-gerente-json'
import DonutChartWidget from '@/components/charts/donut-chart-widget'
import ChartCardWrapper from '@/components/charts/chart-card-wrapper'

type PolicyDonutChartProps = {
  data: ItemCantidad[]
  title: string
  height?: number
}

export default function PolicyDonutChart({
  data,
  title,
  height,
}: PolicyDonutChartProps) {
  return (
    <ChartCardWrapper title={title}>
      <DonutChartWidget
        data={data}
        nameKey='nombre'
        dataKey='cantidad'
        height={height}
      />
    </ChartCardWrapper>
  )
}
