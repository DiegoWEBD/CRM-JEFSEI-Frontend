import { ActividadTipo } from '@/aplicacion/dashboard-gerente/use-cases/obtener-metricas-dashboard-gerente/dto/metricas-dashboard-gerente-json'
import ChartCardWrapper from '@/components/charts/chart-card-wrapper'
import BarChartWidget from '@/components/charts/bar-chart-widget'

type ActivitiesBarChartProps = {
  data: ActividadTipo[]
}

export default function ActivitiesBarChart({ data }: ActivitiesBarChartProps) {
  return (
    <ChartCardWrapper title='Gestiones por Tipo y Estado'>
      <BarChartWidget
        data={data}
        xKey='tipo'
        bars={[
          { key: 'concretadas', name: 'Concretadas' },
          { key: 'pendientes', name: 'Pendientes' },
        ]}
        height={250}
      />
    </ChartCardWrapper>
  )
}
