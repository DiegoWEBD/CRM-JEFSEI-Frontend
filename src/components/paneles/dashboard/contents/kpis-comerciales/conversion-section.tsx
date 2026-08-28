'use client'

import { KpisComercialesJson } from '@/aplicacion/metricas/use-cases/obtener-kpis-comerciales/dto/kpis-comerciales-json'
import { DashboardSectionHeading } from '../../shared/dashboard-section-heading'
import ConversionCard from './conversion-card'
import CierreOportunidadesCard from './cierre-oportunidades-card'

type ConversionSectionProps = {
  data: KpisComercialesJson['conversion_prospectos']
  cierre: KpisComercialesJson['cierre_oportunidades']
}

export default function ConversionSection({ data, cierre }: ConversionSectionProps) {
  return (
    <section className='space-y-4' aria-labelledby='conversion'>
      <DashboardSectionHeading title='Conversion' />
      <div className='grid gap-2.5 lg:grid-cols-2'>
        <ConversionCard
          tasa={data.tasa_pct}
          convertidos={data.prospectos_convertidos}
          total={data.total_prospectos}
        />
        <CierreOportunidadesCard
          tasa={cierre.tasa_pct}
          ganados={cierre.procesos_ganados}
          cerrados={cierre.procesos_cerrados}
        />
      </div>
    </section>
  )
}
