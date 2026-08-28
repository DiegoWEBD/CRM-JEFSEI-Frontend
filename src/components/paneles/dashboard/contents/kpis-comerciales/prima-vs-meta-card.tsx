import { Card, CardContent } from '@/components/card'
import { Progress } from '@/components/progress'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatUF } from '@/lib/uf'

type PrimaVsMetaCardProps = {
  primaNeta: number
  meta: number
  cumplimiento: number
}

export default function PrimaVsMetaCard({ primaNeta, meta, cumplimiento }: PrimaVsMetaCardProps) {
  const diferencia = primaNeta - meta
  const positiva = diferencia >= 0

  return (
    <Card className='border-border bg-card shadow-none'>
      <CardContent className='p-3.5 space-y-3'>
        <div className='flex items-baseline justify-between'>
          <div>
            <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
              Prima neta vs meta
            </p>
            <p className='mt-1 text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-[1.75rem]'>
              {cumplimiento.toFixed(2)}%
            </p>
          </div>
          <div className='text-right'>
            <p className='text-xs text-muted-foreground'>Meta</p>
            <p className='text-sm font-medium tabular-nums text-foreground'>
              {meta > 0 ? formatUF(meta) : 'Sin meta'}
            </p>
          </div>
        </div>

        <Progress value={Math.min(cumplimiento, 100)} className='h-2' />

        <div className='flex items-center justify-between text-xs'>
          <span className='text-muted-foreground'>
            Prima: {formatUF(primaNeta)}
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-0.5 font-medium',
              positiva
                ? 'text-emerald-700 dark:text-emerald-300'
                : 'text-amber-700 dark:text-amber-300',
            )}
          >
            {positiva ? (
              <TrendingUp className='h-2.5 w-2.5' aria-hidden />
            ) : (
              <TrendingDown className='h-2.5 w-2.5' aria-hidden />
            )}
            {positiva ? '+' : ''}
            {formatUF(diferencia)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
