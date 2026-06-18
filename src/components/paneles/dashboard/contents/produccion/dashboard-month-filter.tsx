import { Calendar } from 'lucide-react'

type DashboardMonthFilterProps = {
  mesLabel: string
}

export default function DashboardMonthFilter({ mesLabel }: DashboardMonthFilterProps) {
  return (
    <div className='inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground'>
      <Calendar className='h-4 w-4' />
      <span>Mes en consulta: <strong className='text-foreground'>{mesLabel}</strong></span>
    </div>
  )
}
