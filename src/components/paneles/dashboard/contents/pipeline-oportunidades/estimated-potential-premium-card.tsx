import {
	QueryClient,
	dehydrate,
	HydrationBoundary,
} from '@tanstack/react-query'
import { consultarPrimaPotencialEstimada } from '@/aplicacion/metricas/consultas-dashboard'
import { clavePrimaPotencialEstimada } from '@/hooks/metricas/query-keys-metricas'
import EstimatedPotentialPremiumCardClient from './estimated-potential-premium-card-client'

/**
 * Prima potencial estimada de oportunidades abiertas: prefetch SSR de la
 * métrica `prima-potencial-estimada` (no depende de mes/año).
 *
 * La queryKey debe calzar exactamente con la de `usePrimaPotencialEstimada`
 * para que la hidratación sea efectiva y no se dispare un segundo fetch.
 */
export default async function EstimatedPotentialPremiumCard({
	prefetch = true,
}: {
	prefetch?: boolean
}) {
	if (!prefetch) return <EstimatedPotentialPremiumCardClient />

	const queryClient = new QueryClient()

	await queryClient.query({
		queryKey: clavePrimaPotencialEstimada(),
		queryFn: () => consultarPrimaPotencialEstimada(),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<EstimatedPotentialPremiumCardClient />
		</HydrationBoundary>
	)
}
