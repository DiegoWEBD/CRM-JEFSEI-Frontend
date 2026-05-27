import { classname } from '@/lib/class-name'

export default function CardContent({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot='card-content'
			className={classname('px-6', className)}
			{...props}
		/>
	)
}
