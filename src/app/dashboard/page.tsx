import { Suspense } from 'react'
import PanelDashboard from '@/components/paneles/dashboard/panel-dashboard'
import { DashboardSkeleton } from '@/components/paneles/dashboard/panel-dashboard-skeleton'

export default async function DashboardPage() {
	return (
		<Suspense fallback={<DashboardSkeleton />}>
			<PanelDashboard />
		</Suspense>
	)
}
