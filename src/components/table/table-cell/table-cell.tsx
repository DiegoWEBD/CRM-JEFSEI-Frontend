import { classname } from '@/lib/class-name'

export default function TableCell({
	className,
	...props
}: React.ComponentProps<'td'>) {
	return (
		<td
			data-slot='table-cell'
			className={classname(
				'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5',
				className,
			)}
			{...props}
		/>
	)
}
