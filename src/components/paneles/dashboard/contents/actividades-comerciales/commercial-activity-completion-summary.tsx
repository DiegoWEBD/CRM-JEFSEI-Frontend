'use client'

import { Card, CardContent } from '@/components/card'
import type { ResumenActividades } from '@/aplicacion/dashboard-gerente/use-cases/obtener-metricas-dashboard-gerente/dto/metricas-dashboard-gerente-json'

export default function CommercialActivityCompletionSummary({
  data,
}: {
  data: ResumenActividades
}) {
  return (
    <Card className='border-border bg-muted/15 shadow-none'>
      <CardContent className='grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-4'>
        <div>
          <p className='text-xs font-medium text-muted-foreground'>Gestiones concretadas</p>
          <p className='mt-0.5 text-lg font-semibold tabular-nums text-foreground'>
            {data.concretadas.toLocaleString('es-CL')}{' '}
            <span className='text-sm font-normal text-muted-foreground'>
              de {data.agendadas.toLocaleString('es-CL')}
            </span>
          </p>
          <p className='text-sm font-medium text-emerald-700 dark:text-emerald-300'>
            {data.porcentaje_cumplimiento}% cumplimiento
          </p>
        </div>
        <div>
          <p className='text-xs text-muted-foreground'>Agendadas</p>
          <p className='text-lg font-semibold tabular-nums'>{data.agendadas.toLocaleString('es-CL')}</p>
        </div>
        <div>
          <p className='text-xs text-muted-foreground'>Concretadas</p>
          <p className='text-lg font-semibold tabular-nums'>{data.concretadas.toLocaleString('es-CL')}</p>
        </div>
        <div>
          <p className='text-xs text-muted-foreground'>Pendientes</p>
          <p className='text-lg font-semibold tabular-nums'>{data.pendientes.toLocaleString('es-CL')}</p>
        </div>
      </CardContent>
    </Card>
  )
}
