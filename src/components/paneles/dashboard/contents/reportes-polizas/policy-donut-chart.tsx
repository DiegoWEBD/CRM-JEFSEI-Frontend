import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query'
import {
  consultarPolizasPorComuna,
  consultarPolizasPorRamo,
  consultarPolizasPorRangoEdad,
  consultarPolizasPorSexo,
} from '@/aplicacion/metricas/consultas-dashboard'
import {
  clavePolizasPorComuna,
  clavePolizasPorRamo,
  clavePolizasPorRangoEdad,
  clavePolizasPorSexo,
} from '@/hooks/metricas/query-keys-metricas'
import { filtrosInicialesDashboard } from '@/lib/filtros-dashboard'
import PolicyDonutChartClient, {
  type MetricaDonutPolizas,
} from './policy-donut-chart-client'

/**
 * Cada métrica de pólizas (`polizas-por-comuna`, `polizas-por-sexo`,
 * `polizas-por-rango-edad`, `polizas-por-ramo`) tiene su propia tarjeta
 * donut: este wrapper hace el prefetch SSR del endpoint correspondiente y
 * la versión cliente refetchea al cambiar mes/año (la queryKey cambia).
 */
const CONSULTAS_DONUT: Record<
  MetricaDonutPolizas,
  {
    clave: (filtros: { mes?: number; year?: number }) => readonly unknown[]
    consultar: (mes?: number, year?: number) => Promise<unknown>
  }
> = {
  comuna: { clave: clavePolizasPorComuna, consultar: consultarPolizasPorComuna },
  sexo: { clave: clavePolizasPorSexo, consultar: consultarPolizasPorSexo },
  'rango-edad': {
    clave: clavePolizasPorRangoEdad,
    consultar: consultarPolizasPorRangoEdad,
  },
  ramo: { clave: clavePolizasPorRamo, consultar: consultarPolizasPorRamo },
}

export default async function PolicyDonutChart({
  title,
  metrica,
  className,
}: {
  title: string
  metrica: MetricaDonutPolizas
  className?: string
}) {
  const filtros = filtrosInicialesDashboard()
  const queryClient = new QueryClient()
  const { clave, consultar } = CONSULTAS_DONUT[metrica]

  await queryClient.prefetchQuery({
    queryKey: clave(filtros),
    queryFn: () => consultar(filtros.mes, filtros.year),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PolicyDonutChartClient
        title={title}
        metrica={metrica}
        className={className}
      />
    </HydrationBoundary>
  )
}
