import {
	QueryClient,
	dehydrate,
	HydrationBoundary,
} from '@tanstack/react-query'
import { consultarPrimaPorRamo } from '@/aplicacion/metricas/consultas-dashboard'
import { clavePrimaPorRamo } from '@/hooks/metricas/query-keys-metricas'
import { filtrosInicialesDashboard, type FiltrosDashboard } from '@/lib/filtros-dashboard'
import NetPremiumByInsuranceLineChartClient from './net-premium-by-insurance-line-chart-client'

/**
 * Prima por línea de seguros: prefetch SSR de la métrica `prima-por-ramo`.
 *
 * La queryKey debe calzar exactamente con la de `usePrimaPorRamo` para que
 * la hidratación sea efectiva y no se dispare un segundo fetch. Al cambiar
 * mes/año la versión cliente hace refetch (la queryKey cambia).
 */
export default async function NetPremiumByInsuranceLineChart({
	className,
	prefetch = true,
	filtros = filtrosInicialesDashboard(),
}: {
	className?: string
	prefetch?: boolean
	filtros?: FiltrosDashboard
}) {
	if (!prefetch) return <NetPremiumByInsuranceLineChartClient className={className} />

	const queryClient = new QueryClient()

	await queryClient.query({
		queryKey: clavePrimaPorRamo(filtros),
		queryFn: () => consultarPrimaPorRamo(filtros.mes, filtros.year),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<NetPremiumByInsuranceLineChartClient className={className} />
		</HydrationBoundary>
	)
}
