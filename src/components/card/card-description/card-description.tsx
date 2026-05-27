import { classname } from '@/lib/class-name'

export default function CardDescription({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot='card-description'
			className={classname('text-muted-foreground text-sm', className)}
			{...props}
		/>
	)
}
