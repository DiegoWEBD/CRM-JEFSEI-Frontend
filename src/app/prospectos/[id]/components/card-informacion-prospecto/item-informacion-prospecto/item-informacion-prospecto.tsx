import { classname } from '@/lib/class-name'

type ItemInformacionProspectoProps = {
	label: string
	value?: string | boolean | number | null
	className?: string
	highlightMissing?: boolean
}

export default function ItemInformacionProspecto({
	label,
	value,
	className,
	highlightMissing,
}: ItemInformacionProspectoProps) {
	let texto = ''

	if (value === undefined || value === null) texto = '—'
	else if (typeof value === 'boolean') texto = value ? 'Sí' : 'No'
	else if (typeof value === 'number') texto = value.toString()
	else texto = value.trim()

	return (
		<div
			className={classname(
				'min-w-0 space-y-0.5',
				highlightMissing && 'rounded-sm bg-warning/6 px-1 -mx-1',
				className,
			)}
		>
			<p className='text-xs font-medium text-muted-foreground'>{label}</p>
			<p
				className={classname(
					'text-sm leading-snug text-foreground',
					texto === '—' && 'text-muted-foreground',
					highlightMissing && texto === '—' && 'text-warning/90',
				)}
			>
				{texto}
			</p>
		</div>
	)
}
