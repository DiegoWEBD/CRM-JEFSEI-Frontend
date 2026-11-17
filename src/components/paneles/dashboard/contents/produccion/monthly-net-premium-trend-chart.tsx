import {
	QueryClient,
	dehydrate,
	HydrationBoundary,
} from '@tanstack/react-query'
import { consultarTendenciaAnual } from '@/aplicacion/metricas/consultas-dashboard'
import { claveTendenciaAnual } from '@/hooks/metricas/query-keys-metricas'
import { filtrosInicialesDashboard } from '@/lib/filtros-dashboard'
import MonthlyNetPremiumTrendChartClient from './monthly-net-premium-trend-chart-client'

/**
 * Evolución mensual de prima neta: prefetch SSR de la métrica
 * `tendencia-anual` (enero del año del filtro hasta el mes seleccionado).
 *
 * La queryKey debe calzar exactamente con la de `useTendenciaAnual` para
 * que la hidratación sea efectiva y no se dispare un segundo fetch. Al
 * cambiar mes/año la versión cliente hace refetch (la queryKey cambia).
 */
export default async function MonthlyNetPremiumTrendChart({
	className,
	prefetch = true,
}: {
	className?: string
	prefetch?: boolean
}) {
	if (!prefetch) return <MonthlyNetPremiumTrendChartClient className={className} />

	const filtros = filtrosInicialesDashboard()
	const queryClient = new QueryClient()

	await queryClient.query({
		queryKey: claveTendenciaAnual(filtros),
		queryFn: () => consultarTendenciaAnual(filtros.mes, filtros.year),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<MonthlyNetPremiumTrendChartClient className={className} />
		</HydrationBoundary>
	)
}
