import { classname } from '@/lib/class-name'

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
			className={classname(
				'flex items-center justify-between gap-1 rounded-md border border-border-80 bg-muted/15 px-2 py-1',
				className,
			)}
		>
			<span className='text-[9px] uppercase tracking-wide text-muted-foreground'>
				{label}
			</span>
			<span className='text-sm font-semibold tabular-nums text-foreground'>
				{kpi}
			</span>
		</div>
	)
}
