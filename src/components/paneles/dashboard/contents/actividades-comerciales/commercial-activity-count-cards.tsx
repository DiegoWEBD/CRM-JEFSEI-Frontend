import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query'
import { consultarActividadesPorTipo } from '@/aplicacion/metricas/consultas-dashboard'
import { claveActividadesPorTipo } from '@/hooks/metricas/query-keys-metricas'
import { filtrosInicialesDashboard } from '@/lib/filtros-dashboard'
import CommercialActivityCountCardsClient from './commercial-activity-count-cards-client'

/**
 * Gestiones por tipo (cards de conteo): prefetch SSR de la métrica
 * `actividades-por-tipo`.
 *
 * La queryKey debe calzar exactamente con la de `useActividadesPorTipo`
 * para que la hidratación sea efectiva y no se dispare un segundo fetch.
 * Al cambiar mes/año la versión cliente hace refetch (la queryKey cambia).
 */
export default async function CommercialActivityCountCards() {
  const filtros = filtrosInicialesDashboard()
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: claveActividadesPorTipo(filtros),
    queryFn: () => consultarActividadesPorTipo(filtros.mes, filtros.year),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CommercialActivityCountCardsClient />
    </HydrationBoundary>
  )
}
