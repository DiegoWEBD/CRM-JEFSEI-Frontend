import {
	QueryClient,
	dehydrate,
	HydrationBoundary,
} from '@tanstack/react-query'
import { consultarTendencia12Meses } from '@/aplicacion/metricas/consultas-dashboard'
import { claveTendencia12Meses } from '@/hooks/metricas/query-keys-metricas'
import { filtrosInicialesDashboard } from '@/lib/filtros-dashboard'
import MonthlyNetPremiumTrendChartClient from './monthly-net-premium-trend-chart-client'

/**
 * Evolución mensual de prima neta: prefetch SSR de la métrica
 * `tendencia-12-meses`.
 *
 * La queryKey debe calzar exactamente con la de `useTendencia12Meses` para
 * que la hidratación sea efectiva y no se dispare un segundo fetch. Al
 * cambiar mes/año la versión cliente hace refetch (la queryKey cambia).
 */
export default async function MonthlyNetPremiumTrendChart({
	className,
}: {
	className?: string
}) {
	const filtros = filtrosInicialesDashboard()
	const queryClient = new QueryClient()

	await queryClient.prefetchQuery({
		queryKey: claveTendencia12Meses(filtros),
		queryFn: () => consultarTendencia12Meses(filtros.mes, filtros.year),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<MonthlyNetPremiumTrendChartClient className={className} />
		</HydrationBoundary>
	)
}
