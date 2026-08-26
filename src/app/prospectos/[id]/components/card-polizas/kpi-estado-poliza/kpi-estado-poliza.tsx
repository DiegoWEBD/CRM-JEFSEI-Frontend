import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

type KpiEstadoPolizaProps = {
	label: string
	kpi: number | string
	className?: string
	icon?: LucideIcon
}

export default function KpiEstadoPoliza({
	label,
	kpi,
	className,
	icon: Icon,
}: KpiEstadoPolizaProps) {
	return (
		<div
			className={cn(
				'flex items-center gap-3 rounded-md border px-3 py-2.5',
				className ?? 'border-border/80 bg-muted/15',
			)}
		>
			{Icon && (
				<div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-background/50'>
					<Icon className='h-4 w-4 text-muted-foreground' aria-hidden />
				</div>
			)}
			<div className='min-w-0'>
				<p className='text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>
					{label}
				</p>
				<p className='text-xl font-bold tabular-nums text-foreground'>
					{kpi}
				</p>
			</div>
		</div>
	)
}
