import { DashboardSection } from '../../shared/dashboard-section'
import PolicyDonutChart from './policy-donut-chart'
import ComunaAnalysisCard from './comuna-analysis-card'

export default function PoliciesReportsSection({
  prefetch = true,
}: {
  prefetch?: boolean
}) {
  return (
    <DashboardSection
      title='Reportes de pólizas'
      description='Pólizas emitidas en el período seleccionado.'
    >
      <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
        <PolicyDonutChart title='Pólizas por comuna' metrica='comuna' prefetch={prefetch} />
        <PolicyDonutChart title='Pólizas por sexo' metrica='sexo' prefetch={prefetch} />
        <PolicyDonutChart title='Pólizas por edad' metrica='rango-edad' prefetch={prefetch} />
        <PolicyDonutChart title='Pólizas por ramo' metrica='ramo' prefetch={prefetch} />
      </div>

      <ComunaAnalysisCard prefetch={prefetch} />
    </DashboardSection>
  )
}
