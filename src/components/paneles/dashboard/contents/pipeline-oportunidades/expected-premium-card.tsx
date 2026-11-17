import {
	QueryClient,
	dehydrate,
	HydrationBoundary,
} from '@tanstack/react-query'
import { consultarPrimaEsperada } from '@/aplicacion/metricas/consultas-dashboard'
import { clavePrimaEsperada } from '@/hooks/metricas/query-keys-metricas'
import ExpectedPremiumCardClient from './expected-premium-card-client'

/**
 * Prima esperada de oportunidades abiertas: prefetch SSR de la métrica
 * `prima-esperada` (no depende de mes/año).
 *
 * La queryKey debe calzar exactamente con la de `usePrimaEsperada` para que
 * la hidratación sea efectiva y no se dispare un segundo fetch.
 */
export default async function ExpectedPremiumCard({
	prefetch = true,
}: {
	prefetch?: boolean
}) {
	if (!prefetch) return <ExpectedPremiumCardClient />

	const queryClient = new QueryClient()

	await queryClient.query({
		queryKey: clavePrimaEsperada(),
		queryFn: () => consultarPrimaEsperada(),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ExpectedPremiumCardClient />
		</HydrationBoundary>
	)
}
