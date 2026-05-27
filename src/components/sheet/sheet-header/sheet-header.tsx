import { classname } from '@/lib/class-name'

export default function SheetHeader({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot='sheet-header'
			className={classname('flex flex-col gap-1.5 p-4', className)}
			{...props}
		/>
	)
}
