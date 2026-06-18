import { MetricasDashboardGerenteJson } from '@/aplicacion/dashboard-gerente/use-cases/obtener-metricas-dashboard-gerente/dto/metricas-dashboard-gerente-json'
import EvaluacionKpiCard from './evaluacion-kpi-card'
import EvaluacionBarChart from './evaluacion-bar-chart'

type EvaluacionProyectosSectionProps = {
  data: MetricasDashboardGerenteJson['evaluacion_proyectos']
}

export default function EvaluacionProyectosSection({
  data,
}: EvaluacionProyectosSectionProps) {
  return (
    <section className='space-y-4'>
      <h2 className='text-lg font-semibold'>Evaluación de Proyectos</h2>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        <EvaluacionKpiCard
          label='Total Proyectos'
          value={data.kpis.total_proyectos}
          hint='En el período seleccionado'
        />
        <EvaluacionKpiCard
          label='Monto Total UF'
          value={data.kpis.monto_total_uf.toLocaleString('es-CL')}
          hint='Suma de montos evaluados'
        />
        <EvaluacionKpiCard
          label='Tasa de Conversión'
          value={`${data.kpis.tasa_conversion}%`}
          hint='Proyectos aprobados vs. evaluados'
        />
      </div>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <EvaluacionBarChart title='Proyectos por Compañía' data={data.por_compania} />
        <EvaluacionBarChart title='Proyectos por Ramo' data={data.por_ramo} />
      </div>
    </section>
  )
}
