import {
	QueryClient,
	dehydrate,
	HydrationBoundary,
} from '@tanstack/react-query'
import { consultarTasaCierre } from '@/aplicacion/metricas/consultas-dashboard'
import { claveTasaCierre } from '@/hooks/metricas/query-keys-metricas'
import CloseRateCardClient from './close-rate-card-client'

/**
 * Tasa de cierre de oportunidades: prefetch SSR de la métrica
 * `tasa-cierre` (no depende de mes/año).
 *
 * La queryKey debe calzar exactamente con la de `useTasaCierre` para que
 * la hidratación sea efectiva y no se dispare un segundo fetch.
 */
export default async function CloseRateCard({
	prefetch = true,
}: {
	prefetch?: boolean
}) {
	if (!prefetch) return <CloseRateCardClient />

	const queryClient = new QueryClient()

	await queryClient.query({
		queryKey: claveTasaCierre(),
		queryFn: () => consultarTasaCierre(),
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<CloseRateCardClient />
		</HydrationBoundary>
	)
}
