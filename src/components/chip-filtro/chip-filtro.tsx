import { classname } from '@/lib/class-name'

type ChipFiltroProps = {
	activo: boolean
	onClick: () => void
	label: string
	count: number
}

export default function ChipFiltro({
	activo,
	onClick,
	label,
	count,
}: ChipFiltroProps) {
	return (
		<button
			type='button'
			onClick={onClick}
			className={classname(
				'hover:cursor-pointer inline-flex h-7 max-w-full items-center gap-1 rounded-full border px-2.5 text-sm font-medium transition-colors',
				activo
					? 'border-primary bg-primary text-primary-foreground shadow-none'
					: 'border-border bg-background text-foreground hover:bg-sidebar-accent',
			)}
		>
			<span className='truncate'>{label}</span>
			<span
				className={classname(
					'shrink-0 tabular-nums text-xs',
					activo ? 'text-primary-foreground/90' : 'text-muted-foreground',
				)}
			>
				({count})
			</span>
		</button>
	)
}
