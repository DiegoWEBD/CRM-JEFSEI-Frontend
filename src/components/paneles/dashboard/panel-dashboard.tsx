import PermissionGuard from '@/components/layouts/guards/permission-guard'
import { filtrosInicialesDashboard } from '@/lib/filtros-dashboard'
import { resolverTabDashboard } from '@/lib/tab-dashboard'
import DashboardKpisRow from './dashboard-kpis-row'
import DashboardTabs from './dashboard-tabs'
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
 * Layout: pestañas "Pipeline comercial" / "Producción comercial" (páginas
 * del informe). La barra de filtros mes/año solo aplica a producción; cada
 * pestaña muestra sus indicadores clave y secciones.
 *
 * Solo la pestaña activa (resuelta desde `?tab=`) hace prefetch SSR de sus
 * métricas; las de la otra pestaña se fetchean en cliente al cambiar a ella.
 */
export default async function PanelDashboard({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const filtrosIniciales = filtrosInicialesDashboard()
	const tab = resolverTabDashboard((await searchParams).tab)

	return (
		<PermissionGuard allowedPermissions={['VER_METRICAS_GERENCIA']}>
			<FiltrosDashboardProvider filtrosIniciales={filtrosIniciales}>
				<DashboardTabs
					pipeline={
						<>
							<DashboardKpisRow tipo='pipeline' prefetch={tab === 'pipeline'} />
							<OpportunitiesPipelineSection prefetch={tab === 'pipeline'} />
						</>
					}
					produccion={
						<>
							<DashboardKpisRow tipo='produccion' prefetch={tab === 'produccion'} />
							<div className='grid gap-8 lg:grid-cols-2 lg:items-start'>
								<ProductionSection prefetch={tab === 'produccion'} />
								<CommercialActivitiesSection prefetch={tab === 'produccion'} />
							</div>
							<PoliciesReportsSection prefetch={tab === 'produccion'} />
						</>
					}
				/>
			</FiltrosDashboardProvider>
		</PermissionGuard>
	)
}
