import { Card, CardContent } from '@/components/card'
import { RefreshCw } from 'lucide-react'

type RenovacionCardProps = {
  tasa: number
  renovadas: number
  vencidas: number
}

export default function RenovacionCard({ tasa, renovadas, vencidas }: RenovacionCardProps) {
  return (
    <Card className='border-border bg-card shadow-none'>
      <CardContent className='p-3.5'>
        <div className='flex items-center gap-2'>
          <RefreshCw className='h-4 w-4 text-muted-foreground' aria-hidden />
          <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
            Tasa de renovacion
          </p>
        </div>
        <p className='mt-1 text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-[1.75rem]'>
          {tasa.toFixed(2)}%
        </p>
        <p className='mt-0.5 text-xs text-muted-foreground'>
          {renovadas} renovadas / {vencidas} vencidas
        </p>
      </CardContent>
    </Card>
  )
}
