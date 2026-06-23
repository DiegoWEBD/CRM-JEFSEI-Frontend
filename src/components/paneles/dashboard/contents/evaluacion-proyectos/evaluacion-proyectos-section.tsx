'use client'

import type { MetricasDashboardGerenteJson } from '@/aplicacion/dashboard-gerente/use-cases/obtener-metricas-dashboard-gerente/dto/metricas-dashboard-gerente-json'
import { DashboardSectionHeading } from '../../shared/dashboard-section-heading'
import EvaluacionKpiCard from './evaluacion-kpi-card'
import EvaluacionBarChart from './evaluacion-bar-chart'

type EvaluacionProyectosSectionProps = {
  data: MetricasDashboardGerenteJson['evaluacion_proyectos']
}

export default function EvaluacionProyectosSection({
  data,
}: EvaluacionProyectosSectionProps) {
  return (
    <section
      className='space-y-3 rounded-xl border border-border/80 bg-muted/[0.02] p-3.5 pt-4 sm:p-4'
      aria-labelledby='evaluacion-proyectos'
    >
      <DashboardSectionHeading title='Seguimiento evaluaci&oacute;n de proyectos' />

      <div className='grid gap-3 sm:grid-cols-3'>
        <EvaluacionKpiCard
          label='Cotizaciones realizadas'
          value={data.kpis.total_proyectos}
          hint='Total de proyectos evaluados'
        />
        <EvaluacionKpiCard
          label='Monto total UF'
          value={data.kpis.monto_total_uf}
          hint='Suma de montos evaluados'
        />
        <EvaluacionKpiCard
          label='Tasa de conversi&oacute;n'
          value={data.kpis.tasa_conversion}
          hint='Proyectos aprobados vs. evaluados'
        />
      </div>

      <div className='grid gap-3 lg:grid-cols-2 lg:items-start'>
        <EvaluacionBarChart
          title='Compa&ntilde;&iacute;as donde se cotiza'
          data={data.por_compania}
        />
        <EvaluacionBarChart
          title='L&iacute;neas de seguro m&aacute;s cotizadas'
          data={data.por_ramo}
        />
      </div>
    </section>
  )
}
