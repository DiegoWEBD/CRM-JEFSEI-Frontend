import { classname } from '@/lib/class-name'

export default function TableCaption({
	className,
	...props
}: React.ComponentProps<'caption'>) {
	return (
		<caption
			data-slot='table-caption'
			className={classname('text-muted-foreground mt-4 text-sm', className)}
			{...props}
		/>
	)
}
