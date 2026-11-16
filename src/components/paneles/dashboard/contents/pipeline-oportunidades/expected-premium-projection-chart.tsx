import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query'
import { consultarProyeccionPrimaEsperada } from '@/aplicacion/metricas/consultas-dashboard'
import { claveProyeccionPrimaEsperada } from '@/hooks/metricas/query-keys-metricas'
import ExpectedPremiumProjectionChartClient from './expected-premium-projection-chart-client'

/**
 * Proyección de prima esperada por mes: prefetch SSR de la métrica
 * `proyeccion-prima-esperada` (no depende de mes/año).
 *
 * La queryKey debe calzar exactamente con la de `useProyeccionPrimaEsperada`
 * para que la hidratación sea efectiva y no se dispare un segundo fetch.
 */
export default async function ExpectedPremiumProjectionChart({
  className,
}: {
  className?: string
}) {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: claveProyeccionPrimaEsperada(),
    queryFn: () => consultarProyeccionPrimaEsperada(),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ExpectedPremiumProjectionChartClient className={className} />
    </HydrationBoundary>
  )
}
