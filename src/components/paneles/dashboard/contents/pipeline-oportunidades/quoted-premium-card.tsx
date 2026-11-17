import {
	QueryClient,
	dehydrate,
	HydrationBoundary,
} from '@tanstack/react-query'
import { consultarPrimaCotizada } from '@/aplicacion/metricas/consultas-dashboard'
import { clavePrimaCotizada } from '@/hooks/metricas/query-keys-metricas'
import QuotedPremiumCardClient from './quoted-premium-card-client'

/**
 * Prima cotizada de oportunidades abiertas: prefetch SSR de la métrica
 * `prima-cotizada` (no depende de mes/año).
 *
 * La queryKey debe calzar exactamente con la de `usePrimaCotizada` para que
 * la hidratación sea efectiva y no se dispare un segundo fetch.
 */
export default async function QuotedPremiumCard() {
	const queryClient = new QueryClient()

	await queryClient.query({
		queryKey: clavePrimaCotizada(),
		queryFn: () => consultarPrimaCotizada(),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<QuotedPremiumCardClient />
		</HydrationBoundary>
	)
}
