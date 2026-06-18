import { MetricasDashboardGerenteJson } from '@/aplicacion/dashboard-gerente/use-cases/obtener-metricas-dashboard-gerente/dto/metricas-dashboard-gerente-json'
import PolicyDonutChart from './policy-donut-chart'
import ComunaAnalysisCard from './comuna-analysis-card'

type PoliciesReportsSectionProps = {
  data: MetricasDashboardGerenteJson['reportes_polizas']
}

export default function PoliciesReportsSection({
  data,
}: PoliciesReportsSectionProps) {
  return (
    <section className='space-y-4'>
      <h2 className='text-lg font-semibold'>Reportes de Pólizas</h2>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <PolicyDonutChart title='Por Comuna' data={data.por_comuna} height={220} />
        <PolicyDonutChart title='Por Sexo' data={data.por_sexo} height={220} />
        <PolicyDonutChart title='Por Rango Edad' data={data.por_rango_edad} height={220} />
        <PolicyDonutChart title='Por Ramo' data={data.por_ramo} height={220} />
      </div>
      <ComunaAnalysisCard
        comunaNombre={data.por_comuna[0]?.nombre ?? ''}
        porSexo={data.por_sexo}
        porRamo={data.por_ramo}
      />
    </section>
  )
}
