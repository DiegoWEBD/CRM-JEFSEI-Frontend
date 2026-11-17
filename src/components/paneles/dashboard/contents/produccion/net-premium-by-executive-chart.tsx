import {
	QueryClient,
	dehydrate,
	HydrationBoundary,
} from '@tanstack/react-query'
import { consultarPrimaPorEjecutivo } from '@/aplicacion/metricas/consultas-dashboard'
import { clavePrimaPorEjecutivo } from '@/hooks/metricas/query-keys-metricas'
import { filtrosInicialesDashboard, type FiltrosDashboard } from '@/lib/filtros-dashboard'
import NetPremiumByExecutiveChartClient from './net-premium-by-executive-chart-client'

/**
 * Prima por ejecutivo: prefetch SSR de la métrica `prima-por-ejecutivo`.
 *
 * La queryKey debe calzar exactamente con la de `usePrimaPorEjecutivo` para
 * que la hidratación sea efectiva y no se dispare un segundo fetch. Al
 * cambiar mes/año la versión cliente hace refetch (la queryKey cambia).
 */
export default async function NetPremiumByExecutiveChart({
	className,
	prefetch = true,
	filtros = filtrosInicialesDashboard(),
}: {
	className?: string
	prefetch?: boolean
	filtros?: FiltrosDashboard
}) {
	if (!prefetch) return <NetPremiumByExecutiveChartClient className={className} />

	const queryClient = new QueryClient()

	await queryClient.query({
		queryKey: clavePrimaPorEjecutivo(filtros),
		queryFn: () => consultarPrimaPorEjecutivo(filtros.mes, filtros.year),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<NetPremiumByExecutiveChartClient className={className} />
		</HydrationBoundary>
	)
}
