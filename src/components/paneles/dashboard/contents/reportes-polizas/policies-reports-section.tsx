import { DashboardSection } from '../../shared/dashboard-section'
import PolicyDonutChart from './policy-donut-chart'
import ComunaAnalysisCard from './comuna-analysis-card'

export default function PoliciesReportsSection() {
  return (
    <DashboardSection
      title='Reportes de pólizas'
      description='Pólizas emitidas en el período seleccionado.'
    >
      <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
        <PolicyDonutChart title='Pólizas por comuna' metrica='comuna' />
        <PolicyDonutChart title='Pólizas por sexo' metrica='sexo' />
        <PolicyDonutChart title='Pólizas por edad' metrica='rango-edad' />
        <PolicyDonutChart title='Pólizas por ramo' metrica='ramo' />
      </div>

      <ComunaAnalysisCard />
    </DashboardSection>
  )
}
