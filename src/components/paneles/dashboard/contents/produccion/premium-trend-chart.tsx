import { TendenciaMes } from '@/aplicacion/dashboard-gerente/use-cases/obtener-metricas-dashboard-gerente/dto/metricas-dashboard-gerente-json'
import ChartCardWrapper from '@/components/charts/chart-card-wrapper'
import LineChartWidget from '@/components/charts/line-chart-widget'

type PremiumTrendChartProps = {
  data: TendenciaMes[]
}

export default function PremiumTrendChart({ data }: PremiumTrendChartProps) {
  return (
    <ChartCardWrapper title='Tendencia Prima Neta (12 meses)'>
      <LineChartWidget data={data} xKey='mes' yKey='prima_neta' height={250} />
    </ChartCardWrapper>
  )
}
