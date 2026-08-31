'use client'

import { KpisComercialesJson } from '@/aplicacion/metricas/use-cases/obtener-kpis-comerciales/dto/kpis-comerciales-json'
import { DashboardSectionHeading } from '../../shared/dashboard-section-heading'
import TiempoCierreCard from './tiempo-cierre-card'
import AgingPipelineChart from './aging-pipeline-chart'

type PipelineSectionProps = {
  tiempoCierre: KpisComercialesJson['tiempo_promedio_cierre']
  aging: KpisComercialesJson['aging_pipeline']
}

export default function PipelineSection({ tiempoCierre, aging }: PipelineSectionProps) {
  return (
    <section className='space-y-4' aria-labelledby='pipeline'>
      <DashboardSectionHeading title='Pipeline' />
      <div className='grid gap-2.5 lg:grid-cols-2'>
        <TiempoCierreCard promedioDias={tiempoCierre.promedio_dias} />
        <AgingPipelineChart data={aging} />
      </div>
    </section>
  )
}
