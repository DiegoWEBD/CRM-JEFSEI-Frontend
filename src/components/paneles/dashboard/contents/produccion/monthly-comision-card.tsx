import {
	QueryClient,
	dehydrate,
	HydrationBoundary,
} from '@tanstack/react-query'
import { consultarComisionMensual } from '@/aplicacion/metricas/consultas-dashboard'
import { claveComisionMensual } from '@/hooks/metricas/query-keys-metricas'
import { filtrosInicialesDashboard } from '@/lib/filtros-dashboard'
import MonthlyComisionCardClient from './monthly-comision-card-client'

/**
 * Comisión mensual: prefetch SSR de la métrica `comision-mensual`.
 *
 * La queryKey debe calzar exactamente con la de `useComisionMensual` para
 * que la hidratación sea efectiva y no se dispare un segundo fetch. Al
 * cambiar mes/año la versión cliente hace refetch (la queryKey cambia).
 */
export default async function MonthlyComisionCard() {
	const filtros = filtrosInicialesDashboard()
	const queryClient = new QueryClient()

	await queryClient.query({
		queryKey: claveComisionMensual(filtros),
		queryFn: () => consultarComisionMensual(filtros.mes, filtros.year),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<MonthlyComisionCardClient />
		</HydrationBoundary>
	)
}
