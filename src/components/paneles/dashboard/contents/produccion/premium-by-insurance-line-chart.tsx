import { ItemValor } from '@/aplicacion/dashboard-gerente/use-cases/obtener-metricas-dashboard-gerente/dto/metricas-dashboard-gerente-json'
import ChartCardWrapper from '@/components/charts/chart-card-wrapper'
import HorizontalBarChartWidget from '@/components/charts/horizontal-bar-chart-widget'

type PremiumByInsuranceLineChartProps = {
  data: ItemValor[]
}

export default function PremiumByInsuranceLineChart({ data }: PremiumByInsuranceLineChartProps) {
  return (
    <ChartCardWrapper title='Prima Neta por Ramo'>
      <HorizontalBarChartWidget data={data} yKey='nombre' xKey='valor' height={250} />
    </ChartCardWrapper>
  )
}
