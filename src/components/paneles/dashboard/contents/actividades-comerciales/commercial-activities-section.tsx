import type { FiltrosDashboard } from '@/lib/filtros-dashboard'
import { DashboardSection } from '../../shared/dashboard-section'
import { CommercialActivityFilters } from './commercial-activity-filters'
import CommercialActivityCompletionSummary from './commercial-activity-completion-summary'
import CommercialActivityCountCards from './commercial-activity-count-cards'
import CommercialActivitiesBarChart from './commercial-activities-bar-chart'

export default function CommercialActivitiesSection({
  prefetch = true,
  filtros,
}: {
  prefetch?: boolean
  filtros?: FiltrosDashboard
}) {
  return (
    <DashboardSection
      title='Gestiones comerciales'
      description='Gestiones registradas en el período seleccionado.'
    >
      <CommercialActivityFilters />

      <div className='space-y-4' aria-live='polite'>
        <CommercialActivityCompletionSummary prefetch={prefetch} filtros={filtros} />

        <CommercialActivityCountCards prefetch={prefetch} filtros={filtros} />

        <CommercialActivitiesBarChart prefetch={prefetch} filtros={filtros} />
      </div>
    </DashboardSection>
  )
}
