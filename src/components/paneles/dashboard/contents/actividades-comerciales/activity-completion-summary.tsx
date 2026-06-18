import { ResumenActividades } from '@/aplicacion/dashboard-gerente/use-cases/obtener-metricas-dashboard-gerente/dto/metricas-dashboard-gerente-json'
import { Card, CardContent } from '@/components/card'
import { CheckCircle2, Clock, CalendarX, Target } from 'lucide-react'

type ActivityCompletionSummaryProps = {
  data: ResumenActividades
}

export default function ActivityCompletionSummary({ data }: ActivityCompletionSummaryProps) {
  const items = [
    { label: 'Agendadas', value: data.agendadas, icon: Clock, color: 'text-blue-600' },
    { label: 'Concretadas', value: data.concretadas, icon: CheckCircle2, color: 'text-green-600' },
    { label: 'Pendientes', value: data.pendientes, icon: CalendarX, color: 'text-amber-600' },
    { label: '% Cumplimiento', value: data.porcentaje_cumplimiento, icon: Target, color: 'text-purple-600', suffix: '%' },
  ]

  return (
    <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
      {items.map(item => {
        const Icon = item.icon
        return (
          <Card key={item.label}>
            <CardContent className='flex items-center gap-3 p-4'>
              <Icon className={`h-8 w-8 shrink-0 ${item.color}`} />
              <div>
                <p className='text-xs text-muted-foreground'>{item.label}</p>
                <p className='text-xl font-bold tabular-nums'>
                  {item.value}{item.suffix ?? ''}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
