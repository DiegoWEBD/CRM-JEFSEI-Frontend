import {
	QueryClient,
	dehydrate,
	HydrationBoundary,
} from '@tanstack/react-query'
import { consultarPrimaNetaMensual } from '@/aplicacion/metricas/consultas-dashboard'
import { clavePrimaNetaMensual } from '@/hooks/metricas/query-keys-metricas'
import { filtrosInicialesDashboard } from '@/lib/filtros-dashboard'
import MonthlyNetPremiumCardClient from './monthly-net-premium-card-client'

/**
 * Prima neta mensual: prefetch SSR de la métrica `prima-neta-mensual`.
 *
 * La queryKey debe calzar exactamente con la de `usePrimaNetaMensual` para
 * que la hidratación sea efectiva y no se dispare un segundo fetch. Al
 * cambiar mes/año la versión cliente hace refetch (la queryKey cambia).
 */
export default async function MonthlyNetPremiumCard({
	prefetch = true,
}: {
	prefetch?: boolean
}) {
	if (!prefetch) return <MonthlyNetPremiumCardClient />

	const filtros = filtrosInicialesDashboard()
	const queryClient = new QueryClient()

	await queryClient.query({
		queryKey: clavePrimaNetaMensual(filtros),
		queryFn: () => consultarPrimaNetaMensual(filtros.mes, filtros.year),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<MonthlyNetPremiumCardClient />
		</HydrationBoundary>
	)
}
