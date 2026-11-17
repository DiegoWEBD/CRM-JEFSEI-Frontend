import {
	QueryClient,
	dehydrate,
	HydrationBoundary,
} from '@tanstack/react-query'
import { consultarResumenActividades } from '@/aplicacion/metricas/consultas-dashboard'
import { claveResumenActividades } from '@/hooks/metricas/query-keys-metricas'
import { filtrosInicialesDashboard, type FiltrosDashboard } from '@/lib/filtros-dashboard'
import CommercialActivityCompletionSummaryClient from './commercial-activity-completion-summary-client'

/**
 * Resumen de gestiones: prefetch SSR de la métrica `resumen-actividades`.
 *
 * La queryKey debe calzar exactamente con la de `useResumenActividades`
 * para que la hidratación sea efectiva y no se dispare un segundo fetch.
 * Al cambiar mes/año la versión cliente hace refetch (la queryKey cambia).
 */
export default async function CommercialActivityCompletionSummary({
	prefetch = true,
	filtros = filtrosInicialesDashboard(),
}: {
	prefetch?: boolean
	filtros?: FiltrosDashboard
}) {
	if (!prefetch) return <CommercialActivityCompletionSummaryClient />

	const queryClient = new QueryClient()

	await queryClient.query({
		queryKey: claveResumenActividades(filtros),
		queryFn: () => consultarResumenActividades(filtros.mes, filtros.year),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<CommercialActivityCompletionSummaryClient />
		</HydrationBoundary>
	)
}
