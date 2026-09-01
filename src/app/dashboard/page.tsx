import PanelDashboardClient from '@/components/paneles/dashboard/panel-dashboard-client'
import { DashboardSkeleton } from '@/components/paneles/dashboard/panel-dashboard-skeleton'
import { Suspense } from 'react'

export default async function DashboardPage() {
	return (
		<Suspense fallback={<DashboardSkeleton />}>
			<PanelDashboardClient />
		</Suspense>
	)
}
