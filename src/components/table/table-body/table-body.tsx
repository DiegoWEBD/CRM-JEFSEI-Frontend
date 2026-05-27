import { classname } from '@/lib/class-name'

export default function TableBody({
	className,
	...props
}: React.ComponentProps<'tbody'>) {
	return (
		<tbody
			data-slot='table-body'
			className={classname('[&_tr:last-child]:border-0', className)}
			{...props}
		/>
	)
}
