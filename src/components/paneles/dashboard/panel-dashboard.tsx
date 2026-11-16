import PermissionGuard from '@/components/layouts/guards/permission-guard'
import PanelLayout from '@/components/paneles/panel-layout/panel-layout'
import { filtrosInicialesDashboard } from '@/lib/filtros-dashboard'
import DashboardKpisRow from './dashboard-kpis-row'
import FiltrosDashboardBar from './filtros-dashboard-bar'
import { FiltrosDashboardProvider } from './filtros-dashboard-context'
import CommercialActivitiesSection from './contents/actividades-comerciales/commercial-activities-section'
import OpportunitiesPipelineSection from './contents/pipeline-oportunidades/opportunities-pipeline-section'
import ProductionSection from './contents/produccion/production-section'
import PoliciesReportsSection from './contents/reportes-polizas/policies-reports-section'

/**
 * Panel del dashboard de gerencia.
 *
 * Cada métrica tiene su tarjeta, y cada tarjeta hace su fetching server-side
 * al endpoint independiente correspondiente y lo pasa a una versión client
 * (query client + hydration boundary) que refetchea al cambiar mes/año.
 *
 * Layout: barra de filtros sticky → indicadores clave → pipeline →
 * producción y gestiones en dos columnas → reportes de pólizas.
 */
export default function PanelDashboard() {
	const filtrosIniciales = filtrosInicialesDashboard()

	return (
		<PermissionGuard allowedPermissions={['VER_METRICAS_GERENCIA']}>
			<FiltrosDashboardProvider filtrosIniciales={filtrosIniciales}>
				<FiltrosDashboardBar />

				<PanelLayout>
					<DashboardKpisRow />
					<OpportunitiesPipelineSection />

					<div className='grid gap-8 lg:grid-cols-2 lg:items-start'>
						<ProductionSection />
						<CommercialActivitiesSection />
					</div>

					<PoliciesReportsSection />
				</PanelLayout>
			</FiltrosDashboardProvider>
		</PermissionGuard>
	)
}
