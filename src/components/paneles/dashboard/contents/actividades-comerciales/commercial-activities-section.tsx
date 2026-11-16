import { DashboardSection } from '../../shared/dashboard-section'
import { CommercialActivityFilters } from './commercial-activity-filters'
import CommercialActivityCompletionSummary from './commercial-activity-completion-summary'
import CommercialActivityCountCards from './commercial-activity-count-cards'
import CommercialActivitiesBarChart from './commercial-activities-bar-chart'

export default function CommercialActivitiesSection() {
  return (
    <DashboardSection
      title='Gestiones comerciales'
      description='Gestiones registradas en el período seleccionado.'
    >
      <CommercialActivityFilters />

      <div className='space-y-4' aria-live='polite'>
        <CommercialActivityCompletionSummary />

        <CommercialActivityCountCards />

        <CommercialActivitiesBarChart />
      </div>
    </DashboardSection>
  )
}
