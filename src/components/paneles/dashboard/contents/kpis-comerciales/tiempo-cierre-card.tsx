import { Card, CardContent } from '@/components/card'
import { Clock } from 'lucide-react'

type TiempoCierreCardProps = {
  promedioDias: number
}

export default function TiempoCierreCard({ promedioDias }: TiempoCierreCardProps) {
  return (
    <Card className='border-border bg-card shadow-none'>
      <CardContent className='p-3.5'>
        <div className='flex items-center gap-2'>
          <Clock className='h-4 w-4 text-muted-foreground' aria-hidden />
          <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
            Tiempo promedio de cierre
          </p>
        </div>
        <p className='mt-1 text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-[1.75rem]'>
          {promedioDias.toFixed(1)} <span className='text-base font-normal text-muted-foreground'>dias</span>
        </p>
      </CardContent>
    </Card>
  )
}
