import { classname } from '@/lib/class-name'

export default function Card({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot='card'
			className={classname(
				'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
				className,
			)}
			{...props}
		/>
	)
}
