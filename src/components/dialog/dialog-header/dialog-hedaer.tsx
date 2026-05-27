import { classname } from '@/lib/class-name'

export default function DialogHeader({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot='dialog-header'
			className={classname(
				'flex flex-col gap-2 text-center sm:text-left',
				className,
			)}
			{...props}
		/>
	)
}
