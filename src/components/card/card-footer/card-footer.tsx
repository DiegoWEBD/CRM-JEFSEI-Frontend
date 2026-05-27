import { classname } from '@/lib/class-name'

export default function CardFooter({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot='card-footer'
			className={classname(
				'flex items-center px-6 [.border-t]:pt-6',
				className,
			)}
			{...props}
		/>
	)
}
