'use client'

import AuthGuard from '@/components/layouts/guards/auth-guard'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import PanelHeader from '@/components/paneles/panel-layout/panel-header/panel-header'

import { useMetricasDashboardGerente } from '@/hooks/dashboard-gerente/use-metricas-dashboard-gerente'
import ProductionSection from './contents/produccion/production-section'
import CommercialActivitiesSection from './contents/actividades-comerciales/commercial-activities-section'
import PoliciesReportsSection from './contents/reportes-polizas/policies-reports-section'
import EvaluacionProyectosSection from './contents/evaluacion-proyectos/evaluacion-proyectos-section'
import { DashboardSkeleton } from '@/components/paneles/dashboard/panel-dashboard-skeleton'

const ROLES_GERENTE = [
	'GERENTE_COMERCIAL',
	'GERENTE_GENERAL',
	'GERENTE_OPERACIONES',
]

export default function PanelDashboardClient() {
	const { data: metricas, isLoading, error } = useMetricasDashboardGerente()

	if (isLoading) {
		return <DashboardSkeleton />
	}

	if (error || !metricas) {
		return (
			<div className='flex items-center justify-center py-12'>
				<p className='text-sm text-muted-foreground'>
					Error al cargar métricas del dashboard.
				</p>
			</div>
		)
	}

	return (
		<AuthGuard allowedRoles={ROLES_GERENTE} fallback={null}>
			<PanelLayout>
				<ProductionSection data={metricas.produccion} />
				<CommercialActivitiesSection data={metricas.actividades_comerciales} />
				<PoliciesReportsSection data={metricas.reportes_polizas} />
				<EvaluacionProyectosSection data={metricas.evaluacion_proyectos} />
			</PanelLayout>
		</AuthGuard>
	)
}
