import { classname } from '@/lib/class-name'

export default function TableHeader({
	className,
	...props
}: React.ComponentProps<'thead'>) {
	return (
		<thead
			data-slot='table-header'
			className={classname('[&_tr]:border-b', className)}
			{...props}
		/>
	)
}
