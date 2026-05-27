import { classname } from '@/lib/class-name'

export default function TableRow({
	className,
	...props
}: React.ComponentProps<'tr'>) {
	return (
		<tr
			data-slot='table-row'
			className={classname(
				'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
				className,
			)}
			{...props}
		/>
	)
}
