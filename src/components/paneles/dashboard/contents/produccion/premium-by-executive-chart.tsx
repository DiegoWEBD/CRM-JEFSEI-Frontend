import { ItemValor } from '@/aplicacion/dashboard-gerente/use-cases/obtener-metricas-dashboard-gerente/dto/metricas-dashboard-gerente-json'
import ChartCardWrapper from '@/components/charts/chart-card-wrapper'
import HorizontalBarChartWidget from '@/components/charts/horizontal-bar-chart-widget'

type PremiumByExecutiveChartProps = {
  data: ItemValor[]
}

export default function PremiumByExecutiveChart({ data }: PremiumByExecutiveChartProps) {
  return (
    <ChartCardWrapper title='Prima Neta por Ejecutivo'>
      <HorizontalBarChartWidget data={data} yKey='nombre' xKey='valor' height={250} />
    </ChartCardWrapper>
  )
}
