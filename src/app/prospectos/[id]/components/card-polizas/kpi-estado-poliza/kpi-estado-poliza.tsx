import { cn } from '@/lib/utils'

type KpiEstadoPolizaProps = {
	label: string
	kpi: number | string
	className?: string
}

export default function KpiEstadoPoliza({
	label,
	kpi,
	className,
}: KpiEstadoPolizaProps) {
	return (
		<div
			className={cn(
				'rounded-md border px-3 py-2',
				className ?? 'border-border/80 bg-muted/15',
			)}
		>
			<p className='text-[10px] uppercase tracking-wide text-muted-foreground'>
				{label}
			</p>
			<p className='mt-0.5 text-lg font-semibold tabular-nums text-foreground'>
				{kpi}
			</p>
		</div>
	)
}
