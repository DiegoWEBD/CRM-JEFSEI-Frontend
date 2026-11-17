import { DashboardSection } from '../../shared/dashboard-section'
import ExpectedPremiumProjectionChart from './expected-premium-projection-chart'

export default function OpportunitiesPipelineSection({
	prefetch = true,
}: {
	prefetch?: boolean
}) {
	return (
		<DashboardSection
			title='Pipeline de oportunidades'
			description='Oportunidades abiertas. No depende del filtro de mes y año.'
		>
			<ExpectedPremiumProjectionChart prefetch={prefetch} />
		</DashboardSection>
	)
}
