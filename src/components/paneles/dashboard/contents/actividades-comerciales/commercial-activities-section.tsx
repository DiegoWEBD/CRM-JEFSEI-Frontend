'use client'

import { Calendar, Mail, MapPin, MessageSquare, Phone } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { MetricasDashboardGerenteJson } from '@/aplicacion/dashboard-gerente/use-cases/obtener-metricas-dashboard-gerente/dto/metricas-dashboard-gerente-json'
import { DashboardSectionHeading } from '../../shared/dashboard-section-heading'
import { CommercialActivityFilters } from './commercial-activity-filters'
import CommercialActivityCompletionSummary from './commercial-activity-completion-summary'
import { CommercialActivityCountCard } from './commercial-activity-count-card'
import CommercialActivitiesBarChart from './commercial-activities-bar-chart'

const ICONOS_TIPO: Record<string, LucideIcon> = {
  llamada: Phone,
  correo: Mail,
  visita: MapPin,
  mensaje: MessageSquare,
  reunion: Calendar,
}

const ORDEN_CARDS = ['llamada', 'mensaje', 'correo', 'reunion', 'visita']

type Props = {
  data: MetricasDashboardGerenteJson['actividades_comerciales']
}

export default function CommercialActivitiesSection({ data }: Props) {
  const conteos = ORDEN_CARDS
    .map((tipo) => {
      const found = data.por_tipo.find((t) => t.tipo === tipo)
      if (!found) return null
      const total = found.concretadas + found.pendientes
      return { tipo, label: tipo.charAt(0).toUpperCase() + tipo.slice(1), cantidad: total }
    })
    .filter(Boolean) as { tipo: string; label: string; cantidad: number }[]

  const chartData = data.por_tipo.map((t) => ({
    label: t.tipo.charAt(0).toUpperCase() + t.tipo.slice(1),
    value: t.concretadas,
  }))

  return (
    <section
      className='space-y-3 rounded-xl border border-border/80 bg-muted/[0.02] p-3.5 pt-4 sm:p-4'
      aria-labelledby='gestiones-comerciales'
    >
      <DashboardSectionHeading title='Gestiones comerciales' />

      <CommercialActivityFilters />

      <div className='space-y-4' aria-live='polite'>
        <CommercialActivityCompletionSummary data={data.resumen} />

        <p className='text-[11px] text-muted-foreground'>
          Total visible:{' '}
          <span className='font-medium tabular-nums text-foreground'>
            {data.resumen.agendadas.toLocaleString('es-CL')}
          </span>
        </p>

        <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5'>
          {conteos.map((c) => {
            const Icon = ICONOS_TIPO[c.tipo]
            return (
              <CommercialActivityCountCard
                key={c.tipo}
                label={c.label}
                cantidad={c.cantidad}
                icon={Icon}
              />
            )
          })}
        </div>

        <CommercialActivitiesBarChart data={chartData} />
      </div>
    </section>
  )
}
