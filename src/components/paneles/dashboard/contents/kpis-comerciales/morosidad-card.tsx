import { Card, CardContent } from '@/components/card'
import { BadgeDollarSign } from 'lucide-react'

type MorosidadCardProps = {
  tasa: number
  morosas: number
  total: number
}

export default function MorosidadCard({ tasa, morosas, total }: MorosidadCardProps) {
  return (
    <Card className='border-border bg-card shadow-none'>
      <CardContent className='p-3.5'>
        <div className='flex items-center gap-2'>
          <BadgeDollarSign className='h-4 w-4 text-red-600 dark:text-red-400' aria-hidden />
          <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
            Tasa de morosidad
          </p>
        </div>
        <p className='mt-1 text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-[1.75rem]'>
          {tasa.toFixed(2)}%
        </p>
        <p className='mt-0.5 text-xs text-muted-foreground'>
          {morosas} morosas / {total} cuotas totales
        </p>
      </CardContent>
    </Card>
  )
}
