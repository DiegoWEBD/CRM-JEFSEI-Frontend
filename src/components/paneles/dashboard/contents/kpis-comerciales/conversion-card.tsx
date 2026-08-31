import { Card, CardContent } from '@/components/card'

type ConversionCardProps = {
  tasa: number
  convertidos: number
  total: number
}

export default function ConversionCard({ tasa, convertidos, total }: ConversionCardProps) {
  return (
    <Card className='border-border bg-card shadow-none'>
      <CardContent className='p-3.5'>
        <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
          Conversion prospectos
        </p>
        <p className='mt-1 text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-[1.75rem]'>
          {tasa.toFixed(2)}%
        </p>
        <p className='mt-0.5 text-xs text-muted-foreground'>
          {convertidos} / {total} prospectos
        </p>
      </CardContent>
    </Card>
  )
}
