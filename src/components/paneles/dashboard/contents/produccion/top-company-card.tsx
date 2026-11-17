import {
	QueryClient,
	dehydrate,
	HydrationBoundary,
} from '@tanstack/react-query'
import { consultarCompaniaTop } from '@/aplicacion/metricas/consultas-dashboard'
import { claveCompaniaTop } from '@/hooks/metricas/query-keys-metricas'
import { filtrosInicialesDashboard } from '@/lib/filtros-dashboard'
import TopCompanyCardClient from './top-company-card-client'

/**
 * Compañía principal: prefetch SSR de la métrica `compania-top`.
 *
 * La queryKey debe calzar exactamente con la de `useCompaniaTop` para que
 * la hidratación sea efectiva y no se dispare un segundo fetch. Al cambiar
 * mes/año la versión cliente hace refetch (la queryKey cambia).
 */
export default async function TopCompanyCard({
	prefetch = true,
}: {
	prefetch?: boolean
}) {
	if (!prefetch) return <TopCompanyCardClient />

	const filtros = filtrosInicialesDashboard()
	const queryClient = new QueryClient()

	await queryClient.query({
		queryKey: claveCompaniaTop(filtros),
		queryFn: () => consultarCompaniaTop(filtros.mes, filtros.year),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<TopCompanyCardClient />
		</HydrationBoundary>
	)
}
