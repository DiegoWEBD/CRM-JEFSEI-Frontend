import { cn } from '@/lib/utils'

export function DashboardSectionHeading({
  title,
  description,
  className,
}: {
  title: string
  description?: string
  className?: string
}) {
  return (
    <div className={cn('space-y-0.5', className)}>
      <h2 className='text-sm font-semibold tracking-tight text-foreground'>{title}</h2>
      {description ? (
        <p className='text-xs leading-relaxed text-muted-foreground'>{description}</p>
      ) : null}
    </div>
  )
}
