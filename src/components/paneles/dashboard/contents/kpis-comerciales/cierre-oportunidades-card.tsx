import { Card, CardContent } from '@/components/card'

type CierreOportunidadesCardProps = {
  tasa: number
  ganados: number
  cerrados: number
}

export default function CierreOportunidadesCard({ tasa, ganados, cerrados }: CierreOportunidadesCardProps) {
  return (
    <Card className='border-border bg-card shadow-none'>
      <CardContent className='p-3.5'>
        <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>
          Cierre de oportunidades
        </p>
        <p className='mt-1 text-2xl font-semibold tabular-nums tracking-tight text-foreground sm:text-[1.75rem]'>
          {tasa.toFixed(2)}%
        </p>
        <p className='mt-0.5 text-xs text-muted-foreground'>
          {ganados} ganadas / {cerrados} cerradas
        </p>
      </CardContent>
    </Card>
  )
}
