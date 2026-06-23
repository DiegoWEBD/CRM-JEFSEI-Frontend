'use client'

import { ProductionHorizontalBarChart } from '../produccion/production-horizontal-bar-chart'
import type { ItemCantidad } from '@/aplicacion/dashboard-gerente/use-cases/obtener-metricas-dashboard-gerente/dto/metricas-dashboard-gerente-json'

type EvaluacionBarChartProps = {
  title: string
  data: ItemCantidad[]
  description?: string
}

export default function EvaluacionBarChart({
  title,
  data,
  description,
}: EvaluacionBarChartProps) {
  const items = data.map((d) => ({
    nombre: d.nombre,
    valor: d.cantidad,
  }))

  return (
    <ProductionHorizontalBarChart
      title={title}
      description={description ?? 'Ordenado de mayor a menor'}
      items={items}
      variant='count'
    />
  )
}
