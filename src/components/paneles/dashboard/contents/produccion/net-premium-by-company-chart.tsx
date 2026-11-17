import {
	QueryClient,
	dehydrate,
	HydrationBoundary,
} from '@tanstack/react-query'
import { consultarPrimaPorCompania } from '@/aplicacion/metricas/consultas-dashboard'
import { clavePrimaPorCompania } from '@/hooks/metricas/query-keys-metricas'
import { filtrosInicialesDashboard, type FiltrosDashboard } from '@/lib/filtros-dashboard'
import NetPremiumByCompanyChartClient from './net-premium-by-company-chart-client'

/**
 * Prima neta por compañía: prefetch SSR de la métrica `prima-por-compania`.
 *
 * La queryKey debe calzar exactamente con la de `usePrimaPorCompania` para
 * que la hidratación sea efectiva y no se dispare un segundo fetch. Al
 * cambiar mes/año la versión cliente hace refetch (la queryKey cambia).
 */
export default async function NetPremiumByCompanyChart({
	className,
	prefetch = true,
	filtros = filtrosInicialesDashboard(),
}: {
	className?: string
	prefetch?: boolean
	filtros?: FiltrosDashboard
}) {
	if (!prefetch) return <NetPremiumByCompanyChartClient className={className} />

	const queryClient = new QueryClient()

	await queryClient.query({
		queryKey: clavePrimaPorCompania(filtros),
		queryFn: () => consultarPrimaPorCompania(filtros.mes, filtros.year),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<NetPremiumByCompanyChartClient className={className} />
		</HydrationBoundary>
	)
}
