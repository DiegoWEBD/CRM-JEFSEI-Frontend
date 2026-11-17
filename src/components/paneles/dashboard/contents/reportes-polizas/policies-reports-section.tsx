import type { FiltrosDashboard } from '@/lib/filtros-dashboard'
import { DashboardSection } from '../../shared/dashboard-section'
import PolicyDonutChart from './policy-donut-chart'
import ComunaAnalysisCard from './comuna-analysis-card'

export default function PoliciesReportsSection({
  prefetch = true,
  filtros,
}: {
  prefetch?: boolean
  filtros?: FiltrosDashboard
}) {
  return (
    <DashboardSection
      title='Reportes de pólizas'
      description='Pólizas emitidas en el período seleccionado.'
    >
      <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
        <PolicyDonutChart title='Pólizas por comuna' metrica='comuna' prefetch={prefetch} filtros={filtros} />
        <PolicyDonutChart title='Pólizas por sexo' metrica='sexo' prefetch={prefetch} filtros={filtros} />
        <PolicyDonutChart title='Pólizas por edad' metrica='rango-edad' prefetch={prefetch} filtros={filtros} />
        <PolicyDonutChart title='Pólizas por ramo' metrica='ramo' prefetch={prefetch} filtros={filtros} />
      </div>

      <ComunaAnalysisCard prefetch={prefetch} filtros={filtros} />
    </DashboardSection>
  )
}
