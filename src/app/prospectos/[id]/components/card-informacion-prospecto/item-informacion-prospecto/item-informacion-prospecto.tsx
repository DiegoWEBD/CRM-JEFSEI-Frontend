import { Badge } from '@/components/badge'
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
		<div className={classname('min-w-0 space-y-0.5', className)}>
			<p className='text-xs font-medium text-muted-foreground'>{label}</p>
			{!highlightMissing && (
				<p className='text-sm leading-snug text-foreground'>{texto}</p>
			)}
			{highlightMissing && (
				<Badge variant='pastel-amber' className='w-full justify-start py-1.5'>
					{texto}
				</Badge>
			)}
		</div>
	)
}
