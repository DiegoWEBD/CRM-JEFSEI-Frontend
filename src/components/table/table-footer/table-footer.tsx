import { classname } from '@/lib/class-name'

export default function TableFooter({
	className,
	...props
}: React.ComponentProps<'tfoot'>) {
	return (
		<tfoot
			data-slot='table-footer'
			className={classname(
				'bg-muted/50 border-t font-medium [&>tr]:last:border-b-0',
				className,
			)}
			{...props}
		/>
	)
}
