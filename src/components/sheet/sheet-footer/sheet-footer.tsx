import { classname } from '@/lib/class-name'

export default function SheetFooter({
	className,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot='sheet-footer'
			className={classname('mt-auto flex flex-col gap-2 p-4', className)}
			{...props}
		/>
	)
}
