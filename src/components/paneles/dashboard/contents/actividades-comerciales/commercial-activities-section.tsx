import { MetricasDashboardGerenteJson } from '@/aplicacion/dashboard-gerente/use-cases/obtener-metricas-dashboard-gerente/dto/metricas-dashboard-gerente-json'
import ActivitiesBarChart from './activities-bar-chart'
import ActivityCompletionSummary from './activity-completion-summary'

type CommercialActivitiesSectionProps = {
  data: MetricasDashboardGerenteJson['actividades_comerciales']
}

export default function CommercialActivitiesSection({
  data,
}: CommercialActivitiesSectionProps) {
  return (
    <section className='space-y-4'>
      <h2 className='text-lg font-semibold'>Actividades Comerciales</h2>
      <ActivitiesBarChart data={data.por_tipo} />
      <ActivityCompletionSummary data={data.resumen} />
    </section>
  )
}
