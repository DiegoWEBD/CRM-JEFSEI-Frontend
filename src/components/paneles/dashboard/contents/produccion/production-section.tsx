import { DashboardSection } from '../../shared/dashboard-section'
import MonthlyNetPremiumTrendChart from './monthly-net-premium-trend-chart'
import NetPremiumByCompanyChart from './net-premium-by-company-chart'
import NetPremiumByExecutiveChart from './net-premium-by-executive-chart'
import NetPremiumByInsuranceLineChart from './net-premium-by-insurance-line-chart'
import TopCompanyCard from './top-company-card'

export default function ProductionSection() {
	return (
		<DashboardSection
			title='Producción comercial'
			description='Prima neta del período seleccionado.'
		>
			<MonthlyNetPremiumTrendChart />

			<div className='space-y-2.5 border-t border-border/60 pt-4'>
				<h3 className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
					Compañías principales
				</h3>
				<div className='grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 xl:items-stretch'>
					<TopCompanyCard />
					<NetPremiumByCompanyChart />
				</div>
			</div>

			<div className='space-y-2.5 border-t border-border/60 pt-4'>
				<h3 className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
					Distribución de producción
				</h3>
				<div className='grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 xl:items-start'>
					<NetPremiumByInsuranceLineChart />
					<NetPremiumByExecutiveChart />
				</div>
			</div>
		</DashboardSection>
	)
}
