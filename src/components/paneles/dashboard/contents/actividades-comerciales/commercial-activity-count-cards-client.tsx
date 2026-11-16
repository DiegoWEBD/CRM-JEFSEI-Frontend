'use client'

import { Calendar, Mail, MapPin, MessageSquare, Phone } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useFiltrosDashboard } from '../../filtros-dashboard-context'
import { MetricaCardSkeleton } from '../../shared/metrica-card-skeleton'
import { useActividadesPorTipo } from '@/hooks/metricas/use-actividades-por-tipo'
import { CommercialActivityCountCard } from './commercial-activity-count-card'

const ICONOS_TIPO: Record<string, LucideIcon> = {
  llamada: Phone,
  correo: Mail,
  visita: MapPin,
  mensaje: MessageSquare,
  reunion: Calendar,
}

const ORDEN_CARDS = ['llamada', 'mensaje', 'correo', 'reunion', 'visita']

export default function CommercialActivityCountCardsClient() {
  const { mes, year } = useFiltrosDashboard()
  const { data, isLoading, isError } = useActividadesPorTipo(mes, year)

  if (isLoading) return <MetricaCardSkeleton alto={64} />
  if (isError || !data) {
    return (
      <p className='py-4 text-center text-xs text-muted-foreground'>
        Error al cargar las gestiones por tipo.
      </p>
    )
  }

  const conteos = ORDEN_CARDS
    .map((tipo) => {
      const found = data.find((t) => t.tipo === tipo)
      if (!found) return null
      const total = found.concretadas + found.pendientes
      return { tipo, label: tipo.charAt(0).toUpperCase() + tipo.slice(1), cantidad: total }
    })
    .filter(Boolean) as { tipo: string; label: string; cantidad: number }[]

  return (
    <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5'>
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
  )
}
