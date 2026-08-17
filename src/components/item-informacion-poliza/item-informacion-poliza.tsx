import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

type ItemInformacionPolizaProps = {
  label: string
  children?: ReactNode
  value?: string | number | boolean | null
  icon?: LucideIcon
  className?: string
}

export default function ItemInformacionPoliza({
  label,
  children,
  value,
  icon: Icon,
  className,
}: ItemInformacionPolizaProps) {
  let texto = ''

  if (value === undefined || value === null) texto = 'â€”'
  else if (typeof value === 'boolean') texto = value ? 'SÃ­' : 'No'
  else texto = String(value)

  return (
    <div className={cn('min-w-0 space-y-0.5', className)}>
      <div className='flex items-center gap-1.5'>
        {Icon && <Icon className='h-3 w-3 shrink-0 text-muted-foreground' aria-hidden />}
        <p className='text-xs font-medium text-muted-foreground'>{label}</p>
      </div>
      {children ?? (
        <p
          className={cn(
            'text-sm leading-snug text-foreground',
            texto === 'â€”' && 'text-muted-foreground',
          )}
        >
          {texto}
        </p>
      )}
    </div>
  )
}
