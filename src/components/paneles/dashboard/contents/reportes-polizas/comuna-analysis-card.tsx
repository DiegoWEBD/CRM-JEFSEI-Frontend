import {
	QueryClient,
	dehydrate,
	HydrationBoundary,
} from '@tanstack/react-query'
import {
	consultarPolizasPorComuna,
	consultarPolizasPorRamo,
	consultarPolizasPorSexo,
} from '@/aplicacion/metricas/consultas-dashboard'
import {
	clavePolizasPorComuna,
	clavePolizasPorRamo,
	clavePolizasPorSexo,
} from '@/hooks/metricas/query-keys-metricas'
import { filtrosInicialesDashboard } from '@/lib/filtros-dashboard'
import ComunaAnalysisCardClient from './comuna-analysis-card-client'

/**
 * Análisis por comuna: prefetch SSR de las métricas `polizas-por-comuna`,
 * `polizas-por-sexo` y `polizas-por-ramo`.
 *
 * Las queryKeys deben calzar exactamente con las de los hooks del cliente
 * para que la hidratación sea efectiva y no se dispare un segundo fetch.
 * Al cambiar mes/año la versión cliente hace refetch (las queryKeys cambian).
 */
export default async function ComunaAnalysisCard({
	prefetch = true,
}: {
	prefetch?: boolean
}) {
	if (!prefetch) return <ComunaAnalysisCardClient />

	const filtros = filtrosInicialesDashboard()
	const queryClient = new QueryClient()

	await Promise.all([
		queryClient.query({
			queryKey: clavePolizasPorComuna(filtros),
			queryFn: () => consultarPolizasPorComuna(filtros.mes, filtros.year),
		}),
		queryClient.query({
			queryKey: clavePolizasPorSexo(filtros),
			queryFn: () => consultarPolizasPorSexo(filtros.mes, filtros.year),
		}),
		queryClient.query({
			queryKey: clavePolizasPorRamo(filtros),
			queryFn: () => consultarPolizasPorRamo(filtros.mes, filtros.year),
		}),
	])

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ComunaAnalysisCardClient />
		</HydrationBoundary>
	)
}
