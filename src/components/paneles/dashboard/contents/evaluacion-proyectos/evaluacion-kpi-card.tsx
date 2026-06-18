import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'

type EvaluacionKpiCardProps = {
  label: string
  value: string | number
  hint?: string
}

export default function EvaluacionKpiCard({
  label,
  value,
  hint,
}: EvaluacionKpiCardProps) {
  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardTitle className='text-xs font-medium text-muted-foreground'>
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-2xl font-bold tabular-nums'>{value}</p>
        {hint && <p className='mt-1 text-xs text-muted-foreground'>{hint}</p>}
      </CardContent>
    </Card>
  )
}
