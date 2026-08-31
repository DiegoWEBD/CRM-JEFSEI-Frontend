import { Card, CardContent } from '@/components/card'
import { AlertTriangle } from 'lucide-react'
import { formatUF } from '@/lib/uf'

type PrimaRiesgoCardProps = {
  primaUf: number
  polizas: number
}

export default function PrimaRiesgoCard({ primaUf, polizas }: PrimaRiesgoCardProps) {
  return (
    <Card className='border-border bg-card shadow-none'>
      <CardContent className='p-3.5'>
        <div className='flex items-center gap-2'>
          <AlertTriangle className='h-4 w-4 text-amber-600 dark:text-amber-400' aria-hidden />
          <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
            Prima en riesgo
          </p>
        </div>
        <p className='mt-1 text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-[1.75rem]'>
          {formatUF(primaUf)}
        </p>
        <p className='mt-0.5 text-xs text-muted-foreground'>
          {polizas} polizas proximas a vencer
        </p>
      </CardContent>
    </Card>
  )
}
