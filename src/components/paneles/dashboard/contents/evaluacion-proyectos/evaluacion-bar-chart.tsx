import { ItemCantidad } from '@/aplicacion/dashboard-gerente/use-cases/obtener-metricas-dashboard-gerente/dto/metricas-dashboard-gerente-json'
import ChartCardWrapper from '@/components/charts/chart-card-wrapper'
import BarChartWidget from '@/components/charts/bar-chart-widget'

type EvaluacionBarChartProps = {
  data: ItemCantidad[]
  title: string
}

export default function EvaluacionBarChart({
  data,
  title,
}: EvaluacionBarChartProps) {
  return (
    <ChartCardWrapper title={title}>
      <BarChartWidget data={data} xKey='nombre' bars={[{ key: 'cantidad' }]} height={250} />
    </ChartCardWrapper>
  )
}
