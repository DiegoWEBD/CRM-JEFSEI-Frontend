import { ItemValor } from '@/aplicacion/dashboard-gerente/use-cases/obtener-metricas-dashboard-gerente/dto/metricas-dashboard-gerente-json'
import ChartCardWrapper from '@/components/charts/chart-card-wrapper'
import BarChartWidget from '@/components/charts/bar-chart-widget'

type PremiumByCompanyChartProps = {
  data: ItemValor[]
}

export default function PremiumByCompanyChart({ data }: PremiumByCompanyChartProps) {
  return (
    <ChartCardWrapper title='Prima Neta por Compañía'>
      <BarChartWidget data={data} xKey='nombre' bars={[{ key: 'valor' }]} height={250} />
    </ChartCardWrapper>
  )
}
