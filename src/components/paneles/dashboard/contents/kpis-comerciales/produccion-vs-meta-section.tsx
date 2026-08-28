'use client'

import { KpisComercialesJson } from '@/aplicacion/metricas/use-cases/obtener-kpis-comerciales/dto/kpis-comerciales-json'
import { DashboardSectionHeading } from '../../shared/dashboard-section-heading'
import PrimaVsMetaCard from './prima-vs-meta-card'

type ProduccionVsMetaSectionProps = {
  data: KpisComercialesJson['prima_vs_meta']
}

export default function ProduccionVsMetaSection({ data }: ProduccionVsMetaSectionProps) {
  return (
    <section className='space-y-4' aria-labelledby='produccion-vs-meta'>
      <DashboardSectionHeading title='Produccion vs meta' />
      <PrimaVsMetaCard
        primaNeta={data.prima_neta_uf}
        meta={data.meta_uf}
        cumplimiento={data.cumplimiento_pct}
      />
    </section>
  )
}
