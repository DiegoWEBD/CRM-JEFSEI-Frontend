'use client'

import { KpisComercialesJson } from '@/aplicacion/metricas/use-cases/obtener-kpis-comerciales/dto/kpis-comerciales-json'
import { DashboardSectionHeading } from '../../shared/dashboard-section-heading'
import RenovacionCard from './renovacion-card'
import PrimaRiesgoCard from './prima-riesgo-card'

type RetencionSectionProps = {
  renovacion: KpisComercialesJson['renovacion']
  primaRiesgo: KpisComercialesJson['prima_en_riesgo']
}

export default function RetencionSection({ renovacion, primaRiesgo }: RetencionSectionProps) {
  return (
    <section className='space-y-4' aria-labelledby='retencion'>
      <DashboardSectionHeading title='Retencion' />
      <div className='grid gap-2.5 lg:grid-cols-2'>
        <RenovacionCard
          tasa={renovacion.tasa_pct}
          renovadas={renovacion.polizas_renovadas}
          vencidas={renovacion.polizas_vencidas}
        />
        <PrimaRiesgoCard
          primaUf={primaRiesgo.prima_uf}
          polizas={primaRiesgo.polizas}
        />
      </div>
    </section>
  )
}
