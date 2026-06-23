'use client'

import type { MetricasDashboardGerenteJson } from '@/aplicacion/dashboard-gerente/use-cases/obtener-metricas-dashboard-gerente/dto/metricas-dashboard-gerente-json'
import { DashboardSectionHeading } from '../../shared/dashboard-section-heading'
import PolicyDonutChart from './policy-donut-chart'
import ComunaAnalysisCard from './comuna-analysis-card'

type PoliciesReportsSectionProps = {
  data: MetricasDashboardGerenteJson['reportes_polizas']
}

export default function PoliciesReportsSection({ data }: PoliciesReportsSectionProps) {
  return (
    <section
      className='space-y-3 rounded-xl border border-border/80 bg-muted/[0.02] p-3.5 pt-4 sm:p-4'
      aria-labelledby='reportes-polizas'
    >
      <DashboardSectionHeading title='Reportes de p&oacute;lizas' />

      <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
        <PolicyDonutChart title='P&oacute;lizas por comuna' data={data.por_comuna} />
        <PolicyDonutChart title='P&oacute;lizas por sexo' data={data.por_sexo} />
        <PolicyDonutChart title='P&oacute;lizas por edad' data={data.por_rango_edad} />
        <PolicyDonutChart title='P&oacute;lizas por ramo' data={data.por_ramo} />
      </div>

      <ComunaAnalysisCard
        porComuna={data.por_comuna}
        porSexo={data.por_sexo}
        porRamo={data.por_ramo}
      />
    </section>
  )
}
