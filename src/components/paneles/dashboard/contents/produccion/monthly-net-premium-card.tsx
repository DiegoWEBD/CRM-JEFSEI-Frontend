import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'

type MonthlyNetPremiumCardProps = {
  total_prima_neta: number
  variacion_mes_anterior: number
  mes_label: string
}

export default function MonthlyNetPremiumCard({
  total_prima_neta,
  variacion_mes_anterior,
  mes_label,
}: MonthlyNetPremiumCardProps) {
  const TendenciaIcon =
    variacion_mes_anterior > 0
      ? TrendingUp
      : variacion_mes_anterior < 0
        ? TrendingDown
        : Minus

  const tendenciaColor =
    variacion_mes_anterior > 0
      ? 'text-green-600'
      : variacion_mes_anterior < 0
        ? 'text-red-600'
        : 'text-muted-foreground'

  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardTitle className='text-xs font-medium text-muted-foreground'>
          Prima Neta Mensual
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex items-baseline gap-2'>
          <span className='text-3xl font-bold tabular-nums'>{total_prima_neta.toLocaleString('es-CL')}</span>
          <span className='text-sm text-muted-foreground'>UF</span>
        </div>
        <div className='mt-2 flex items-center gap-2'>
          <TendenciaIcon className={`h-4 w-4 ${tendenciaColor}`} />
          <span className={`text-sm font-medium ${tendenciaColor}`}>
            {variacion_mes_anterior > 0 ? '+' : ''}{variacion_mes_anterior}%
          </span>
          <span className='text-xs text-muted-foreground'>vs. mes anterior</span>
        </div>
        <p className='mt-1 text-xs text-muted-foreground'>{mes_label}</p>
      </CardContent>
    </Card>
  )
}
