import PanelDashboardClient from '@/components/paneles/dashboard/panel-dashboard-client'
import { DashboardSkeleton } from '@/components/paneles/dashboard/panel-dashboard-skeleton'
import { hasSomeRole } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

const ROLES_GERENTE = [
	'GERENTE_COMERCIAL',
	'GERENTE_GENERAL',
	'GERENTE_OPERACIONES',
]

export default async function DashboardPage() {
	const esGerente = await hasSomeRole(ROLES_GERENTE)

	if (!esGerente) {
		redirect('/')
	}

	return (
		<Suspense fallback={<DashboardSkeleton />}>
			<PanelDashboardClient />
		</Suspense>
	)
}
