'use client'

import { KpisComercialesJson } from '@/aplicacion/metricas/use-cases/obtener-kpis-comerciales/dto/kpis-comerciales-json'
import { DashboardSectionHeading } from '../../shared/dashboard-section-heading'
import MorosidadCard from './morosidad-card'

type CobranzaKpiSectionProps = {
  data: KpisComercialesJson['morosidad']
}

export default function CobranzaKpiSection({ data }: CobranzaKpiSectionProps) {
  return (
    <section className='space-y-4' aria-labelledby='cobranza-kpi'>
      <DashboardSectionHeading title='Cobranza' />
      <MorosidadCard
        tasa={data.tasa_pct}
        morosas={data.cuotas_morosas}
        total={data.total_cuotas}
      />
    </section>
  )
}
