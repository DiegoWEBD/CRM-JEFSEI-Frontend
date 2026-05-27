import { classname } from '@/lib/class-name'

export default function CardTitle({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot='card-title'
			className={classname('leading-none font-semibold', className)}
			{...props}
		/>
	)
}
